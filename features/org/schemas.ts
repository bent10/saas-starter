import { z } from 'zod';

export const createOrganizationSchema = z.object({
  name: z.string().min(3, { message: "Name must be at least 3 characters" }),
});

export const inviteMemberSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  role: z.enum(["OWNER", "MEMBER"]),
  organizationId: z.string().uuid(),
});

export const updateMemberRoleSchema = z.object({
  memberId: z.string().uuid(),
  role: z.enum(["OWNER", "MEMBER"]),
  organizationId: z.string().uuid(),
});

export const removeMemberSchema = z.object({
  memberId: z.string().uuid(),
  organizationId: z.string().uuid(),
});
