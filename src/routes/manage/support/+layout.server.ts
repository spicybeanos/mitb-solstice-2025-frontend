import { verifyAndGetUser } from "$lib/server/Backend";
import { check_TicketsRW_Access } from "$lib/server/BackendAdmin";
import { generateChecksum } from "$lib/server/CacheMaster";
import { error, redirect } from "@sveltejs/kit";

export async function load({ cookies }) {
    try {
        const userJson = cookies.get('userInfo');
        const checksum = cookies.get('userChecksum');
        const check = await check_TicketsRW_Access(cookies.get('authToken'), userJson, checksum);
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
        if (!check) { error(403, 'You do not have access to support tickets!') }
    }
    catch (err) {
        error(403, err as string);
    }
}