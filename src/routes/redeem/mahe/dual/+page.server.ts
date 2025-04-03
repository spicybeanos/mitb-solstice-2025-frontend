import { verifyAndGetUser } from '$lib/server/Backend.js';
import { getAllPasses } from '$lib/server/BackendAgentPass';
import { createTicket } from '$lib/server/BackendAgentSupport.js';
import { getuserIdFromRegNo } from '$lib/server/BackendAgentUser.js';
import type { ProblemTicketNEW } from '$lib/server/BackendTypes.js';
import { fail } from '@sveltejs/kit';


export async function load({ cookies }) {
    const usr = await verifyAndGetUser(cookies.get('authToken'), null, null);
    if (usr.result == null) {
        return {
            is_logged_in: false
        }
    }
    return {
        is_logged_in: true,
        pass: usr.result.pass_id
    }
}

export const actions = {
    default: async ({ cookies, request }) => {
        const usr = await verifyAndGetUser(cookies.get('authToken'), null, null);
        if (usr.result == null) {
            return fail(400, { msg: "Youre not logged in" })
        }

        const form = await request.formData();
        const reg1 = form.get('reg1');
        const reg2 = form.get('reg2');
        const phone = form.get('bil_ph');

        if (reg1 == null) { return fail(400, { msg: "Reg 1 is empty" }) }
        if (reg2 == null) { return fail(400, { msg: "Reg 2 is empty" }) }
        if (phone == null) { return fail(400, { msg: "Phone number is empty" }) }

        const u1 = await getuserIdFromRegNo(reg1 as string)
        const u2 = await getuserIdFromRegNo(reg2 as string)

        if (u1.result == null) { return fail(400, { msg: "User with reg 1 hasnt registered!" }) }
        if (u2.result == null) { return fail(400, { msg: "User with reg 2 hasnt registered!" }) }

        const email = usr.result?.email_address as string;
        const time = new Date().toISOString();
        const solved = false;

        const ticket: ProblemTicketNEW = {
            name: usr.result.first_name + usr.result.last_name,
            phone_number: phone as string,
            college_name: "MIT",
            problem: '',
            description: `TYPE=DUAL; \nBILL_PHONE=${phone}; \nREG1=${reg1}; \nREG2=${reg2}; \nUSR1=${u1.result}; \nUSR2=${u2.result}`,
            category: 'passes',
            email_address: email,
            timestamp: time,
            solved: solved,
            solved_email_address: null,
            comment: ''
        };
        const res = await createTicket(ticket);
        if (res.suc) {
            return { msg: 'Queued in for pass redemtion! You can check the status in support > tickets youve submitted' };
        } else {
            return fail(500, { msg: `Failed make ticket: ${res.ex}` })
        }
    }
}