# Operations & Runbooks

## Daily Operational Checks
- Review failed background jobs (email queue).
- Ensure DB backups occurred.
- Check 5xx error rate on critical paths.

## Runbooks

### Member Cannot Login
1. Verify if user is `SUSPENDED` or `DISABLED` in Admin dashboard.
2. Verify member is using the correct email.
3. If they reset password, check if email provider dropped the reset email.

### Payment Succeeded but Membership Inactive
1. Query `Payment` record via backend log tracking.
2. If `status` is `PENDING`, verify payment provider webhook triggered.
3. If provider failed to send webhook, initiate a manual re-sync endpoint (if implemented) or manually confirm the transaction reference via provider dashboard before adjusting the DB safely using auditable scripts. Never manually edit the DB rows directly.

### Gym Partner Payout Stuck
1. Check `Settlement` status. Must be `APPROVED`.
2. Check `Payout` provider logs (e.g., failed bank transfer).
3. Notify gym owner, fix account details, re-initiate payout safely.

### Check-in Rejected Unexpectedly
1. Ensure the user's `Membership` is `ACTIVE`.
2. Ensure `visitsUsed` is less than `visitLimit` for current cycle.
3. Check scanner device time synchronization (pass tokens expire in 30 seconds).

## Emergency Actions
If a provider is fundamentally breached (e.g. payment keys leaked):
1. Immediately rotate the keys in production env.
2. Consider switching `PAYMENT_PROVIDER=DEMO` temporarily to fail-fast upcoming payments if a safe mode is preferred, or deploy the kill-switch feature flag if implemented.
