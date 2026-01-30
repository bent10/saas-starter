'use server';
import { db } from '@/shared/lib/db/drizzle';
import { auditLogs } from '@/shared/lib/db/schema';

export async function logAudit(userId: string, action: string, details?: any, orgId?: string) {
    try {
        await db.insert(auditLogs).values({
            userId,
            action,
            details: details ? JSON.stringify(details) : null,
            organizationId: orgId,
        });
    } catch (e) {
        console.error("Audit Log Failed", e);
    }
}
