# Data Model: SaaS Starter Core

## Overview

The data model uses **Supabase (PostgreSQL)** managed by **Drizzle ORM**.
Row Level Security (RLS) is ENFORCED on all tables to ensure tenant isolation.

## Entities

### 1. User (Managed by Supabase Auth)

- **Table**: `auth.users` (System table)
- **Fields**: `id` (UUID), `email`, `encrypted_password`, `created_at`, etc.
- **Sync**: We may create a `public.users` table profile if additional metadata is needed, but for now, we rely on `auth.users` and join via `id`.

### 2. Organization

- **Table**: `organizations`
- **Description**: The tenant unit.
- **Fields**:
  - `id`: UUID (PK)
  - `name`: Text (Required)
  - `slug`: Text (Unique, Required) - for URL routing
  - `email`: Text (Billing/Contact email)
  - `logo_url`: Text (Nullable)
  - `plan`: Enum ('FREE', 'PRO', 'ENTERPRISE') - Default 'FREE'
  - `stripe_customer_id`: Text (Unique, Nullable)
  - `created_at`: Timestamp (ISO 8601)
  - `updated_at`: Timestamp
- **RLS**:
  - Read: Members of the org.
  - Write: Owners of the org.

### 3. Member

- **Table**: `members`
- **Description**: Links Users to Organizations with a Role.
- **Fields**:
  - `id`: UUID (PK)
  - `organization_id`: UUID (FK -> organizations.id)
  - `user_id`: UUID (FK -> auth.users.id)
  - `role`: Enum ('OWNER', 'MEMBER')
  - `created_at`: Timestamp
- **Constraints**: Unique(`organization_id`, `user_id`)
- **RLS**:
  - Read: Users can see their own memberships and members of their orgs.
  - Write: Owners can add/remove members (except removing the last owner).

### 4. Invitation

- **Table**: `invitations`
- **Description**: Pending invites for users to join an org.
- **Fields**:
  - `id`: UUID (PK)
  - `organization_id`: UUID (FK -> organizations.id)
  - `email`: Text (Required)
  - `role`: Enum ('OWNER', 'MEMBER')
  - `token`: Text (Unique, Required)
  - `expires_at`: Timestamp
  - `created_at`: Timestamp
  - `inviter_id`: UUID (FK -> auth.users.id)
- **RLS**:
  - Read: Organization members (to manage) or Recipient (by token/email).
  - Write: Organization Owners.

### 5. Subscription

- **Table**: `subscriptions`
- **Description**: Syncs with Stripe Subscriptions.
- **Fields**:
  - `id`: UUID (PK)
  - `organization_id`: UUID (FK -> organizations.id)
  - `stripe_id`: Text (Unique)
  - `status`: Enum ('active', 'past_due', 'canceled', 'incomplete', etc.)
  - `price_id`: Text
  - `quantity`: Integer
  - `cancel_at_period_end`: Boolean
  - `current_period_start`: Timestamp
  - `current_period_end`: Timestamp
  - `created_at`: Timestamp
- **RLS**:
  - Read: Organization Owners.
  - Write: Service Role (Webhook) ONLY.

## Relationships

- **User** 1:N **Member**
- **Organization** 1:N **Member**
- **Organization** 1:N **Invitation**
- **Organization** 1:1 **Subscription** (Active)
