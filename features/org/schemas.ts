import { z } from 'zod';

export const createOrganizationSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
  slug: z.string().min(3, { message: "Slug must be at least 3 characters" }),
});

export const inviteMemberSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  role: z.enum(["OWNER", "MEMBER"]),
  organizationId: z.string().uuid(),
});

export const createInvitationSchema = inviteMemberSchema;

export const updateMemberRoleSchema = z.object({
  memberId: z.string().uuid(),
  role: z.enum(["OWNER", "MEMBER"]),
  organizationId: z.string().uuid(),
});

export const removeMemberSchema = z.object({
  memberId: z.string().uuid(),
  organizationId: z.string().uuid(),
});

export const acceptInvitationSchema = z.object({
  token: z.string().min(1),
  method: z.enum(["password", "google"]),
  password: z.string().optional(),
}).refine((data) => {
  if (data.method === "password" && !data.password) {
    return false;
  }
  return true;
}, {
  message: "Password is required when accepting via password",
  path: ["password"],
});