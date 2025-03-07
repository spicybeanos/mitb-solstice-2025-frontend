import { verifyAndGetUser } from '$lib/server/Backend';
import { check_TicketsRW_Access } from '$lib/server/BackendAdmin';
import { getTicketByTicketID, setTicketStatus } from '$lib/server/BackendAgentSupport.js';
import { generateChecksum } from '$lib/server/CacheMaster';
import { fail } from '@sveltejs/kit';

export async function load({ cookies, params }) {
    const userJson = cookies.get('userInfo');
    const checksum = cookies.get('userChecksum');
    const access = await check_TicketsRW_Access(cookies.get('authToken'), userJson, checksum);
    if (userJson == null || checksum == null) {
        const user = await verifyAndGetUser(cookies.get('authToken'), userJson, checksum);
        if (user.result != null) {
            cookies.set('userInfo', JSON.stringify(user.result), {
                httpOnly: false, // Accessible by frontend
                secure: true,
                sameSite: "strict",
                path: "/"
            });
            cookies.set('userChecksum', generateChecksum(user.result), {
                httpOnly: false, // Accessible by frontend
                secure: true,
                sameSite: "strict",
                path: "/"
            });
        }
    }
    if (access == false) { return fail(403, { err: 'You do not have access to view/modify tickets!' }); }
    if (params.slug == null) { return fail(404, { err: 'Ticket id cannot be null!' }); }
    const ticket = await getTicketByTicketID(params.slug);
    if (ticket == null) { return fail(404, { err: 'Ticket with that ID does not exist!' }); }

    return { ticket: ticket }
}

export const actions = {
    solve: async ({ cookies, request, params }) => {
        try {
            const userJson = cookies.get('userInfo');
            const checksum = cookies.get('userChecksum');
            const access = await check_TicketsRW_Access(cookies.get('authToken'), userJson, checksum);
            if (userJson == null || checksum == null) {
                const user = await verifyAndGetUser(cookies.get('authToken'), userJson, checksum);
                if (user.result != null) {
                    cookies.set('userInfo', JSON.stringify(user.result), {
                        httpOnly: false, // Accessible by frontend
                        secure: true,
                        sameSite: "strict",
                        path: "/"
                    });
                    cookies.set('userChecksum', generateChecksum(user.result), {
                        httpOnly: false, // Accessible by frontend
                        secure: true,
                        sameSite: "strict",
                        path: "/"
                    });
                }
            }
            if (access == false) { return fail(403, { err: 'You do not have authority to solve tickets!' }); }
            const ticketID = params?.slug;
            if (ticketID == null) { return fail(400, { err: 'Invalid url!' }) }
            const form = await request.formData();
            if (form == null) { return fail(400, { err: 'No form!' }); }
            const comment = form.get('comment');
            const solved = form.get('solved');
            if (comment == null) { return fail(400, { err: 'No comment!' }); }
            console.log(`ticket solved : ${solved}`)
            await setTicketStatus(ticketID, solved == 'on', comment as string);
            return { msg: 'Submitted.' }
        }
        catch (ex) {
            return fail(503, { err: `Service request failed: ${ex}` })
        }
    },
    delete: async ({ cookies, params }) => {

    }
}