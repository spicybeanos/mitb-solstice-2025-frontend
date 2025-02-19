import { getEvents } from '$lib/components/backend/BackendAgentEvent.ts';
import { placeholderEvents, toSolsticeEvents, type SolsticeEvent } from '$lib/components/Events';
import { error } from '@sveltejs/kit';


export async function load()
{
    const events = await getEvents();
    
    if(events == null)
        return ({events:placeholderEvents});
    else
        return ({events:toSolsticeEvents(events)})
}


