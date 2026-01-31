'use server'

import { createClient } from "@/shared/lib/supabase/server";

export async function enrollMFA() {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.mfa.enroll({
        factorType: 'totp',
    });

    if (error) {
        return { error: error.message };
    }

    return { success: true, id: data.id, type: data.type, qr: data.totp.qr_code, secret: data.totp.secret };
}

export async function verifyMFA(factorId: string, code: string, challengeId?: string) {
    const supabase = await createClient();
    
    if (challengeId) {
        // Verifying during login (challenge)
         const { data, error } = await supabase.auth.mfa.verify({
            factorId,
            challengeId,
            code,
        });
        if (error) return { error: error.message };
        return { success: true, data };
    } else {
        // Verifying during enrollment (challenge + verify)
        const { data: challengeData, error: challengeError } = await supabase.auth.mfa.challenge({
             factorId
        });
        
        if (challengeError) return { error: challengeError.message };

        const { error } = await supabase.auth.mfa.verify({
            factorId,
            challengeId: challengeData.id,
            code,
        });

        if (error) return { error: error.message };
        return { success: true };
    }
}

export async function unenrollMFA(factorId: string) {
    const supabase = await createClient();
    const { error } = await supabase.auth.mfa.unenroll({ factorId });
    
    if (error) return { error: error.message };
    return { success: true };
}

export async function listMFAFactors() {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.mfa.listFactors();
    
    if (error) return { error: error.message };
    return { success: true, factors: data.all };
}