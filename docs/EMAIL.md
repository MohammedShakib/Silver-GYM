# Email Configuration & Delivery

## 1. Provider
Silver GYM uses an abstract `EmailProvider` interface. 
- During development, the `DevelopmentEmailProvider` is used to log emails to the console and simulate network delay, ensuring no accidental emails are sent to real users.
- In production, a concrete provider (like Resend, SendGrid, or AWS SES) should be injected based on `EMAIL_PROVIDER` environment variable.

## 2. Configuration
Required Environment Variables (Production):
- `EMAIL_PROVIDER`: e.g., `RESEND`, `SENDGRID`, `SMTP`
- `EMAIL_FROM`: e.g., `noreply@silvergym.com`
- `EMAIL_API_KEY`: API key for the chosen provider.

## 3. Template Structure
Emails rely on standard dynamic data objects:
- `title`
- `message`
- `actionUrl`
- `actionLabel`
Templates are rendered dynamically and should be kept clean, brand-consistent, and accessible. No sensitive data (like full bank numbers, passwords, or raw auth tokens) should be sent via email.

## 4. Retry & Bounce Handling
- **Retries**: Temporary failures during sending (e.g. timeout) are caught by the `NotificationWorker`. The `NotificationDelivery` is marked for retry using exponential backoff.
- **Bounces**: (To be implemented) Hard bounces returned via provider webhooks should mark the user's email as invalid, suppressing future sends.

## 5. Security & Dev Testing
- Do not expose email credentials in logs.
- `DevelopmentEmailProvider` ensures emails only go to stdout during local testing.
