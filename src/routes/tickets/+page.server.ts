import { verifyAndGetUser } from '$lib/components/backend/Backend.js';
import { getTicketsFromEmail } from '$lib/components/database.js';
import { redirect } from '@sveltejs/kit';

export async function load({ cookies }) {
    const user = await verifyAndGetUser(cookies.get('authToken'));

    if (user.success == false) { redirect(308, '/support'); }
    if (user.result == undefined) { redirect(308, '/profile'); }
    const tickets = getTicketsFromEmail(user.result?.email_address);
    console.log(`Tickets for ${user.result.email_address} : ${tickets.length}`)
    return {tickets:tickets}
}