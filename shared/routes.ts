import { z } from "zod";

export const api = {
  strategyGoals: {
    list: {
      path: "/api/strategy-goals"
    }
  },
  projects: {
    list: {
      path: "/api/projects"
    },
    get: {
      path: "/api/projects/:id"
    },
    create: {
      path: "/api/projects",
      input: z.object({
        name: z.string().min(1, "Name is required"),
        description: z.string().optional(),
        status: z.enum(["draft", "active", "completed", "archived"]).default("draft"),
        strategyGoalId: z.number().optional()
      })
    }
  },
  compliance: {
    simulate: {
      path: "/api/compliance/simulate",
      input: z.object({
        projectDescription: z.string().min(10, "Description must be at least 10 characters"),
        intendedUse: z.string().min(10, "Intended use must be at least 10 characters")
      })
    },
    history: {
      path: "/api/compliance/history"
    },
    audit: {
      path: "/api/compliance/audit"
    }
  },
  resources: {
    list: {
      path: "/api/resources"
    }
  }
};
