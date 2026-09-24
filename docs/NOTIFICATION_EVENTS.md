# Notification Event Matrix

| EVENT | IN-APP | EMAIL | USER CAN DISABLE EMAIL? |
|-------|--------|-------|-------------------------|
| `MEMBERSHIP_ACTIVATED` | YES | YES | NO (Mandatory) |
| `PAYMENT_SUCCESSFUL` | YES | YES | NO (Mandatory) |
| `PAYMENT_FAILED` | YES | YES | NO (Mandatory) |
| `CHECKIN_SUCCESSFUL` | YES | OPTIONAL | YES (via `checkInEmail` preference) |
| `PAYOUT_PAID` | YES | YES | NO (Mandatory for Partner) |
| `GYM_APPLICATION_APPROVED`| YES | YES | NO (Mandatory) |
| `SUPPORT_CASE_UPDATED` | YES | YES | YES (via `supportEmail` preference) |

## Templates & CTAs

### PAYMENT_SUCCESSFUL
- **Title**: Payment successful
- **Message**: Your payment of ৳[amount] for [plan] was successful.
- **CTA**: View Membership (`/member/membership`)
- **Priority**: NORMAL

### PAYMENT_FAILED
- **Title**: Payment failed
- **Message**: Your payment of ৳[amount] for [plan] failed.
- **CTA**: Retry Payment (`/member/membership`)
- **Priority**: HIGH

### MEMBERSHIP_ACTIVATED
- **Title**: Membership Activated
- **Message**: Your [plan] plan is now active. Renews on [date].
- **CTA**: Open My Pass (`/member/pass`)
- **Priority**: NORMAL

### CHECKIN_SUCCESSFUL
- **Title**: Checked in at [gymName]
- **Message**: [time] · [visitsRemaining] visits remaining
- **CTA**: View Activity (`/member/activity`)
- **Priority**: NORMAL

### GYM_APPLICATION_APPROVED
- **Title**: Your gym application was approved
- **Message**: [gymName] can now complete partner setup.
- **CTA**: Open Partner Dashboard (`/partner`)
- **Priority**: HIGH

### PAYOUT_PAID
- **Title**: Payout completed
- **Message**: ৳[amount] was marked paid for [gymName].
- **CTA**: View Payout (`/partner/payouts`)
- **Priority**: NORMAL

### SUPPORT_CASE_UPDATED
- **Title**: Your support case has been updated
- **Message**: Case [reference] has a new reply.
- **CTA**: View Case (`/member/profile` or appropriate support route)
- **Priority**: NORMAL
