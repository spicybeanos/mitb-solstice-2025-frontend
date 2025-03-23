import { check_EventRW_Access, checkAdminAccess } from "$lib/server/BackendAdmin";
import { error, fail, redirect } from "@sveltejs/kit";
import type { DateTime } from "@auth/core/providers/kakao";
import type { EventType, SolsticeEventInfo, SolsticePassInfo, Workshop } from "$lib/server/BackendTypes";
import { getUserId } from "$lib/server/BackendAgentUser.ts";
import { getAllPasses } from "$lib/server/BackendAgentPass.ts";
import { get, post, verifyAndGetUser } from "$lib/server/Backend";
import { generateChecksum } from "$lib/server/CacheMaster";
import { logAuditChange } from "$lib/server/AuditLogger.js";
import { getUserObjectFromJWT } from "$lib/server/GAuth.js";
import { deleteWorkshop, getWorkshop, updateWorkshop } from "$lib/server/BackendWorkshop.js";

export async function load({ cookies, params }) {
    const jwt = cookies.get('authToken');
    const userJson = cookies.get('userInfo');
    const checksum = cookies.get('userChecksum');
    const canAccess = await check_EventRW_Access(jwt, userJson, checksum, params.slug);
    const isAdmin = await checkAdminAccess(jwt, userJson, checksum);
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
    const workshop = await getWorkshop(params.slug);
    if (workshop == null) {
        console.log('trying to edit a non existing event!');
        return {
            permitted: true,
            isAdmin: false,
            passes: [],
            workshop: null
        }
    }
    return { permitted: true, workshop: workshop, isAdmin: isAdmin }
}

export const actions = {
    deleteWorkshop: async ({ cookies, request, params }) => {
        const userJson = cookies.get('userInfo');
        const checksum = cookies.get('userChecksum');
        const check = await check_EventRW_Access(cookies.get('authToken'), userJson, checksum, params.slug);
        if (check == false) { return fail(403, { success: false, error: 'Unauthorized edit' }); }
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
        const guser = getUserObjectFromJWT(cookies.get('authToken') as string);
        const res = await deleteWorkshop(params.slug);
        if (res != null) {
            await logAuditChange({ action: "DELETE", table_name: 'event', user_email: guser.email, record_id: params.slug });
            return { success: true };
        }
        return { success: false };
    },
    updateWorkshop: async ({ cookies, request, params }) => {
        const userJson = cookies.get('userInfo');
        const checksum = cookies.get('userChecksum');
        const check = await check_EventRW_Access(cookies.get('authToken'), userJson, checksum, params.slug);
        if (check == false) { return fail(403, { success: false, error: 'Unauthorized edit' }); }
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
        const guser = getUserObjectFromJWT(cookies.get('authToken') as string);

        const workshopInfo = await getWorkshop(params.slug);
        if (workshopInfo == null) {
            return fail(403, { success: false, error: 'Non existant workshop!' });
        }

        const form = await request.formData();
        if (form == null) { return fail(400, { msg: 'no form!' }); }

        const name = form.get('name') as string | null;
        const desc = form.get('desc') as string | null;
        const venue = form.get('venue') as string | null;
        const dfrom = form.get('dfrom') as string | null;
        const dto = form.get('dto') as string | null;
        const club = form.get('club') as string | null;
        let image_url = form.get('image_url') as string | null;

        if (name == undefined || name == null) { return fail(400, { success: false, error: 'name field undefined/null!' }) }
        if (desc == undefined || desc == null) { return fail(400, { success: false, error: 'description field undefined/null!' }) }
        if (venue == undefined || venue == null) { return fail(400, { success: false, error: 'venue field undefined/null!' }) }
        if (dfrom == undefined || dfrom == null) { return fail(400, { success: false, error: 'date from field undefined/null!' }) }
        if (dto == undefined || dto == null) { return fail(400, { success: false, error: 'date to field undefined/null!' }) }
        if (club == undefined || club == null) { return fail(400, { success: false, error: 'club field undefined/null!' }) }
        if (image_url == undefined || image_url == null) { return fail(400, { success: false, error: 'image url field undefined/null!' }) }

        if (image_url == '') { image_url = null; }

        const new_workshop: Workshop = {
            club: club,
            date_from: dfrom,
            date_to: dto,
            description: desc,
            id: params.slug,
            name: name,
            venue: venue,
            image_url: image_url
        }

        await logAuditChange({ action: "UPDATE", table_name: 'workshop', user_email: guser.email, record_id: params.slug, old_data: workshopInfo, new_data: new_workshop });


        const result = await updateWorkshop(params.slug, new_workshop);
        if (result.success == true) { return { success: true }; }
        if (result.success == false) { return fail(500, { success: false, error: result.error }); }

    }
}