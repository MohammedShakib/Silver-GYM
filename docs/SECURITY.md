# Security Architecture

## Authentication & Authorization
- Uses robust Argon2id (via bcrypt abstraction) for password hashes. No plaintext passwords stored.
- Session Management: Cryptographically generated tokens, hashed via SHA256 before storage in database. 
- Cookies: Marked `HttpOnly`, `SameSite: Lax`, and `Secure` (when in production). This mitigates XSS token extraction and CSRF across domains.
- Middleware: Routes explicitly demand authentication via `requireAuth` which attaches `req.auth.userId` and `req.auth.role`.
- Role-based Access Control (RBAC): Hard boundaries between `MEMBER`, `GYM_OWNER`, and `ADMIN`.

## Payment Security
- Webhook centric: Payment success relies strictly on cryptographically verifiable provider webhooks, never on untrusted frontend POST requests.
- Concurrency & Idempotency: Duplicate callbacks return successfully but do not re-trigger membership updates or payout escalations.
- Amount checking: Process explicitly ensures the webhook amount matches the internal `Payment` record amount to prevent tampering.

## Check-in Security
- Pass Credentials: QR codes encapsulate short-TTL (30s) tokens that are hashed upon database generation.
- Concurrency: Real-time atomic increment blocks concurrent check-ins that exceed maximum visit boundaries.
- Replay: Tokens are actively marked as `USED`.

## Secret Management
- Do not commit secrets. Use platform environment vaults.
- See `.env.example` for the canonical list of required properties.
