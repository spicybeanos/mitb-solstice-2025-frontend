import { check_EventRW_Access, checkAdminAccess } from "$lib/server/BackendAdmin";
import { getEventInfo, getEventPasses, updateEventDetails } from "$lib/server/BackendAgentEvent";
import { error, fail, redirect } from "@sveltejs/kit";
import type { DateTime } from "@auth/core/providers/kakao";
import type { EventType, SolsticeEventInfo, SolsticePassInfo, UpdateEvent } from "$lib/server/BackendTypes";
import { getUserId } from "$lib/server/BackendAgentUser.ts";
import { getAllPasses } from "$lib/server/BackendAgentPass.ts";
import { get, post, verifyAndGetUser } from "$lib/server/Backend";
import { generateChecksum } from "$lib/server/CacheMaster";
import { logAuditChange } from "$lib/server/AuditLogger.js";
import { getUserObjectFromJWT } from "$lib/server/GAuth.js";

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
    const event = await getEventInfo(params.slug);
    const passes = await getAllPasses() ?? [];
    if (event == null) {
        console.log('trying to edit a non existing event!');
        return {
            permitted: true,
            isAdmin: false,
            passes: [],
            event: {
                description: null,
                id: "none",
                name: "",
                organizer_id: null,
                start: null,
                team_members: null,
                type: "other",

                venue: null,
            }
        }
    }
    return { permitted: true, event: event, isAdmin: isAdmin, passes: passes }
}

export const actions = {
    updateEvent: async ({ cookies, request, params }) => {
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
        const guser = getUserObjectFromJWT(cookies.get('authToken') as string);

        const eventInfo = await getEventInfo(params.slug);
        if (eventInfo == null) {
            return fail(403, { success: false, error: 'Non existant event!' });
        }

        const form = await request.formData();
        if (form == null) { return fail(400, { msg: 'no form!' }); }

        const name = form.get('name') as string | null;
        const desc = form.get('desc') as string | null;
        const venue = form.get('venue') as string | null;
        const team_mem_str = form.get('team_mem') as string | null;
        const type_str = form.get('type') as string | null;
        const start_str = form.get('start') as string | null;
        const org = form.get('org') as string | null;

        if (name == undefined || name == null) { return fail(400, { success: false, error: 'name field undefined/null!' }) }
        if (desc == undefined || desc == null) { return fail(400, { success: false, error: 'description field undefined/null!' }) }
        if (venue == undefined || venue == null) { return fail(400, { success: false, error: 'venue field undefined/null!' }) }
        if (team_mem_str == undefined || team_mem_str == null) { return fail(400, { success: false, error: 'team members field undefined/null!' }) }
        if (type_str == undefined || type_str == null) { return fail(400, { success: false, error: 'category field undefined/null!' }) }
        if (start_str == undefined || start_str == null) { return fail(400, { success: false, error: 'event start time field undefined/null!' }) }

        let orgID = eventInfo.organizer_id;
        const isAdmin = await checkAdminAccess(cookies.get('authToken'), userJson, checksum);

        if (isAdmin == true) {
            if (org != null) {
                const ous = await getUserId(org);
                if (ous != null) {
                    orgID = ous;
                }
            }
        }

        const team_mem = parseInt(team_mem_str);
        const start: DateTime = start_str;
        const type: EventType = type_str as EventType;

        const new_event: UpdateEvent = {
            description: desc,
            name: name,
            start: start,
            team_members: team_mem == 0 ? null : team_mem,
            type: type,
            venue: venue,
            organizer_id: orgID
        }

        await logAuditChange({action:"UPDATE",table_name:'event',user_email:guser.email,record_id:params.slug,old_data:eventInfo,new_data:new_event});


        const result = await updateEventDetails(params.slug, new_event);
        if (result.success == true) { return { success: true }; }
        if (result.code == undefined) { return fail(500, { success: false, error: 'Error code is undefined! This should never happen' }); }
        return fail(result?.code, { success: false, error: result.error })

    }
}