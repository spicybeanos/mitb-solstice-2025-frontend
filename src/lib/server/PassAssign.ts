import { v4 as uuid } from 'uuid';
import { supabaseAdmin } from './supabaseServer';
import { getUser_s_TeamIDInEvent } from './BackendAgentEvent';
import { patch } from './Backend';
import type { UpdateSolsticeUser } from './BackendTypes';

interface PassLogRow {
    id: string,
    created_at: string,
    given_by: string,
    pass: string,
    user_id: string
}
export interface PassLog {
    created_at: string,
    given_by: string,
    pass: string,
    user_id: string
}

function toUrlSafeBase64(base64: string) {
    return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
function makeID() {
    return toUrlSafeBase64(Buffer.from(uuid().replace(/-/g, ''), 'hex').toString('base64'))
}

export async function assignPass(user_id: string, pass_id: string, email: string) {
    const res = await patch<UpdateSolsticeUser>(`user/${user_id}`, { pass_id: pass_id });
    if (res.success == false) { return res; }
    const log = await logPassAssignment({ created_at: new Date().toISOString(), given_by: email, user_id: user_id, pass: pass_id });
    if(log.success == false){
        console.log("Failed to log pass asignment! reversring change...");
        await patch<UpdateSolsticeUser>(`user/${user_id}`, { pass_id: null });
        return {success:false,error:`Failed to log pass assignment pass ${pass_id}, user:${user_id} by ${email}`}
    }
    return {success:true,error:null}
}

export async function logPassAssignment(log: PassLog) {
    const l = { ...log, id: makeID() } as PassLogRow;

    const { error } = await supabaseAdmin
        .from('pass_issue_log')
        .insert([l]);

    if (error) {
        return { success: false, error: JSON.stringify(error) };
    }

    return { success: true, error: null }
}