import { verifyAndGetUser } from '$lib/server/Backend';
import { check_manage_Access } from '$lib/server/BackendAdmin.ts';
import { generateChecksum } from '$lib/server/CacheMaster';
import { error } from '@sveltejs/kit';

export async function load({ cookies }) {
    try {
        const jwt = cookies.get('authToken');
        const userJson = cookies.get('userInfo');
        const checksum = cookies.get('userChecksum');
        const manageAccess = await check_manage_Access(jwt, userJson, checksum);
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
        return { authToken: jwt, manageAccess: manageAccess };
    } catch (err) {
        error(500, "Could not read user cookies")
    }
}
