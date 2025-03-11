// src/lib/server/auditLogger.ts
import { supabaseAdmin } from './supabaseServer';
import { v4 as uuid } from 'uuid';

interface AuditLogEntry {
    user_email: string;
    table_name: string;
    record_id?: string; // Optional in case of bulk actions
    action: 'INSERT' | 'UPDATE' | 'DELETE';
    old_data?: object | null;
    new_data?: object | null;
}

/**
 * Logs an action into the audit_log table.
 */
export async function logAuditChange(entry: AuditLogEntry) {
    const { error } = await supabaseAdmin.from('audit_log').insert([
        {
            id: uuid(),
            timestamp: (new Date())toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
            user_email: entry.user_email,
            table_name: entry.table_name,
            record_id: entry.record_id ?? null,
            action: entry.action,
            old_data: entry.old_data ? JSON.stringify(entry.old_data) : null,
            new_data: entry.new_data ? JSON.stringify(entry.new_data) : null,
        }
    ]);

    if (error) {
        console.error('Failed to log audit change:', error.message);
        throw new Error('Failed to log audit change.');
    }
}
function uuidv4(): any {
    throw new Error('Function not implemented.');
}

