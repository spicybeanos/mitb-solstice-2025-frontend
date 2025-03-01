import { check_EventRW_Access, check_manage_Access } from "$lib/server/BackendAdmin";
import { getEvents } from "$lib/server/BackendAgentEvent.js";
import { redirect } from "@sveltejs/kit";

export async function load({ cookies }) {
    const jwt = cookies.get('authToken');
    const canAccess = await check_manage_Access(jwt);
    if (canAccess == false) { redirect(308, '/profile'); }

    const events = await getEvents();
    if(events == null){
        console.log('No events!');
        redirect(308,'/manage');
    }

    return {events:events}
}