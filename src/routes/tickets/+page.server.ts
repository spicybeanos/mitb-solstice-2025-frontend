import { verifyAndGetUser } from '$lib/server/Backend';
import { getTicketsFrom_email } from '$lib/server/BackendAgentSupport.ts';
import { redirect } from '@sveltejs/kit';

export async function load({ cookies }) {
    const user = await verifyAndGetUser(cookies.get('authToken'));

    if (user.success == false) { redirect(308, '/support'); }
    if (user.result == undefined) { redirect(308, '/profile'); }
    const tickets =await getTicketsFrom_email(user.result?.email_address);
    console.log(`Tickets for ${user.result.email_address} : ${tickets.length}`)
    return {tickets:tickets}
}