import { 
  users, projects, strategyGoals, complianceChecks, resources,
  type User, type InsertUser,
  type Project, type InsertProject,
  type StrategyGoal,
  type ComplianceCheck, type InsertComplianceCheck,
  type Resource
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Projects
  getProjects(): Promise<Project[]>;
  getProject(id: number): Promise<Project | undefined>;
  createProject(project: InsertProject): Promise<Project>;
  
  // Goals
  getStrategyGoals(): Promise<StrategyGoal[]>;
  
  // Compliance
  createComplianceCheck(check: InsertComplianceCheck): Promise<ComplianceCheck>;
  getComplianceHistory(userId: string): Promise<ComplianceCheck[]>;
  
  // Resources
  getResources(): Promise<Resource[]>;
  
  // Seed
  seedDatabase(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // === PROJECTS ===
  async getProjects(): Promise<Project[]> {
    return await db.select().from(projects).orderBy(desc(projects.createdAt));
  }

  async getProject(id: number): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async createProject(insertProject: InsertProject): Promise<Project> {
    const [project] = await db.insert(projects).values(insertProject).returning();
    return project;
  }

  // === GOALS ===
  async getStrategyGoals(): Promise<StrategyGoal[]> {
    return await db.select().from(strategyGoals).orderBy(strategyGoals.id);
  }

  // === COMPLIANCE ===
  async createComplianceCheck(check: InsertComplianceCheck): Promise<ComplianceCheck> {
    const [result] = await db.insert(complianceChecks).values(check).returning();
    return result;
  }

  async getComplianceHistory(userId: string): Promise<ComplianceCheck[]> {
    return await db.select()
      .from(complianceChecks)
      .where(eq(complianceChecks.userId, userId))
      .orderBy(desc(complianceChecks.createdAt));
  }

  // === RESOURCES ===
  async getResources(): Promise<Resource[]> {
    return await db.select().from(resources);
  }

  // === SEED ===
  async seedDatabase(): Promise<void> {
    const existingGoals = await db.select().from(strategyGoals);
    if (existingGoals.length === 0) {
      await db.insert(strategyGoals).values([
        { 
          title: "Education & Skills", 
          description: "Develop AI competencies at all education levels.",
          category: "Education",
          status: "in_progress",
          progress: 35
        },
        { 
          title: "R&D Infrastructure", 
          description: "Strengthen national research institutes and computing power.",
          category: "Infrastructure",
          status: "pending",
          progress: 10
        },
        { 
          title: "Public Administration", 
          description: "Digitalize public services using AI technologies.",
          category: "Governance",
          status: "in_progress",
          progress: 25
        },
        { 
          title: "Economic Competitiveness", 
          description: "Support startups and SMEs in adopting AI.",
          category: "Economy",
          status: "pending",
          progress: 15
        },
        { 
          title: "Ethical Framework", 
          description: "Establish robust regulations and ethical guidelines.",
          category: "Ethics",
          status: "completed",
          progress: 100
        }
      ]);
    }
    
    const existingResources = await db.select().from(resources);
    if (existingResources.length === 0) {
      await db.insert(resources).values([
        {
          title: "National AI Strategy 2024-2027",
          type: "document",
          category: "Policy",
          content: "The official strategic framework..."
        },
        {
          title: "EU AI Act Compliance Guide",
          type: "guide",
          category: "Legal",
          content: "How to ensure your AI system complies with EU regulations."
        }
      ]);
    }
  }
}

export const storage = new DatabaseStorage();
