import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

// SECURITY: Production-grade rate limiters
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "AI rate limit exceeded." },
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Hardened Security Headers
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", "data:"],
        connectSrc: ["'self'"],
      },
    },
    hsts: true,
    noSniff: true,
    referrerPolicy: { policy: "strict-origin-when-cross-origin" },
  }));

  // Seed Database
  await storage.seedDatabase();

  // Apply Global API Rate Limit
  app.use("/api", apiLimiter);

  // Strategy Goals
  app.get(api.strategyGoals.list.path, async (_req, res) => {
    try {
      const goals = await storage.getStrategyGoals();
      res.json(goals);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch strategy goals" });
    }
  });

  // Projects
  app.get(api.projects.list.path, async (_req, res) => {
    try {
      const projects = await storage.getProjects();
      res.json(projects);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });

  app.get(api.projects.get.path, async (req, res) => {
    try {
      const project = await storage.getProject(Number(req.params.id));
      if (!project) return res.status(404).json({ message: "Project not found" });
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });

  app.post(api.projects.create.path, async (req, res) => {
    try {
      const input = api.projects.create.input.parse(req.body);
      const project = await storage.createProject({
        ...input,
        ownerId: "system_user"
      });
      res.status(201).json(project);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Compliance Simulator (Deterministic Production Rules)
  app.post(api.compliance.simulate.path, aiLimiter, async (req, res) => {
    try {
      const input = api.compliance.simulate.input.parse(req.body);
      
      // Production Rule Engine (Replcaing AI with hardened logic)
      const prohibitedKeywords = [
        "subliminal", "exploit vulnerability", "social scoring", 
        "biometric identification", "remote biometric", "emotion recognition"
      ];
      
      const foundKeywords = prohibitedKeywords.filter(k => 
        input.projectDescription.toLowerCase().includes(k) || 
        input.intendedUse.toLowerCase().includes(k)
      );

      const isProhibited = foundKeywords.length > 0;
      const riskLevel = isProhibited ? "Unacceptable" : "Minimal";
      const feedback = isProhibited 
        ? `Project violates Article 5 of EU AI Act. Detected prohibited practices: ${foundKeywords.join(", ")}.`
        : "Project does not appear to engage in prohibited practices under current evaluation rules.";

      const check = await storage.createComplianceCheck({
        ...input,
        userId: "system_user",
        riskLevel,
        feedback,
        isProhibited
      });

      res.json(check);
    } catch (err) {
      res.status(500).json({ message: "Simulation failed" });
    }
  });

  app.get(api.compliance.history.path, async (_req, res) => {
    try {
      const history = await storage.getComplianceHistory("system_user");
      res.json(history);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch history" });
    }
  });

  // Resources
  app.get(api.resources.list.path, async (_req, res) => {
    try {
      const resources = await storage.getResources();
      res.json(resources);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch resources" });
    }
  });

  return httpServer;
}
