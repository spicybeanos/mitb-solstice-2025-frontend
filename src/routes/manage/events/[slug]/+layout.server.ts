import { verifyAndGetUser } from "$lib/server/Backend";
import { check_EventRW_Access } from "$lib/server/BackendAdmin";
import { generateChecksum } from "$lib/server/CacheMaster";
import { redirect } from "@sveltejs/kit";

export async function load({ cookies, params }) {
    const jwt = cookies.get('authToken');
    const userJson = cookies.get('userInfo');
    const checksum = cookies.get('userChecksum');
    const canAccess = await check_EventRW_Access(jwt, userJson, checksum, params.slug);
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
    if (canAccess == false) { redirect(308, '/profile'); }
}