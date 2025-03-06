import { checkAdminAccess } from '$lib/server/BackendAdmin.js'
import { createEvent } from '$lib/server/BackendAgentEvent.js';
import { getUserId } from '$lib/server/BackendAgentUser.js';
import type { EventType, SolsticeEventInfo, UpdateEvent } from '$lib/server/BackendTypes.js';
import type { DateTime } from '@auth/sveltekit/providers/kakao';
import { fail } from '@sveltejs/kit';


export const actions = {
    createEvent: async ({ cookies, request }) => {
        try {
            const access = await checkAdminAccess(cookies.get('authToken'));
            if (access == false) { return fail(403, { success: false, error: 'Unauthorized!' }) }

            const form = await request.formData();
            if (form == null) { return fail(400, { success: false, error: 'no form!' }); }

            const name = form.get('name') as string | null;
            const desc = form.get('desc') as string | null;
            const venue = form.get('venue') as string | null;
            const team_mem_str = form.get('team_mem') as string | null;
            const type_str = form.get('type') as string | null;
            const start_str = form.get('start') as string | null;
            const org_email = form.get('org') as string | null;

            if (name == undefined || name == null) { return fail(400, { success: false, error: 'name field undefined/null!' }) }
            if (desc == undefined || desc == null) { return fail(400, { success: false, error: 'description field undefined/null!' }) }
            if (venue == undefined || venue == null) { return fail(400, { success: false, error: 'venue field undefined/null!' }) }
            if (team_mem_str == undefined || team_mem_str == null) { return fail(400, { success: false, error: 'team members field undefined/null!' }) }
            if (type_str == undefined || type_str == null) { return fail(400, { success: false, error: 'category field undefined/null!' }) }
            if (start_str == undefined || start_str == null) { return fail(400, { success: false, error: 'event start time field undefined/null!' }) }
            if (org_email == undefined || org_email == null) { return fail(400, { success: false, error: 'organizer email field undefined/null!' }) }

            const org = await getUserId(org_email);
            if(org == undefined || org == null) { return fail(400, { success: false, error: 'organizer does not exist!' }) }

            const team_mem = parseInt(team_mem_str);
            const start: DateTime = start_str;
            const type: EventType = type_str as EventType;

            const event : UpdateEvent = {
                name: name,
                description: desc,
                type: 'cultural',
                team_members: team_mem,
                start: start,
                venue: venue,
                organizer_id: org
            }
            const res = await createEvent(event);
            if(res.success == true){
                return {success:true}
            }else if(res.code != undefined){
                return fail(res.code,{success:false,error:res.error})
            }else{
                return fail(503 ,{success:false,error:res.error})
            }
        } catch (e) {

        }
    }
}