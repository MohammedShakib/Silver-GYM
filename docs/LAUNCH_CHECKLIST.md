# Silver GYM Launch Checklist

| AREA | STATUS | OWNER | NOTES |
|------|--------|-------|-------|
| **DOMAIN** | TODO | - | Confirm production domain configured |
| **HTTPS** | TODO | - | Confirm TLS certificates provisioned |
| **SECRETS** | TODO | - | Secure keys generated for prod, not committed |
| **DATABASE** | PASS | - | Schema migrations clean, constraints validated |
| **BACKUPS** | TODO | - | Provider automated backups configured |
| **AUTH** | PASS | - | Rate limits, secure cookies, IDORs patched |
| **PAYMENTS** | PASS | - | Amount verification, idempotency, webhook security intact |
| **CHECK-IN** | PASS | - | Concurrency, duplicate scan logic verified |
| **PARTNER** | PASS | - | Role constraints, scanner workflow verified |
| **ADMIN** | PASS | - | Hard separation of roles, no seed users left in DB |
| **PAYOUT** | PASS | - | Approval required before paid transitions |
| **EMAIL** | PASS | - | SMTP/provider env setup complete, fallback managed |
| **MONITORING**| TODO | - | Connect external uptime/error tracker (e.g. Sentry) |
| **LOGGING** | PASS | - | No secrets leaked into console.error handlers |
| **LEGAL** | TODO | - | TOS / Privacy Policy links valid |
| **SUPPORT** | TODO | - | Support contact flow verified |
| **CI/CD** | TODO | - | Code repository wired to hosting |
| **ROLLBACK** | PASS | - | Documented in DISASTER_RECOVERY.md |
| **SMOKE TEST**| TODO | - | To be performed immediately post-deploy |

**GO / NO-GO**: NO-GO until CI/CD, Backups, and TLS are provisioned on real infrastructure.
