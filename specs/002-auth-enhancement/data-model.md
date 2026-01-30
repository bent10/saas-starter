# Data Model: Enhanced Authentication System

## Entities

### Profiles (New)

_Stores public user profile information and application-level status._

| Field        | Type      | Attributes                | Description                                |
| ------------ | --------- | ------------------------- | ------------------------------------------ |
| `id`         | UUID      | PK, FK -> `auth.users.id` | 1:1 relationship with Supabase Auth user   |
| `email`      | Text      | Unique, Not Null          | Synced with auth email for easier querying |
| `username`   | Text      | Unique, Not Null          | Public handle (e.g., @user)                |
| `full_name`  | Text      | Nullable                  | Display name                               |
| `avatar_url` | Text      | Nullable                  | Profile picture URL                        |
| `bio`        | Text      | Nullable                  | Short description                          |
| `status`     | Enum      | Default: 'active'         | Values: `ACTIVE`, `BANNED`                 |
| `createdAt`  | Timestamp | Default: now()            |                                            |
| `updatedAt`  | Timestamp | Default: now()            |                                            |

### Invitations (Existing - Enriched)

_Manages organization invites._

| Field            | Type      | Attributes               | Description             |
| ---------------- | --------- | ------------------------ | ----------------------- |
| `id`             | UUID      | PK                       |                         |
| `organizationId` | UUID      | FK -> `organizations.id` |                         |
| `email`          | Text      | Not Null                 |                         |
| `token`          | Text      | Unique, Not Null         | Secure random string    |
| `role`           | Enum      | Not Null                 | `OWNER`, `MEMBER`       |
| `expiresAt`      | Timestamp | Not Null                 | Token validity (7 days) |
| `inviterId`      | UUID      | Not Null                 | User who sent invite    |
| `status`         | Enum      | Default: 'pending'       | `PENDING`, `ACCEPTED`   |

### Members (Existing)

_Links Users to Organizations with roles._

| Field            | Type      | Attributes               | Description       |
| ---------------- | --------- | ------------------------ | ----------------- |
| `id`             | UUID      | PK                       |                   |
| `organizationId` | UUID      | FK -> `organizations.id` |                   |
| `userId`         | UUID      | FK -> `auth.users.id`    |                   |
| `role`           | Enum      | Default: 'member'        | `OWNER`, `MEMBER` |
| `createdAt`      | Timestamp | Default: now()           |                   |

### Organizations (Existing)

_No changes required._

## Relationships

- **User** 1:1 **Profile**
- **Organization** 1:N **Invitations**
- **Organization** 1:N **Members**
- **User** 1:N **Members**

## Validation Rules

- **Email**: Must be valid format (Zod: `.email()`).
- **Username**: Alphanumeric + underscore, min 3, max 20.
- **Password**: Min 8 chars, 1 uppercase, 1 number (enforced by Supabase).
- **Invitation Token**: Must be valid and not expired (checked against `expiresAt`).
- **Banned User**:
  - Cannot login (Supabase Auth blocking).
  - Cannot create new organizations.
  - Cannot accept invites.
