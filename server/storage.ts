import { type User, type InsertUser, type Project, type ComplianceCheck, type StrategyGoal, type Resource, type AuditLog } from "../shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Strategy Goals
  getStrategyGoals(): Promise<StrategyGoal[]>;
  
  // Projects
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: Partial<Project> & { name: string }): Promise<Project>;
  
  // Compliance
  createComplianceCheck(check: Partial<ComplianceCheck>): Promise<ComplianceCheck>;
  getComplianceHistory(userId: string): Promise<ComplianceCheck[]>;
  
  // Audit Logs
  createAuditLog(action: string, details: string): Promise<AuditLog>;
  getAuditLogs(): Promise<AuditLog[]>;
  
  // Resources
  getResources(): Promise<Resource[]>;
  
  // System
  seedDatabase(): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private strategyGoals: Map<number, StrategyGoal>;
  private projects: Map<number, Project>;
  private complianceChecks: Map<number, ComplianceCheck>;
  private resources: Map<number, Resource>;
  private auditLogs: Map<number, AuditLog>;
  private currentIds: Record<string, number>;

  constructor() {
    this.users = new Map();
    this.strategyGoals = new Map();
    this.projects = new Map();
    this.complianceChecks = new Map();
    this.resources = new Map();
    this.auditLogs = new Map();
    this.currentIds = { strategy: 1, projects: 1, compliance: 1, resources: 1, audit: 1 };
  }

  async createAuditLog(action: string, details: string): Promise<AuditLog> {
    const id = this.currentIds.audit++;
    const log: AuditLog = { id, action, details, timestamp: new Date() };
    this.auditLogs.set(id, log);
    return log;
  }

  async getAuditLogs(): Promise<AuditLog[]> {
    return Array.from(this.auditLogs.values()).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(u => u.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getStrategyGoals(): Promise<StrategyGoal[]> {
    return Array.from(this.strategyGoals.values());
  }

  async getProjects(): Promise<Project[]> {
    return Array.from(this.projects.values());
  }

  async getProject(id: number): Promise<Project | undefined> {
    return this.projects.get(id);
  }

  async createProject(projectData: Partial<Project> & { name: string }): Promise<Project> {
    const id = this.currentIds.projects++;
    const project: Project = {
      id,
      name: projectData.name,
      description: projectData.description ?? null,
      status: projectData.status ?? "draft",
      ownerId: projectData.ownerId ?? null,
      strategyGoalId: projectData.strategyGoalId ?? null,
      createdAt: new Date(),
    };
    this.projects.set(id, project);
    return project;
  }

  async createComplianceCheck(checkData: Partial<ComplianceCheck>): Promise<ComplianceCheck> {
    const id = this.currentIds.compliance++;
    const check: ComplianceCheck = {
      id,
      projectId: checkData.projectId ?? null,
      projectDescription: checkData.projectDescription ?? "",
      intendedUse: checkData.intendedUse ?? "",
      riskLevel: checkData.riskLevel ?? "High",
      feedback: checkData.feedback ?? "",
      userId: checkData.userId ?? null,
      timestamp: new Date(),
    };
    this.complianceChecks.set(id, check);
    return check;
  }

  async getComplianceHistory(userId: string): Promise<ComplianceCheck[]> {
    return Array.from(this.complianceChecks.values()).filter(c => c.userId === userId);
  }

  async getResources(): Promise<Resource[]> {
    return Array.from(this.resources.values());
  }

  async seedDatabase(): Promise<void> {
    if (this.strategyGoals.size > 0) return;

    const goals: StrategyGoal[] = [
      { id: 1, title: "AI Research Excellence", description: "Promote world-class AI research in Romania.", priority: "high" },
      { id: 2, title: "Public Sector AI", description: "Digital transformation of public services using AI.", priority: "medium" },
      { id: 3, title: "AI Ethics & Safety", description: "Implementation of EU AI Act standards.", priority: "high" }
    ];
    goals.forEach(g => this.strategyGoals.set(g.id, g));

    const res: Resource[] = [
      { id: 1, title: "EU AI Act - Official Text", url: "https://eur-lex.europa.eu/", category: "Regulation" },
      { id: 2, title: "Romanian National AI Strategy 2024-2030", url: "#", category: "Strategy" }
    ];
    res.forEach(r => this.resources.set(r.id, r));
  }
}

export const storage = new MemStorage();
