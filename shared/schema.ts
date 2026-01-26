import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";
// Import auth models to ensure they are available
export * from "./models/auth";
export * from "./models/chat";
import { users } from "./models/auth";

// === STRATEGY GOALS ===
export const strategyGoals = pgTable("strategy_goals", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(), // e.g., "Education", "Infrastructure", "R&D"
  status: text("status").default("pending").notNull(), // pending, in_progress, completed
  progress: integer("progress").default(0).notNull(), // 0-100
  updatedAt: timestamp("updated_at").defaultNow(),
});

// === PROJECTS REGISTRY ===
export const projects = pgTable("projects", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  sector: text("sector").notNull(), // e.g., Health, Transport, Justice
  ownerId: text("owner_id").references(() => users.id), // Link to auth user
  status: text("status").default("proposed").notNull(), // proposed, active, completed
  isPublic: boolean("is_public").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// === COMPLIANCE CHECKS (Simulator) ===
export const complianceChecks = pgTable("compliance_checks", {
  id: serial("id").primaryKey(),
  userId: text("user_id").references(() => users.id),
  projectDescription: text("project_description").notNull(),
  intendedUse: text("intended_use").notNull(),
  riskLevel: text("risk_level"), // minimal, limited, high, unacceptable (blacklisted)
  feedback: text("feedback"), // AI generated explanation
  createdAt: timestamp("created_at").defaultNow(),
});

// === RESOURCES ===
export const resources = pgTable("resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(), // guide, regulation, course
  url: text("url"),
  content: text("content"),
  category: text("category").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// === RELATIONS ===
export const projectsRelations = relations(projects, ({ one }) => ({
  owner: one(users, {
    fields: [projects.ownerId],
    references: [users.id],
  }),
}));

export const complianceChecksRelations = relations(complianceChecks, ({ one }) => ({
  user: one(users, {
    fields: [complianceChecks.userId],
    references: [users.id],
  }),
}));

// === SCHEMAS ===
export const insertStrategyGoalSchema = createInsertSchema(strategyGoals).omit({ id: true, updatedAt: true });
export const insertProjectSchema = createInsertSchema(projects).omit({ id: true, createdAt: true });
export const insertComplianceCheckSchema = createInsertSchema(complianceChecks).omit({ id: true, createdAt: true, riskLevel: true, feedback: true });
export const insertResourceSchema = createInsertSchema(resources).omit({ id: true, createdAt: true });

// === TYPES ===
export type StrategyGoal = typeof strategyGoals.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type ComplianceCheck = typeof complianceChecks.$inferSelect;
export type Resource = typeof resources.$inferSelect;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type InsertComplianceCheck = z.infer<typeof insertComplianceCheckSchema>;

// === API TYPES ===
export type CreateProjectRequest = InsertProject;
export type CreateComplianceCheckRequest = InsertComplianceCheck;
export type ComplianceCheckResponse = ComplianceCheck;
