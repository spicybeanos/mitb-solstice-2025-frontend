import { verifyAndGetUser } from '$lib/server/Backend';
import { getTicketsFrom_email } from '$lib/server/BackendAgentSupport.ts';
import { error, redirect } from '@sveltejs/kit';

export async function load({ cookies }) {
    try {
        const user = await verifyAndGetUser(cookies.get('authToken'));

        if (user.success == false) { redirect(308, '/support'); }
        if (user.result == undefined) { redirect(308, '/profile'); }
        const tickets = await getTicketsFrom_email(user.result?.email_address);
        return { tickets: tickets }
    } catch (err) {
        error(500,'Could not fetch tickets');
    }

}