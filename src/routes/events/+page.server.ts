import { getEvents } from '$lib/server/BackendAgentEvent';
import { toSolsticeEvents } from '$lib/components/Events';
import { error } from '@sveltejs/kit';
import { getMultipleEventMedia } from '$lib/server/WebsiteMaster';


export async function load() {
    try {
        const events = await getEvents();
        if (events == null) {
            return ({ events: [] });
        }
        else {
            let ids = [];
            for (const e of events) {
                ids.push(e.id)
            }
            const medias = await getMultipleEventMedia(ids);
            return ({ events: toSolsticeEvents(events), medias: medias })
        }
    } catch (err) {
        error(500, 'Error fetching events')
    }
}


