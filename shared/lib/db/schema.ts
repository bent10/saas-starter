import { pgTable, text, timestamp, uuid, boolean, pgEnum, integer, pgSchema } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Enums
export const roleEnum = pgEnum("role", ["OWNER", "MEMBER"]);
export const subscriptionStatusEnum = pgEnum("subscription_status", ["active", "past_due", "canceled", "incomplete", "incomplete_expired", "trialing", "unpaid"]);
export const planEnum = pgEnum("plan", ["FREE", "PRO", "ENTERPRISE"]);
export const userStatusEnum = pgEnum("user_status", ["ACTIVE", "BANNED"]);
export const invitationStatusEnum = pgEnum("invitation_status", ["PENDING", "ACCEPTED"]);

// Auth Schema (Read-only reference)
const authSchema = pgSchema("auth");
export const users = authSchema.table("users", {
  id: uuid("id").primaryKey(),
  email: text("email"),
});

// Profiles
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey().references(() => users.id, { onDelete: "cascade" }),
  email: text("email").notNull().unique(),
  username: text("username").notNull().unique(),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  status: userStatusEnum("status").default("ACTIVE").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

export const profilesRelations = relations(profiles, ({ one }) => ({
  user: one(users, {
    fields: [profiles.id],
    references: [users.id],
  }),
}));

// Organizations
export const organizations = pgTable("organizations", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").unique().notNull(),
  email: text("email"),
  logoUrl: text("logo_url"),
  plan: planEnum("plan").default("FREE").notNull(),
  stripeCustomerId: text("stripe_customer_id").unique(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull().$onUpdate(() => new Date()),
});

// Organizations Relations
export const organizationsRelations = relations(organizations, ({ many }) => ({
  members: many(members),
  invitations: many(invitations),
}));

// Members
export const members = pgTable("members", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").references(() => organizations.id, { onDelete: "cascade" }).notNull(),
  userId: uuid("user_id").notNull(), 
  role: roleEnum("role").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => [
  // Unique constraint for user in org
  // uniqueIndex("member_org_user_idx").on(t.organizationId, t.userId), // Drizzle unique helper
]);

// Members Relations
export const membersRelations = relations(members, ({ one }) => ({
  organization: one(organizations, {
    fields: [members.organizationId],
    references: [organizations.id],
  }),
  user: one(users, {
    fields: [members.userId],
    references: [users.id],
  }),
}));

// Invitations
export const invitations = pgTable("invitations", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").references(() => organizations.id, { onDelete: "cascade" }).notNull(),
  email: text("email").notNull(),
  role: roleEnum("role").notNull(),
  token: text("token").unique().notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  inviterId: uuid("inviter_id").notNull(), // References auth.users
  status: invitationStatusEnum("status").default("PENDING").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const invitationsRelations = relations(invitations, ({ one }) => ({
  organization: one(organizations, {
    fields: [invitations.organizationId],
    references: [organizations.id],
  }),
}));

// Subscriptions
export const subscriptions = pgTable("subscriptions", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").references(() => organizations.id, { onDelete: "cascade" }).notNull(),
  stripeId: text("stripe_id").unique().notNull(),
  status: subscriptionStatusEnum("status").notNull(),
  priceId: text("price_id"),
  quantity: integer("quantity"),
  cancelAtPeriodEnd: boolean("cancel_at_period_end"),
  currentPeriodStart: timestamp("current_period_start"),
  currentPeriodEnd: timestamp("current_period_end"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Audit Logs
export const auditLogs = pgTable("audit_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  organizationId: uuid("organization_id").references(() => organizations.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull(),
  action: text("action").notNull(),
  details: text("details"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
