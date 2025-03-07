import { verifyAndGetUser } from '$lib/server/Backend';
import { checkAdminAccess } from '$lib/server/BackendAdmin';
import { getEvents } from '$lib/server/BackendAgentEvent';
import type { SolsticeEventInfo } from '$lib/server/BackendTypes.ts';
import { generateChecksum } from '$lib/server/CacheMaster';
import { error, fail, redirect } from '@sveltejs/kit';

export async function load({ cookies }) {
    const userJson = cookies.get('userInfo');
    const checksum = cookies.get('userChecksum');
    const isAdmin = await checkAdminAccess(cookies.get('authToken'), userJson, checksum);
    if (userJson == null || checksum == null) {
        const user = await verifyAndGetUser(cookies.get('authToken'), userJson, checksum);
        if (user.result != null) {
            cookies.set('userInfo', JSON.stringify(user.result), {
                httpOnly: false, // Accessible by frontend
                secure: true,
                sameSite: "strict",
                path: "/"
            });
            cookies.set('userChecksum', generateChecksum(user.result), {
                httpOnly: false, // Accessible by frontend
                secure: true,
                sameSite: "strict",
                path: "/"
            });
        }
    }
    if (isAdmin == false) { redirect(308, '/'); }
    let events: SolsticeEventInfo[] = await getEvents() ?? [];

}