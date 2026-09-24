# Disaster Recovery Plan

## Objectives
- **RPO (Recovery Point Objective)**: 1 hour for financial databases.
- **RTO (Recovery Time Objective)**: 4 hours to resume core API functions.

## Database Loss
1. Retrieve latest automated snapshot.
2. Provision new PostgreSQL instance.
3. Apply backup and run Prisma migration sanity check.
4. Rotate any compromised secrets (if loss was due to intrusion).
5. Update `DATABASE_URL` in environment variables and restart API servers.

## Bad Deployment
1. Identify failing service (Frontend/Backend/Worker).
2. Trigger rollback in CI/CD platform (or point load balancer to previous container tag).
3. If database migrations caused corruption:
   - Identify if change is backward compatible.
   - If backward compatible, rollback app immediately.
   - If not, manual DB rollback script is required. Do NOT arbitrarily drop columns containing user data.

## Provider Outage (Payments/Email)
- If Email provider is down, `NotificationWorker` will exponentially back off. No action required unless outage exceeds 48 hours.
- If Payment provider is down, fail fast on checkout initiation. Do NOT attempt to collect PAN/CVV data locally. Ensure UI displays maintenance notice.

## Secret Compromise
- Immediate rotation of `SESSION_SECRET` (invalidates all active logins).
- Immediate rotation of `QR_SIGNING_SECRET` (invalidates in-flight passes, harmless as TTL is 30s).
- Rotate DB credentials and update platform config.
