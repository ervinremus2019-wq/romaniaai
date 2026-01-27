import { type User, type InsertUser } from "../shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Missing methods for routes.ts
  seedDatabase(): Promise<void>;
  getStrategyGoals(): Promise<any[]>;
  getProjects(): Promise<any[]>;
  getProject(id: number): Promise<any | undefined>;
  createProject(project: any): Promise<any>;
  createComplianceCheck(check: any): Promise<any>;
  getComplianceHistory(userId: string): Promise<any[]>;
  getResources(): Promise<any[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private strategyGoals: any[] = [];
  private projects: any[] = [];
  private complianceChecks: any[] = [];
  private resources: any[] = [];

  constructor() {
    this.users = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async seedDatabase(): Promise<void> {
    this.strategyGoals = [
      { id: 1, title: "Enhance AI Safety", description: "Improve national standards for AI safety." }
    ];
    this.resources = [
      { id: 1, title: "EU AI Act Guide", url: "https://example.com/guide" }
    ];
  }

  async getStrategyGoals(): Promise<any[]> {
    return this.strategyGoals;
  }

  async getProjects(): Promise<any[]> {
    return this.projects;
  }

  async getProject(id: number): Promise<any | undefined> {
    return this.projects.find(p => p.id === id);
  }

  async createProject(project: any): Promise<any> {
    const newProject = { ...project, id: this.projects.length + 1 };
    this.projects.push(newProject);
    return newProject;
  }

  async createComplianceCheck(check: any): Promise<any> {
    const newCheck = { ...check, id: this.complianceChecks.length + 1, timestamp: new Date() };
    this.complianceChecks.push(newCheck);
    return newCheck;
  }

  async getComplianceHistory(userId: string): Promise<any[]> {
    return this.complianceChecks.filter(c => c.userId === userId);
  }

  async getResources(): Promise<any[]> {
    return this.resources;
  }
}

export const storage = new MemStorage();
