# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - Phase 12 Candidate

### Added
- Production startup environment validations
- `helmet` and `express-rate-limit` for backend security
- Check-in atomic transaction boundaries for concurrency protection
- Hard fail for missing/demo payment providers in production
- `docs/PRODUCTION_READINESS.md`, `docs/DISASTER_RECOVERY.md`, `docs/SECURITY.md`, `docs/DEPLOYMENT.md`, `docs/OPERATIONS.md`, `docs/LAUNCH_CHECKLIST.md`

### Changed
- Refactored `req.memberId` references to strictly use validated `req.auth.userId` across all controllers to prevent IDOR / unauthorized state modification.
- JSON body size limited to `1mb` to prevent payload bombs.
- Replaced mock `DemoPaymentProvider` initialization with environment-aware safe instantiation.

### Removed
- Unused `authMock.js` functionality from active request pipelines.
