import { logAuditChange } from "$lib/server/AuditLogger.js";
import { verifyAndGetUser } from "$lib/server/Backend";
import { check_EventRW_Access, check_manage_Access } from "$lib/server/BackendAdmin";
import { generateChecksum } from "$lib/server/CacheMaster";
import { getUserObjectFromJWT } from "$lib/server/GAuth.js";
import { isEventRegistrationEnabled, setEventRegistrationEnabled } from "$lib/server/WebsiteMaster";
import { fail } from "@sveltejs/kit";

export async function load() {
    try {
        const eventRegis = await isEventRegistrationEnabled();
        return { eventRegis: eventRegis.success == true ? eventRegis.result : false };
    } catch (ex) {

    }

}

export const actions = {
    set_event_regist: async ({ cookies, request }) => {
        try {
            const jwt = cookies.get('authToken');
            const userJson = cookies.get('userInfo');
            const checksum = cookies.get('userChecksum');
            const canAccess = await check_manage_Access(jwt, userJson, checksum);
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

            if (!canAccess) { return fail(403, { msg: 'You cannot edit website properties!' }) }

            const form = await request.formData();
            const reg = form.get('reg');
            console.log(`calue : ${reg}`);
            await setEventRegistrationEnabled(reg == 'on')
            logAuditChange({ action: 'UPDATE', table_name: 'website_properties', user_email: guser.email, record_id: 'is_event_registration_enabled', new_data: { value: reg == 'on' }, old_data: { value: reg != 'on' } })
        } catch (ex) {
            return fail(503,{msg:`Error : ${ex}`})
        }

    }
}