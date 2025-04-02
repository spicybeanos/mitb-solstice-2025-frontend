import { patch } from '$lib/server/Backend.js';
import { check_ITOC_Access } from '$lib/server/BackendAdmin.js';
import { getTicketByTicketID } from '$lib/server/BackendAgentSupport';
import { getUserId, getuserIdFromRegNo as getUserIdFromRegNo } from '$lib/server/BackendAgentUser.ts';
import { verifyGJWT } from '$lib/server/GAuth.js';
import { assignPass } from '$lib/server/PassAssign.js';
import { fail } from '@sveltejs/kit';

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
    dual: async ({ cookies, request }) => {
        try {
            const acc = await check_ITOC_Access(cookies.get('authToken'), null, null);
            const guser = await verifyGJWT(cookies.get('authToken') as string);

            if (guser.object == null) {
                return fail(403)
            }

            const form = await request.formData();
            const reg1 = form.get('reg1') as string | null
            const reg2 = form.get('reg2') as string | null
            const _es_ = form.get('esports') as string | null

            if (reg1 == null) { return fail(400, { msg: `reg1 is empty` }) }
            if (reg2 == null) { return fail(400, { msg: `reg2 is empty` }) }
            // if (_es_ == null) { return fail(400, { msg: `esports is empty` }) }

            const esports = _es_ == 'on';

            const pass = esports ? "ALryBwdJS-yJm1zosXzUHQ" : "9iiwEUtZSz2052dd6S0wzw";

            const user1 = await getUserIdFromRegNo(reg1);
            const user2 = await getUserIdFromRegNo(reg2);

            if (user1.result == null) { return fail(400, { msg: 'user with reg1 does not exist' }) }
            if (user2.result == null) { return fail(400, { msg: 'user with reg2 does not exist' }) }

            const res1 = await assignPass(user1.result, pass, guser.object?.email)
            const res2 = await assignPass(user2.result, pass, guser.object?.email)

            if (res1.error != null || res2.error != null) {
                return fail(500, { msg: `failed to assign pass: \nuser 1 : ${res1.error}\nuser 2: ${res2.error}` });
            }

            return { msg: 'Success!' }
        }
        catch (ex) {
            return fail(500, { msg: `Serverside error ${JSON.stringify(ex)}` })
        }
    },
    single: async ({ cookies, request }) => {
        try {
            const acc = await check_ITOC_Access(cookies.get('authToken'), null, null);
            const guser = await verifyGJWT(cookies.get('authToken') as string);

            if (guser.object == null) {
                return fail(403)
            }

            const form = await request.formData();
            const reg = form.get('reg') as string | null
            const _es_ = form.get('esports') as string | null

            if (reg == null) { return fail(400, { msg: `reg is empty` }) }
            // if (_es_ == null) { return fail(400, { msg: `esports is empty` }) }

            const esports = _es_ == 'on';

            const pass = esports ? "T615OpoVROuHP5M7ghpPfA" : "mJY2B-iLTVG20fpz_Om0hg";

            const user1 = await getUserIdFromRegNo(reg);

            if (user1.result == null) { return fail(400, { msg: 'user with reg1 does not exist' }) }

            const res1 = await assignPass(user1.result, pass, guser.object?.email)

            if (res1.error != null) {
                return fail(500, { msg: `failed to assign pass: \nuser 1 : ${res1.error}` });
            }

            return { msg: 'Success!' }
        }
        catch (ex) {
            return fail(500, { msg: `Serverside error ${JSON.stringify(ex)}` })
        }
    }
}