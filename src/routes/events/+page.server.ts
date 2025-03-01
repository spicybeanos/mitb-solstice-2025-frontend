import { getEvents } from '$lib/server/BackendAgentEvent';
import {  toSolsticeEvents } from '$lib/components/Events';
import { error } from '@sveltejs/kit';


export async function load() {
    try {
        const events = await getEvents();

        if (events == null)
            return ({ events: [] });
        else
            return ({ events: toSolsticeEvents(events) })
    } catch (err) {
        error(500,'Error fetching events')
    }

}


