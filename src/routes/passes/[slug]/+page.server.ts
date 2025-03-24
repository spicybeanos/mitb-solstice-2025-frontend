import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getPassInfo, getAllEventsInPass } from '$lib/server/BackendAgentPass';
import type { SolsticeEventInfo, SolsticePassInfo } from '$lib/server/BackendTypes';


export const load: PageServerLoad = async ({ params }) => {
    try {
        if (!params.slug) {
            throw error(400, 'Pass ID is required');
        }

        const passId = params.slug;


        const [pass, eventsInPass]: [SolsticePassInfo | null, SolsticeEventInfo[] | null] = await Promise.all([
            getPassInfo(passId),
            getAllEventsInPass(passId)
        ]);

        if (!pass) {
            throw error(404, 'Pass not found');
        }

        if (!eventsInPass || eventsInPass.length === 0) {
            return {
                slug: passId,
                pass,
                events: []
            };
        }

        return {
            pass,
            events: eventsInPass
        };
    } catch (err) {
        console.error('Error loading pass:', err);
        throw error(500, 'Failed to load pass details');
    }
};