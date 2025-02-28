import { fail, redirect } from '@sveltejs/kit';
import type { CategoryType } from '$lib/components/database.ts';
import { v4 as uuidv4 } from 'uuid';
import { getUserObjectFromJWT, verifyGJWT } from '$lib/components/GAuth.ts';
import { addTicketToDB, type ProblemTicket } from '$lib/components/database.ts';
import { verifyAndGetUser } from '$lib/backend/Backend';

export function load({ cookies }) {
    let sessionId = cookies.get('sessionId');

    if (!sessionId) {
        //redirect(300,'\signin');
        return { isLoggedIn: false };
    }
}

export const actions = {
    postTicket: async ({ cookies, request }) => {
        try {
            const formData = (await request.formData());
            const token = cookies.get('authToken');
            const user = await verifyAndGetUser(token);
            if (user.success == false) {
                redirect(302, '/profile');
            }
            const name = `${user.result?.first_name} ${user.result?.last_name}`;
            const phone = user.result?.phone_number;
            const college = formData.get('college');
            const problem = formData.get('problem');
            const desc = formData.get('description');
            const cat = formData.get('category') as CategoryType;

            if (name == null) {
                return fail(400, { success: false, error: 'name is null!' })
            }
            if (phone == null) {
                return fail(400, { success: false, error: 'phone is null!' })
            }
            if (college == null) {
                return fail(400, { success: false, error: 'name is null!' })
            }
            if (desc == null) {
                return fail(400, { success: false, error: 'description is null!' })
            }
            if (cat == null) {
                return fail(400, { success: false, error: 'category is null!' })
            }

            const ticketID = uuidv4();
            const email = user.result?.email_address as string;
            const time = new Date().toISOString();
            const solved = false;

            const ticket: ProblemTicket = {
                name: name as string,
                phone: phone as string,
                college: college as string,
                problem: problem as string,
                description: desc as string,
                category: cat,
                ticketID: ticketID,
                email: email,
                timestamp: time,
                solved: solved,
                solved_by_email: null
            };
            addTicketToDB(ticket);
            console.log(ticket);
            return {success:true}
        } catch (err) {
            return {success:false,error:JSON.stringify(err)}
        }

    }
}

//   FormData {
//    [Symbol(state)]: [
//        { name: 'name', value: 'Aryan Dalal' },
//        { name: 'phone', value: '9876543210' },
//        { name: 'college', value: 'mit blr' },
//        { name: 'category', value: '1' },
//        { name: 'description', value: 'i' }
//      ]
//    }