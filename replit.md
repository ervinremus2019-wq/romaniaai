# replit.md

## Overview

This is an AI Compliance Simulator platform designed for enterprise environments. The application helps organizations verify AI project compliance with the EU AI Act and Romanian National Strategy 2024-2030. It features a deterministic, rule-based compliance engine that analyzes project descriptions and intended uses to assess risk levels, eliminating the need for external AI API calls.

Key capabilities:
- Compliance simulation with multi-stage pattern matching for Article 5 and High-Risk categorization
- National Strategy alignment verification
- Immutable audit trail logging
- Project management with strategy goal tracking

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

**Enterprise Parity & Synchronization**
- The entire workspace is synchronized with the **Autonomous World-Wide Enterprise Architecture**.
- Development and production environments share identical hardening, security protocols, and deterministic v8.0 rules.
- Autonomous fixing and security modules are active across the entire project lifecycle.
- **Ownership**: Ervin Remus Radosavlevici (Verified).

**Frontend Architecture**
- React 18 with TypeScript, built using Vite
- Routing handled by Wouter (lightweight alternative to React Router)
- State management via TanStack React Query for server state
- UI components from shadcn/ui built on Radix UI primitives
- Styling with Tailwind CSS using CSS variables for theming
- Form handling with React Hook Form and Zod validation
- **Sync**: Development environment uses identical production styles and high-contrast security command center UI.

**Backend Architecture**
- Express.js 5 on Node.js with TypeScript
- Single entry point pattern with route registration
- In-memory storage implementation (MemStorage class) with interface for future database migration
- Security hardening via Helmet.js middleware with strict CSP, HSTS, and XSS protection
- Rate limiting with express-rate-limit for API endpoints
- **Autonomous Security**: Self-healing diagnostic modules and autonomous threat detection enabled.
- All console logging suppressed in both client and server for security.

**Data Layer**
- Drizzle ORM configured for PostgreSQL (schema defined, database provisioning expected)
- Schema includes: users, strategy_goals, projects, compliance_checks, resources, audit_logs
- Zod schemas generated from Drizzle for runtime validation
- Currently using in-memory storage; database connection requires DATABASE_URL environment variable

**API Design**
- RESTful endpoints defined in shared/routes.ts with Zod input validation schemas
- Endpoints: strategy-goals, projects CRUD, compliance simulation, audit logs, resources
- Shared types between frontend and backend via @shared path alias

**Build System**
- Vite for frontend bundling with React plugin
- esbuild for server bundling with selective dependency bundling (allowlist pattern)
- Single unified build output to dist/ directory
- Development uses tsx for TypeScript execution

## External Dependencies

**Database**
- PostgreSQL (via Drizzle ORM) - requires DATABASE_URL environment variable
- connect-pg-simple for session storage capability

**Frontend Libraries**
- Radix UI component primitives (dialog, dropdown, tabs, etc.)
- Lucide React for icons
- date-fns for date formatting
- embla-carousel-react for carousels
- recharts for charts (via shadcn chart component)
- vaul for drawer component

**Security & Middleware**
- Helmet.js for HTTP security headers
- express-rate-limit for API rate limiting
- Zod for input validation and sanitization

**Development Tools**
- Replit-specific Vite plugins (runtime-error-modal, cartographer, dev-banner)
- TypeScript with strict mode
- Tailwind CSS with PostCSS/Autoprefixer

**Note**: The application is designed as "zero-secret core" - the compliance analysis engine is deterministic and rule-based, not requiring external AI API keys. No external API calls are made for core functionality.
