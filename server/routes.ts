import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "../shared/routes";
import { z } from "zod";
import rateLimit from "express-rate-limit";

// SECURITY: Rate limiters
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
  // 3. Seed Database
  await storage.seedDatabase();

  // 4. Apply Global API Rate Limit
  app.use("/api", apiLimiter);

  // === APP ROUTES ===

  // Strategy Goals
  app.get(api.strategyGoals.list.path, async (_req, res) => {
    const goals = await storage.getStrategyGoals();
    res.json(goals);
  });

  // Projects
  app.get(api.projects.list.path, async (_req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.get(api.projects.get.path, async (req, res) => {
    const project = await storage.getProject(Number(req.params.id));
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  });

  app.post(api.projects.create.path, async (req, res) => {
    try {
      const input = api.projects.create.input.parse(req.body);
      const project = await storage.createProject({
        ...input,
        ownerId: "guest" // Simplified for now
      });
      res.status(201).json(project);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Compliance Simulator (Simplified without AI for initial migration)
  app.post(api.compliance.simulate.path, aiLimiter, async (req, res) => {
    try {
      const input = api.compliance.simulate.input.parse(req.body);
      
      const check = await storage.createComplianceCheck({
        ...input,
        userId: "guest",
        riskLevel: "Minimal",
        feedback: "Migration mode: AI analysis is currently disabled. Defaulting to Minimal risk."
      });

      res.json(check);
    } catch (err) {
      console.error("Compliance check error:", err);
      res.status(500).json({ message: "Simulation failed" });
    }
  });

  app.get(api.compliance.history.path, async (_req, res) => {
    const history = await storage.getComplianceHistory("guest");
    res.json(history);
  });

  // Resources
  app.get(api.resources.list.path, async (_req, res) => {
    const resources = await storage.getResources();
    res.json(resources);
  });

  return httpServer;
}
