import { getTicketByTicketID } from '$lib/server/BackendAgentSupport';
import { getUserId } from '$lib/server/BackendAgentUser.ts';


export async function load({ url }) {
    const ticketID = url.searchParams.get('ticket_id');

    if (ticketID == null) {
        return {
            ticket: null,
            userID: null
        };
    }
    const ticket = await getTicketByTicketID(ticketID);
    if (ticket == null) {
        return {
            ticket: null,
            userID: null
        };
    }
    const userID = await getUserId(ticket.email_address);
    return {
        ticket: ticket,
        userID: userID
    };
}

export const actions = {
    dual:async ({cookies,request}) => {
        try {
            
        } catch (ex) {
            
        }
    },
    single: async ({cookies,request}) => {
        
    }
}