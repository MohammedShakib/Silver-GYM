# Deployment Guide

## Prerequisites
- PostgreSQL v14+ Database
- Node.js v18+ 
- Production-grade Process Manager (e.g., PM2 or Docker/Kubernetes orchestrator)

## Environment Variables
Ensure all properties in `.env.example` are securely set in the target environment. `NODE_ENV` must be `production`.

## Database Migration
Execute migrations as part of the release pipeline *before* rotating active application instances:
```bash
npx prisma db push # Or prisma migrate deploy when migrations are finalized
```
> **Warning**: Do not configure auto-migrate on instance startup if running multiple instances, to avoid race conditions.

## Building Assets
### Backend
Backend runs as ES Modules, no transpilation required.

### Frontend
```bash
npm run build
```
Distribute the resulting `dist/` directory via CDN or static file hosting.

## Running Background Workers
The background jobs (`NotificationWorker`, `RenewalScheduler`) run alongside the API server natively. Ensure sufficient server resources or spin them off into a dedicated node process in larger scale environments.

## Health Checks
Bind load balancer checks to `GET /api/v1/health`. Ensure 200 OK before routing traffic.
