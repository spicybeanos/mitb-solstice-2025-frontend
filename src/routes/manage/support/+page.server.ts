import { check_TicketsRW_Access } from '$lib/server/BackendAdmin.js';
import { getUnsolvedTickets } from '$lib/server/BackendAgentSupport.js';
import type { ProblemTicket } from '$lib/server/BackendTypes.js';
import { error, fail } from '@sveltejs/kit';

export async function load({ cookies }) {
    try {
        const tickets = await getUnsolvedTickets();
        const access = await check_TicketsRW_Access(cookies.get('authToken'));
        if (access == true) { return { tickets: tickets as ProblemTicket[] } }
        else { return fail(403, { tickets: [] as ProblemTicket[], err: 'You do not have permission to view tickets!' }); }
    } catch (err) {
        return fail(503, { tickets: [] as ProblemTicket[], err: 'Service is temporerily offline!' })
    }
}