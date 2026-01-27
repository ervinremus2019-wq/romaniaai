# AI-Driven Compliance Simulator for EU AI Act

A production-ready platform for simulating and analyzing AI project compliance with the EU AI Act, specifically tailored for the Romanian national strategy context.

## Features

- **Project Management**: Securely create and manage multiple AI projects.
- **Compliance Simulation**: Automated risk assessment (Minimal, Limited, High, Unacceptable) based on EU AI Act Article 5.
- **Strategy Alignment**: Verification against Romanian National AI Strategy goals.
- **Resource Library**: Access to key documents and compliance guidelines.
- **Rate Limiting**: Built-in protection for API and AI services.
- **Security Headers**: Hardened with Helmet.js for production environments.

## Technical Stack

- **Frontend**: React, Vite, Tailwind CSS, Shadcn UI, TanStack Query.
- **Backend**: Node.js, Express.
- **Database**: In-memory (MemStorage) with IStorage interface for easy SQL migration.
- **Validation**: Zod for runtime schema validation.
- **AI Integration**: OpenAI GPT-4o ready.

## Getting Started

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Access the application at `http://localhost:5000`

## Production Readiness

- **Security**: Implements Rate Limiting and Helmet headers.
- **Scalability**: Decoupled storage interface and schema-driven API.
- **Compliance**: Specifically programmed for Article 5 "Blacklist" detection.
