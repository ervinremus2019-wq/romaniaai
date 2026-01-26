import { z } from 'zod';
import { 
  insertProjectSchema, 
  insertComplianceCheckSchema, 
  projects, 
  strategyGoals, 
  complianceChecks, 
  resources 
} from './schema';

// Error Schemas
export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

// API Contract
export const api = {
  // Strategy Goals (Public)
  strategyGoals: {
    list: {
      method: 'GET' as const,
      path: '/api/strategy-goals',
      responses: {
        200: z.array(z.custom<typeof strategyGoals.$inferSelect>()),
      },
    },
  },
  
  // Projects (Public read, Auth write)
  projects: {
    list: {
      method: 'GET' as const,
      path: '/api/projects',
      input: z.object({
        sector: z.string().optional(),
      }).optional(),
      responses: {
        200: z.array(z.custom<typeof projects.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/projects',
      input: insertProjectSchema,
      responses: {
        201: z.custom<typeof projects.$inferSelect>(),
        400: errorSchemas.validation,
        401: errorSchemas.unauthorized,
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/projects/:id',
      responses: {
        200: z.custom<typeof projects.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },

  // Compliance Simulator (Public/Auth)
  compliance: {
    simulate: {
      method: 'POST' as const,
      path: '/api/compliance/simulate',
      input: insertComplianceCheckSchema,
      responses: {
        200: z.custom<typeof complianceChecks.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    history: {
      method: 'GET' as const,
      path: '/api/compliance/history',
      responses: {
        200: z.array(z.custom<typeof complianceChecks.$inferSelect>()),
        401: errorSchemas.unauthorized,
      },
    },
  },

  // Resources (Public)
  resources: {
    list: {
      method: 'GET' as const,
      path: '/api/resources',
      responses: {
        200: z.array(z.custom<typeof resources.$inferSelect>()),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
