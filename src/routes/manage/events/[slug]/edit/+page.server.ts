import { check_EventRW_Access } from "$lib/components/backend/BackendAdmin";
import { getEventInfo } from "$lib/components/backend/BackendAgentEvent.ts";
import { fail, redirect } from "@sveltejs/kit";
import type { DateTime } from "@auth/core/providers/kakao";
import type { EventType } from "$lib/components/backend/BackendTypes.ts";

export async function load({ cookies, params }) {
    const jwt = cookies.get('authToken');
    const canAccess = await check_EventRW_Access(jwt, params.slug);
    if (canAccess == false) { redirect(308, '/profile'); }
    console.log(`editing event ${params.slug}`);
    const event = await getEventInfo(params.slug);
    if (event == null) {
        console.log('trying to edit a non existing event!');
        return {
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
    return { event: event }
}

export const actions = {
    updateEvent: async ({ cookies, request, params }) => {
        const check = await check_EventRW_Access(cookies.get('authToken'), params.slug);
        if (check == false) { return fail(403, { error: 'Unauthorized edit' }); }

        const form = await request.formData();
        try {
            const name = form.get('name') as string|null;
            const desc = form.get('desc') as string | null;
            const venue = form.get('venue') as string | null;
            const team_mem_str = form.get('team_mem') as string|null;
            const type_str = form.get('type') as string | null;
            const start_str = form.get('start') as string | null;

            if(name == undefined || name == null) {return fail(400,{error:'name field undefined/null!'})}
            if(desc == undefined || desc == null) {return fail(400,{error:'description field undefined/null!'})}
            if(venue == undefined || venue == null) {return fail(400,{error:'venue field undefined/null!'})}
            if(team_mem_str == undefined || team_mem_str == null) {return fail(400,{error:'team members field undefined/null!'})}
            if(type_str == undefined || type_str == null) {return fail(400,{error:'category field undefined/null!'})}
            if(start_str == undefined || start_str == null) {return fail(400,{error:'event start time field undefined/null!'})}
        
            const team_mem = parseInt(team_mem_str);
            const start : DateTime = start_str;
            const type : EventType = type_str as EventType;
        } 
        catch (err) {
            
        }
    }
}