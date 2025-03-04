import { check_EventRW_Access } from '$lib/server/BackendAdmin.js';
import { getEventRegisTable, getUser_s_TeamIDInEvent } from '$lib/server/BackendAgentEvent.js';

export async function load({ cookies, params }) {
    const perm = await check_EventRW_Access(cookies.get('authToken'), params.slug);
    if (!perm) { return { success: false, error: '403: Unauthorized' } }
    const rows = await getEventRegisTable(params.slug);
    if (rows == null) { return { success: false, error: 'No rows to display!' } }

    return { success: true, rows: rows }
}