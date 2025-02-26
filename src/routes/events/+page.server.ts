import { getEvents } from '$lib/components/backend/BackendAgentEvent.ts';
import { placeholderEvents, toSolsticeEvents, type SolsticeEvent } from '$lib/components/Events';
import { error } from '@sveltejs/kit';


export async function load() {
    try {
        const events = await getEvents();

        if (events == null)
            return ({ events: placeholderEvents });
        else
            return ({ events: toSolsticeEvents(events) })
    } catch (err) {
        error(500,'Error fetching events')
    }

}


