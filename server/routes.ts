import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "../shared/routes";
import { z } from "zod";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { registerChatRoutes } from "./replit_integrations/chat";
import { openai } from "./replit_integrations/image/client"; // Reusing openai client
import rateLimit from "express-rate-limit";

// SECURITY: Rate limiters
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { message: "Too many requests, please try again later." },
  standardHeaders: true,
  legacyHeaders: false,
});

const aiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20, // Limit AI requests strictly (cost control)
  message: { message: "AI rate limit exceeded." },
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // 1. Setup Auth
  await setupAuth(app);
  registerAuthRoutes(app);

  // 2. Setup Chat Integration
  registerChatRoutes(app);

  // 3. Seed Database
  await storage.seedDatabase();

  // 4. Apply Global API Rate Limit
  app.use("/api", apiLimiter);

  // === APP ROUTES ===

  // Strategy Goals
  app.get(api.strategyGoals.list.path, async (req, res) => {
    const goals = await storage.getStrategyGoals();
    res.json(goals);
  });

  // Projects
  app.get(api.projects.list.path, async (req, res) => {
    const projects = await storage.getProjects();
    res.json(projects);
  });

  app.get(api.projects.get.path, async (req, res) => {
    const project = await storage.getProject(Number(req.params.id));
    if (!project) return res.status(404).json({ message: "Project not found" });
    res.json(project);
  });

  app.post(api.projects.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const input = api.projects.create.input.parse(req.body);
      const project = await storage.createProject({
        ...input,
        ownerId: (req.user as any).claims.sub
      });
      res.status(201).json(project);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  // Compliance Simulator (with AI) - PROTECTED + RATE LIMITED
  app.post(api.compliance.simulate.path, aiLimiter, async (req, res) => {
    try {
      const input = api.compliance.simulate.input.parse(req.body);
      
      // AI Analysis - Hardened Prompt for "Blacklist" Detection
      const prompt = `
        Role: EU AI Act Compliance Officer for Romania.
        Task: Analyze this AI project for compliance with the EU AI Act (Article 5 - Prohibited Practices) and Romanian National Strategy.
        
        Project Description: ${input.projectDescription}
        Intended Use: ${input.intendedUse}
        
        CRITICAL CHECKLIST (Article 5 - Prohibited/Blacklisted):
        1. Subliminal techniques manipulating behavior?
        2. Exploiting vulnerabilities of specific groups (age, disability)?
        3. Social scoring by public authorities?
        4. Real-time remote biometric identification in public spaces (law enforcement)?
        5. Biometric categorization (race, political, religion)?
        6. Emotion recognition in workplace/education?
        
        Output Requirements:
        - Determine Risk Level: "Minimal", "Limited", "High", or "Unacceptable" (Blacklisted).
        - Feedback: 2-3 sentences explaining WHY. If Unacceptable, cite the specific prohibited practice.
        
        Format output as JSON: { "riskLevel": "...", "feedback": "..." }
      `;

      const response = await openai.chat.completions.create({
        model: "gpt-5.1",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" }
      });

      const aiResult = JSON.parse(response.choices[0]?.message?.content || "{}");
      
      // Store the check
      const check = await storage.createComplianceCheck({
        ...input,
        userId: req.isAuthenticated() ? (req.user as any).claims.sub : null,
        riskLevel: aiResult.riskLevel || "High",
        feedback: aiResult.feedback || "AI analysis failed, defaulting to High Risk for safety."
      });

      res.json(check);
    } catch (err) {
      console.error("Compliance check error:", err);
      res.status(500).json({ message: "Simulation failed" });
    }
  });

  app.get(api.compliance.history.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    const history = await storage.getComplianceHistory((req.user as any).claims.sub);
    res.json(history);
  });

  // Resources
  app.get(api.resources.list.path, async (req, res) => {
    const resources = await storage.getResources();
    res.json(resources);
  });

  return httpServer;
}
