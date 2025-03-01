import { check_EventRW_Access } from "$lib/server/BackendAdmin";
import { getEventInfo, updateEventDetails } from "$lib/server/BackendAgentEvent";
import { error, fail, redirect } from "@sveltejs/kit";
import type { DateTime } from "@auth/core/providers/kakao";
import type { EventType, SolsticeEventInfo, UpdateEvent } from "$lib/server/BackendTypes";

export async function load({ cookies, params }) {
    const jwt = cookies.get('authToken');
    const canAccess = await check_EventRW_Access(jwt, params.slug);
    if (canAccess == false) { redirect(308, '/profile'); }
    console.log(`editing event ${params.slug}`);
    const event = await getEventInfo(params.slug);
    if (event == null) {
        console.log('trying to edit a non existing event!');
        return {
            permitted: true,
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
    return { permitted: true, event: event }
}

export const actions = {
    updateEvent: async ({ cookies, request, params }) => {
        const check = await check_EventRW_Access(cookies.get('authToken'), params.slug);
        if (check == false) { return fail(403, { success: false, error: 'Unauthorized edit' }); }

        const eventInfo = await getEventInfo(params.slug);
        if (eventInfo == null) {
            return fail(403, { success: false, error: 'Non existant event!' });
        }

        const form = await request.formData();

        const name = form.get('name') as string | null;
        const desc = form.get('desc') as string | null;
        const venue = form.get('venue') as string | null;
        const team_mem_str = form.get('team_mem') as string | null;
        const type_str = form.get('type') as string | null;
        const start_str = form.get('start') as string | null;

        if (name == undefined || name == null) { return fail(400, { success: false, error: 'name field undefined/null!' }) }
        if (desc == undefined || desc == null) { return fail(400, { success: false, error: 'description field undefined/null!' }) }
        if (venue == undefined || venue == null) { return fail(400, { success: false, error: 'venue field undefined/null!' }) }
        if (team_mem_str == undefined || team_mem_str == null) { return fail(400, { success: false, error: 'team members field undefined/null!' }) }
        if (type_str == undefined || type_str == null) { return fail(400, { success: false, error: 'category field undefined/null!' }) }
        if (start_str == undefined || start_str == null) { return fail(400, { success: false, error: 'event start time field undefined/null!' }) }

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
            organizer_id: eventInfo.organizer_id
        }
        const result = await updateEventDetails(params.slug, new_event);
        if (result.success == true) { return { success: true }; }
        if (result.code == undefined) { return fail(500, { success: false, error: 'Error code is undefined! This should never happen' }); }
        return fail(result?.code, { success: false, error: result.error })

    }
}