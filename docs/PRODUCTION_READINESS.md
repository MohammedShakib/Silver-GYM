# Production Readiness Checklist

Track each item: PASS, TODO, IN PROGRESS, BLOCKED, NOT APPLICABLE

## Security
- [PASS] Helmet & express-rate-limit configured in app.js
- [PASS] Auth rate limits (basic)
- [PASS] Password hashing via Argon2id (bcrypt equivalent used)
- [PASS] Session security (HttpOnly, Secure, SameSite cookies)
- [PASS] Auth tokens NOT exposed in URLs
- [PASS] Environment variable validation at startup
- [PASS] IDOR protections (req.auth.userId mapping fixed)

## Backend
- [PASS] Centralized Error Handler (no stack traces in prod)
- [PASS] Request size limits configured (`1mb` JSON limit)
- [PASS] CORS tightly scoped (`FRONTEND_URL` environment bound)

## Frontend
- [TODO] Global Error Boundary
- [TODO] Lazy loading of admin/partner routes
- [PASS] Environment configs bound via Vite `.env`
- [PASS] Fallback UX for missing API (handled via loaders/useQuery mostly)

## Database
- [PASS] Transactions used for critical paths (Payment, Check-in)
- [PASS] Parameterized ORM queries (Prisma default)
- [TODO] Production indexes optimized (requires monitoring)

## Payments
- [PASS] Amount & Currency verification upon webhook
- [PASS] Idempotent payment processing
- [PASS] Safe sandbox instantiation separated from prod provider

## Check-In
- [PASS] Short TTL QR pass tokens (30 seconds)
- [PASS] Concurrency protections via atomic updates
- [PASS] Safe cooldown for duplicates

## Financials
- [PASS] Payout idempotency
- [PASS] Stored safe provider references
- [PASS] Access constraints (Owner can't see other owner's financials)

## Jobs
- [PASS] Worker handles exponential backoff
- [PASS] Restartable and idempotent processing

## Deployment
- [TODO] CI pipeline setup
- [TODO] Zero downtime deployment configured on host
