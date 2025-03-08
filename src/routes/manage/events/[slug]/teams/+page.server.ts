import { verifyAndGetUser } from '$lib/server/Backend';
import { check_EventRW_Access } from '$lib/server/BackendAdmin.js';
import { getEventRegisTable, getUser_s_TeamIDInEvent } from '$lib/server/BackendAgentEvent.js';
import { generateChecksum } from '$lib/server/CacheMaster';

export async function load({ cookies, params }) {
    const userJson = cookies.get('userInfo');
    const checksum = cookies.get('userChecksum');
    const perm = await check_EventRW_Access(cookies.get('authToken'), userJson, checksum, params.slug);
    if (userJson == null || checksum == null) {
        const user = await verifyAndGetUser(cookies.get('authToken'), userJson, checksum);
        if (user.result != null) {
            cookies.set('userInfo', JSON.stringify(user.result), {
                httpOnly: false, // Accessible by frontend
                secure: true,
                sameSite: "strict",
                path: "/",
                maxAge:3600
            });
            cookies.set('userChecksum', generateChecksum(user.result), {
                httpOnly: false, // Accessible by frontend
                secure: true,
                sameSite: "strict",
                path: "/",
                maxAge:3600
            });
        }
    }
    if (!perm) { return { success: false, error: '403: Unauthorized' } }
    const rows = await getEventRegisTable(params.slug);
    if (rows == null) { return { success: false, error: 'No rows to display!' } }

    return { success: true, rows: rows }
}