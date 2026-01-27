import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const strategyGoals = pgTable("strategy_goals", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  priority: text("priority").notNull().default("medium"),
});

export const projects = pgTable("projects", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  name: text("name").notNull(),
  description: text("description"),
  status: text("status").notNull().default("draft"),
  ownerId: varchar("owner_id").references(() => users.id),
  strategyGoalId: integer("strategy_goal_id").references(() => strategyGoals.id),
  createdAt: timestamp("created_at").defaultNow(),
});

export const complianceChecks = pgTable("compliance_checks", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  projectId: integer("project_id").references(() => projects.id),
  projectDescription: text("project_description").notNull(),
  intendedUse: text("intended_use").notNull(),
  riskLevel: text("risk_level").notNull(),
  feedback: text("feedback").notNull(),
  isProhibited: boolean("is_prohibited").default(false),
  userId: varchar("user_id").references(() => users.id),
  timestamp: timestamp("timestamp").defaultNow(),
});

export const resources = pgTable("resources", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity(),
  title: text("title").notNull(),
  url: text("url").notNull(),
  category: text("category").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
});

export const insertComplianceCheckSchema = createInsertSchema(complianceChecks).omit({
  id: true,
  timestamp: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Project = typeof projects.$inferSelect;
export type ComplianceCheck = typeof complianceChecks.$inferSelect;
export type StrategyGoal = typeof strategyGoals.$inferSelect;
export type Resource = typeof resources.$inferSelect;
