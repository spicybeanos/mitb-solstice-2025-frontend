import { verifyAndGetUser } from '$lib/server/Backend';
import { checkAdminAccess } from '$lib/server/BackendAdmin';
import { generateChecksum } from '$lib/server/CacheMaster';
import { redirect } from '@sveltejs/kit';

export async function load({ cookies }) {
    const userJson = cookies.get('userInfo');
    const checksum = cookies.get('userChecksum');
    const access = await checkAdminAccess(cookies.get('authToken'), userJson, checksum);
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
    if (access == false) { redirect(308, '/'); }
}