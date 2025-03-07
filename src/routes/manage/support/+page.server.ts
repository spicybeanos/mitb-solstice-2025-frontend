import { verifyAndGetUser } from '$lib/server/Backend';
import { check_TicketsRW_Access } from '$lib/server/BackendAdmin.js';
import { getUnsolvedTickets } from '$lib/server/BackendAgentSupport.js';
import type { ProblemTicket } from '$lib/server/BackendTypes.js';
import { generateChecksum } from '$lib/server/CacheMaster';
import { error, fail } from '@sveltejs/kit';

export async function load({ cookies }) {
    try {
        const tickets = await getUnsolvedTickets();
        const userJson = cookies.get('userInfo');
        const checksum = cookies.get('userChecksum');
        const access = await check_TicketsRW_Access(cookies.get('authToken'), userJson, checksum);
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
        if (access == true) { return { tickets: tickets as ProblemTicket[] } }
        else { return fail(403, { tickets: [] as ProblemTicket[], err: 'You do not have permission to view tickets!' }); }
    } catch (err) {
        return fail(503, { tickets: [] as ProblemTicket[], err: 'Service is temporerily offline!' })
    }
}