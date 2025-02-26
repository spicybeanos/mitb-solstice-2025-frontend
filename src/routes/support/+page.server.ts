import { fail, redirect } from '@sveltejs/kit';
import type { CategoryType } from '$lib/components/database.ts';
import { v4 as uuidv4 } from 'uuid';
import { getUserObjectFromJWT, verifyGJWT } from '$lib/components/GAuth.ts';
import { addTicketToDB, type ProblemTicket } from '$lib/components/database.ts';
import { verifyAndGetUser } from '$lib/components/backend/Backend.ts';

export function load({ cookies }) {
    let sessionId = cookies.get('sessionId');

    if (!sessionId) {
        //redirect(300,'\signin');
        return { isLoggedIn: false };
    }
}

export const actions = {
    postTicket: async ({ cookies, request }) => {
        const formData = (await request.formData());
        const token = cookies.get('authToken');
        const user = await verifyAndGetUser(token);
        if (user.success == false) {
            redirect(302, '/profile');
        }
        const name = formData.get('name');
        const phone = user.result?.phone_number;
        const college = formData.get('college');
        const problem = formData.get('problem');
        const desc = formData.get('description');
        const cat = formData.get('category') as  CategoryType;

        if (name == null || phone == null || college == null || problem == null || desc == null || cat == null) {
            return fail(400, { success: false, error: 'Field(s) are null or undefined!' })
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
            solved_by_email:null
        };
        addTicketToDB(ticket);
        console.log(ticket);
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