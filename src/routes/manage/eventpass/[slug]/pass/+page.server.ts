import { verifyAndGetUser } from "$lib/server/Backend";
import { check_EventRW_Access, check_manage_Access, check_PassRW_Access } from "$lib/server/BackendAdmin";
import { getAllPasses } from "$lib/server/BackendAgentPass.ts";
import { addEventPass, delEventPass, getEventPasses } from "$lib/server/BackendAgentEvent.ts";
import { generateChecksum } from "$lib/server/CacheMaster";
import { fail, redirect } from "@sveltejs/kit";
import { logAuditChange } from "$lib/server/AuditLogger.js";
import { getUserObjectFromJWT } from "$lib/server/GAuth.js";

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
            let f = true;
            for (const ev of eventPass.result) {
                if (ev.id == p.id) {
                    f = false;
                }
            }
            if (f) {
                otherPasses.push(p);
            }
        }
    }
    return { success: true, eventPasses: eventPass.result ?? [], otherPasses: otherPasses ?? [] };

}

export const actions = {
    modifyPasses: async ({ cookies, request, params }) => {
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
        const guser = getUserObjectFromJWT(jwt as string);
        if (canAccess == false) { redirect(308, '/profile'); }

        const form = await request.formData();
        const add_str = form.get('assign') as string | null;
        const rem_str = form.get('remove') as string | null;

        if (rem_str == null || add_str == null) {
            return fail(400, { err: 'Incomplete data' });
        }
        let addPass = add_str.split('&');
        let remPass = rem_str.split('&');

        let fail_add = [];
        let fail_remove = [];

        for (const ap of addPass) {
            if (ap.trim() != '') {
                const r = await addEventPass(params.slug, ap.trim());
                if (r.success == false) {
                    fail_add.push(`${ap.trim()}=>${r.error}`);
                }
            }
        }
        for (const rp of remPass) {
            if (rp.trim() != '') {
                const r = await delEventPass(params.slug, rp.trim());
                if (r.success == false) {
                    fail_remove.push(`${rp.trim()}=>${r.error}`);
                }
            }
        }
        await logAuditChange({action:'INSERT',table_name:'event-pass',user_email:guser.email,record_id:params.slug,new_data:{added:addPass,removed:remPass}})
        if (fail_add.length == 0 && fail_remove.length == 0) {
            return { msg: 'success!' };
        } else {
            return fail(503, { err: `Failed to add/remove: \nadd: ${fail_add}\nremove:${fail_remove}` })
        }
    }
}