import { redirect } from '@sveltejs/kit';
import { Categories } from '$lib/components/Support.js';
import { v4 as uuidv4 } from 'uuid';
import { getUserObjectFromJWT ,verifyGJWT} from '$lib/components/GAuth.js';
import { addTicketToDB } from '$lib/components/database.js';
import { verifyAndGetUser } from '$lib/components/backend/Backend.js';

export interface ProblemTicket {
    name: string;
    description: string;
    college: string;
    problem: string;
    category: string;
    phone: string;
    ticketID:string;
    email:string;
    timestamp:string;
    solved:boolean;
}

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
        if(user.success == false){
            redirect(302,'/profile');
            return;
        }
        const ticket: ProblemTicket = {
            name: formData.get('name') as string,
            phone: formData.get('phone') as string,
            college: formData.get('college') as string,
            problem: formData.get('problem') as string,
            description: formData.get('description') as string,
            category: Categories[formData.get('category') as keyof typeof Categories] as string,
            ticketID:uuidv4(),
            email: user.result?.email_address as string,
            timestamp:new Date().toISOString(),
            solved:false
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