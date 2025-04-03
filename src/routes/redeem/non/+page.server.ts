import { verifyAndGetUser } from '$lib/server/Backend.js';
import { getAllPasses } from '$lib/server/BackendAgentPass.js';
import { createTicket } from '$lib/server/BackendAgentSupport.js';
import { getuserIdFromRegNo, getUserInfo } from '$lib/server/BackendAgentUser.js';
import type { ProblemTicketNEW } from '$lib/server/BackendTypes.js';
import { fail } from '@sveltejs/kit';


export async function load({ cookies }) {
    const usr = await verifyAndGetUser(cookies.get('authToken'), null, null);
    const passes = await getAllPasses();
    if (usr.result == null) {
        return {
            is_logged_in: false
        }
    }
    return {
        is_logged_in: true,
        pass: usr.result.pass_id,
        allPasses: passes
    }
}

export const actions = {
    default: async ({ cookies, request }) => {
        const usr = await verifyAndGetUser(cookies.get('authToken'), null, null);
        if (usr.result == null) {
            return fail(400, { msg: "Youre not logged in" })
        }

        const form = await request.formData();
        const user = form.get('user');
        const phone = form.get('bil_ph');
        const pass = form.get('pass')

        if (user == null) { return fail(400, { msg: "User field is empty" }) }
        if (phone == null) { return fail(400, { msg: "Phone number is empty" }) }
        if (pass == null) { return fail(400, { msg: "Pass field is empty" }) }

        const u1 = await getUserInfo(user as string);

        if (u1 == null) { return fail(400, { msg: "User doesnt exist!" }) }

        const email = usr.result?.email_address as string;
        const time = new Date().toISOString();
        const solved = false;

        const ticket: ProblemTicketNEW = {
            name: usr.result.first_name + usr.result.last_name,
            phone_number: phone as string,
            college_name: "MIT",
            problem: '',
            description: `TYPE=NON_MAHE;\nPASS=${pass}; \nBILL_PHONE=${phone}; \nUSR=${user};`,
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