import { verifyAndGetUser } from "$lib/server/Backend";
import { check_PassRW_Access } from "$lib/server/BackendAdmin";
import { generateChecksum } from "$lib/server/CacheMaster";
import {getAllPasses} from '$lib/server/BackendAgentPass.ts'
import { redirect } from "@sveltejs/kit";

export async function load({ cookies }) {
    const jwt = cookies.get('authToken');
    const userJson = cookies.get('userInfo');
    const checksum = cookies.get('userChecksum');
    const canAccess = await check_PassRW_Access(jwt, userJson, checksum);
   
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
    if (canAccess == false) { redirect(308, '/profile'); }

    const passes = await getAllPasses();
    if (passes == null) {
        console.log('No events!');
        redirect(308, '/manage');
    }

    return { passes: passes }
}


