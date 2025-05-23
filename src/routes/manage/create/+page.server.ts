import { verifyAndGetUser } from '$lib/server/Backend';
import { check_Creator_Access, checkAdminAccess } from '$lib/server/BackendAdmin';
import { getEvents } from '$lib/server/BackendAgentEvent';
import type { SolsticeEventInfo } from '$lib/server/BackendTypes.ts';
import { generateChecksum } from '$lib/server/CacheMaster';
import { error, fail, redirect } from '@sveltejs/kit';

export async function load({ cookies }) {
    const userJson = cookies.get('userInfo');
    const checksum = cookies.get('userChecksum');
    const isAdmin = await check_Creator_Access(cookies.get('authToken'), userJson, checksum);
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
    if (isAdmin == false) { redirect(308, '/'); }
    let events: SolsticeEventInfo[] = await getEvents() ?? [];

}