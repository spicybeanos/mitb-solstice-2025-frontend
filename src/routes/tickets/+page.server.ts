import { verifyAndGetUser } from '$lib/server/Backend';
import { getTicketsFromEmail } from '$lib/server/BackendAgentSupport.ts';
import { generateChecksum } from '$lib/server/CacheMaster';
import { error, redirect } from '@sveltejs/kit';

export async function load({ cookies }) {
    try {
        const userJson = cookies.get('userInfo');
        const checksum = cookies.get('userChecksum');
        const user = await verifyAndGetUser(cookies.get('authToken'), userJson, checksum);
        if (userJson == null || checksum == null) {
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
        if (user.success == false) { redirect(308, '/support'); }
        if (user.result == undefined) { redirect(308, '/profile'); }
        const tickets = await getTicketsFromEmail(user.result?.email_address);
        return { tickets: tickets }
    } catch (err) {
        error(500, 'Could not fetch tickets');
    }

}