import { verifyAndGetUser } from '$lib/server/Backend.js';
import { deleteTicket, getTicketByTicketID } from '$lib/server/BackendAgentSupport.js';
import { json } from '@sveltejs/kit';


export async function POST({ params, cookies }) {
    try {
        const ticketID = params.ticket_id;
        const ticket = await getTicketByTicketID(ticketID);
        const usr = await verifyAndGetUser(cookies.get('authToken'), null, null);
        if (usr.success == false) { return json({ error: "Not logged in" }, { status: 401 }) }
        if (usr.result?.email_address != ticket?.email_address) { return json({ error: "You're not the author of this ticket" }, { status: 403 }) }

        const d = await deleteTicket(ticketID);
        if (d.success == false) { return json({ error: `Could not delete ticket: ${JSON.stringify(d.error)}` }, { status: 500 }) }
        return json({ msg: `Deleted ticket successfully` }, { status: 200 })
    } catch (ex) {
        return json({ error: `Failed to delete ticket ${JSON.stringify(ex)}` }, { status: 500 });
    }
}