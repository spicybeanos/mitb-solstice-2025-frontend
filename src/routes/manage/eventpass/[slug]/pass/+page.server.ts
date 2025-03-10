import { verifyAndGetUser } from "$lib/server/Backend";
import { check_EventRW_Access, check_manage_Access, check_PassRW_Access } from "$lib/server/BackendAdmin";
import { getAllPasses } from "$lib/server/BackendAgentPass.ts";
import { getEventPasses } from "$lib/server/BackendAgentEvent.ts";
import { generateChecksum } from "$lib/server/CacheMaster";
import { redirect } from "@sveltejs/kit";

export async function load({ cookies, params }) {
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
                maxAge: 3600
            });
            cookies.set('userChecksum', generateChecksum(user.result), {
                httpOnly: false, // Accessible by frontend
                secure: true,
                sameSite: "strict",
                path: "/",
                maxAge: 3600
            });
        }
    }
    if (canAccess == false) { redirect(308, '/profile'); }

    const passes_ = await getAllPasses();
    const eventPass = await getEventPasses(params.slug);
    let otherPasses = [];
    if (eventPass.success && eventPass.result != null && passes_ != null) {
        for (const p of passes_) {
            if (!eventPass.result.includes(p)) {
                otherPasses.push(p);
            }
        }
    }
    return { success: true, eventPasses: eventPass.result ?? [], otherPasses: otherPasses ?? [] };

}