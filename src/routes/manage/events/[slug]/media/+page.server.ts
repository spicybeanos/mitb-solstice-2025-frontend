import { check_EventRW_Access, checkAdminAccess } from "$lib/server/BackendAdmin";
import { getEventInfo, getEventPasses, updateEventDetails } from "$lib/server/BackendAgentEvent";
import { error, fail, redirect } from "@sveltejs/kit";
import type { DateTime } from "@auth/core/providers/kakao";
import type { EventType, SolsticeEventInfo, SolsticePassInfo, UpdateEvent } from "$lib/server/BackendTypes";
import { getUserId } from "$lib/server/BackendAgentUser.ts";
import { getAllPasses } from "$lib/server/BackendAgentPass.ts";
import { get, post, verifyAndGetUser, type Result } from "$lib/server/Backend";
import { generateChecksum } from "$lib/server/CacheMaster";
import { changeEventMedia, defaultEvent, getEventMedia, type EventMedia } from "$lib/server/WebsiteMaster.js";
import { logAuditChange } from "$lib/server/AuditLogger";
import { getUserObjectFromJWT } from "$lib/server/GAuth";

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
    // const event = await getEventInfo(params.slug);
    // const passes = await getAllPasses() ?? [];
    const media = await getEventMedia(params.slug);
    if (media.success == false || media.success == null) {
        console.log('trying to edit a non existing event!');
        return {
            permitted: true,
            isAdmin: false,
            media: {
                success: true, result: {
                    thumbnail: defaultEvent.thumbnail,
                    background: defaultEvent.background,
                    rulebook: defaultEvent.rulebook,
                    max_teams: defaultEvent.max_teams
                }, error: null
            } as Result<EventMedia>
        }
    }
    return { permitted: true, media: media, isAdmin: isAdmin }
}

export const actions = {
    updateMedia: async ({ cookies, request, params }) => {
        try {
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

            const eventInfo = await getEventInfo(params.slug);
            if (eventInfo == null) {
                return fail(403, { success: false, error: 'Non existant event!' });
            }

            const form = await request.formData();
            if (form == null) { return fail(400, { msg: 'no form!' }); }

            const thumb = form.get('thumb') as string | null;
            const back = form.get('backg') as string | null;
            const rule = form.get('rule') as string | null;
            const str_max_teams = form.get('max_teams') as string | null;


            if (thumb == undefined || thumb == null) { return fail(400, { success: false, error: 'thumbnail field undefined/null!' }) }
            if (back == undefined || back == null) { return fail(400, { success: false, error: 'background field undefined/null!' }) }
            if (rule == undefined || rule == null) { return fail(400, { success: false, error: 'rule field undefined/null!' }) }
            if (str_max_teams == undefined || str_max_teams == null) { return fail(400, { success: false, error: 'max teams undefined/null!' }) }

            const max_teams = parseInt(str_max_teams);

            let orgID = eventInfo.organizer_id;
            const isAdmin = await checkAdminAccess(cookies.get('authToken'), userJson, checksum);

            const new_media: EventMedia = {
                background: back,
                thumbnail: thumb,
                rulebook: rule,
                eventID: params.slug,
                max_teams: max_teams
            }
            await logAuditChange({ action: "UPDATE", table_name: 'media', user_email: guser.email, record_id: params.slug, new_data: new_media });

            const result = await changeEventMedia(params.slug, new_media);
            if (result.success == true) { return { success: true }; }
            return fail(400, { success: false, error: result.error })
        } catch (ex) {
            return fail(503, { success: false, error: ex })
        }



    }
}