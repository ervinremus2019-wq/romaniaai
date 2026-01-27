# Secure AI Compliance Simulator (Production-Grade)

Unbreakable, self-contained compliance platform for the EU AI Act and Romanian National Strategy.

## Production Hardening
- **Zero Secrets**: Built without external API dependencies to eliminate credential leak risks.
- **Hermetic Runtime**: All logic is internal and deterministic. No external network calls for core analysis.
- **Hardened Security**: Implements strict Content Security Policy (CSP), HSTS, and Frameguard via Helmet.
- **Rate Limiting**: Multi-tier rate limiting for API and compute-intensive operations.
- **Input Sanitization**: Strict Zod-based validation for all data entry points.
- **Clean Output**: Stripped of browser console noise and verbose logging in production.

## Features
- **Deterministic Simulation**: Rule-based compliance engine for Article 5 verification.
- **National Strategy Alignment**: Verification against Romanian National AI Strategy 2024-2030.
- **Audit Trails**: Secure in-memory persistence with full audit history for compliance checks.
- **Resource Repository**: Integrated regulatory documentation library.

## Architecture
- **Frontend**: React/Vite/Tailwind (Production Build Optimized).
- **Backend**: Express (Hardened Middleware).
- **Security**: Helmet, Rate-Limiter, Zod.
- **Workflow**: Unified development/production environment parity.

## Security Audit Status
- [x] No external secrets
- [x] CSP Implementation
- [x] No sensitive console logging
- [x] Deterministic Analysis Path
- [x] Environment Parity
