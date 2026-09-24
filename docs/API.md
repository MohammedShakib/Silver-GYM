# Silver GYM API Documentation

## Notifications API

### 1. Get Notifications
Retrieves a paginated list of notifications for the authenticated user.
- **Endpoint**: `GET /api/v1/notifications`
- **Query Params**:
  - `page`: Page number (default: 1)
  - `limit`: Number of items per page (default: 20)
- **Response**:
  ```json
  {
    "notifications": [ ... ],
    "meta": { "page": 1, "limit": 20, "total": 5, "totalPages": 1 }
  }
  ```

### 2. Get Unread Count
Retrieves the count of unread notifications for the user.
- **Endpoint**: `GET /api/v1/notifications/unread-count`
- **Response**:
  ```json
  {
    "count": 3
  }
  ```

### 3. Mark as Read
Marks a specific notification as read.
- **Endpoint**: `PATCH /api/v1/notifications/:id/read`
- **Response**:
  ```json
  {
    "notification": { "id": "...", "readAt": "2026-09-24T12:00:00Z", ... }
  }
  ```

### 4. Mark All as Read
Marks all unread notifications for the user as read.
- **Endpoint**: `POST /api/v1/notifications/read-all`
- **Response**:
  ```json
  {
    "success": true
  }
  ```

### 5. Get Notification Preferences
Retrieves the user's notification preferences.
- **Endpoint**: `GET /api/v1/notifications/preferences`
- **Response**:
  ```json
  {
    "preferences": {
      "membershipEmail": true,
      "paymentEmail": true,
      "checkInEmail": false,
      "partnerOpsEmail": true,
      "payoutEmail": true,
      "supportEmail": true,
      "inAppEnabled": true
    }
  }
  ```

### 6. Update Notification Preferences
Updates the user's notification preferences.
- **Endpoint**: `PATCH /api/v1/notifications/preferences`
- **Body**: Partial updates to preference flags.
- **Response**: Returns the updated preferences object.
