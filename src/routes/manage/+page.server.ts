import { logAuditChange } from "$lib/server/AuditLogger.js";
import { verifyAndGetUser } from "$lib/server/Backend";
import { check_EventRW_Access, check_HR_Access, check_manage_Access } from "$lib/server/BackendAdmin";
import { generateChecksum } from "$lib/server/CacheMaster";
import { getBandDistributionEnabled, setBandDistributionEnabled } from "$lib/server/CheckerUser";
import { getUserObjectFromJWT } from "$lib/server/GAuth.js";
import { getShowArtist, getStayGForm, isEventRegistrationEnabled, setEventRegistrationEnabled, setShowArtist, setStayGForm } from "$lib/server/WebsiteMaster";
import { fail } from "@sveltejs/kit";

export async function load() {
    try {
        const eventRegis = await isEventRegistrationEnabled();
        const bandDist = await getBandDistributionEnabled();
        const gform = await getStayGForm();
        const art = await getShowArtist();
        return {
            eventRegis: eventRegis.success == true ? eventRegis.result : false,
            bandDist: bandDist.success == true ? bandDist.result : false,
            gform: gform.success == true ? gform.result : "",
            art:art.result ?? false
        };
    } catch (ex) {
        return fail(503)
    }

}

export const actions = {
    pass_synch: async ({ cookies }) => {
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
    },
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
            await setEventRegistrationEnabled(reg == 'on')
            logAuditChange({ action: 'UPDATE', table_name: 'website_properties', user_email: guser.email, record_id: 'is_event_registration_enabled', new_data: { value: reg == 'on' }, old_data: { value: reg != 'on' } })
            return { msg: 'success!' }
        } catch (ex) {
            return fail(503, { msg: `Error : ${ex}` })
        }

    },
    set_band_dist: async ({ cookies, request }) => {
        try {
            const jwt = cookies.get('authToken');
            const userJson = cookies.get('userInfo');
            const checksum = cookies.get('userChecksum');
            const canAccess = await check_HR_Access(jwt, userJson, checksum);
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

            if (!canAccess) { return fail(403, { msg: 'You cannot edit website properties![HR]' }) }

            const form = await request.formData();
            const band = form.get('band');
            await setBandDistributionEnabled(band == 'on')
            logAuditChange({ action: 'UPDATE', table_name: 'website_properties', user_email: guser.email, record_id: 'is_event_registration_enabled', new_data: { value: band == 'on' }, old_data: { value: band != 'on' } })
            return { msg: 'success!' }
        } catch (ex) {
            return fail(503, { msg: `Error : ${ex}` })
        }

    },
    gform: async ({ cookies, request }) => {
        try {
            const jwt = cookies.get('authToken');
            const userJson = cookies.get('userInfo');
            const checksum = cookies.get('userChecksum');
            const canAccess = await check_HR_Access(jwt, userJson, checksum);
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

            if (!canAccess) { return fail(403, { msg: 'You cannot edit website properties![HR]' }) }

            const form = await request.formData();
            const link = form.get('link') as string;
            await setStayGForm(link);
            logAuditChange({ action: 'UPDATE', table_name: 'website_properties', user_email: guser.email, record_id: 'is_event_registration_enabled', new_data: { value: link } })
            return { msg: 'success!' }
        } catch (ex) {
            return fail(503, { msg: `Error : ${ex}` })
        }

    },
    art: async ({ cookies, request }) => {
        try {
            const jwt = cookies.get('authToken');
            const userJson = cookies.get('userInfo');
            const checksum = cookies.get('userChecksum');
            const canAccess = await check_HR_Access(jwt, userJson, checksum);
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

            if (!canAccess) { return fail(403, { msg: 'You cannot edit website properties![HR]' }) }

            const form = await request.formData();
            const band = form.get('art');
            await setShowArtist(band == 'on')
            logAuditChange({ action: 'UPDATE', table_name: 'website_properties', user_email: guser.email, record_id: 'showArtist', new_data: { value: band == 'on' }, old_data: { value: band != 'on' } })
            return { msg: 'success!' }
        } catch (ex) {
            return fail(503, { msg: `Error : ${ex}` })
        }

    },
}