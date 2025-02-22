import { check_EventRW_Access } from "$lib/components/backend/BackendAdmin";
import { getEventInfo } from "$lib/components/backend/BackendAgentEvent.js";
import { fail, redirect } from "@sveltejs/kit";

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

        
    }
}