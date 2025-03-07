import { fail, redirect } from '@sveltejs/kit';
import type { CategoryType, ProblemTicket } from '$lib/server/BackendTypes.ts';
import { v4 as uuidv4 } from 'uuid';
import { getUserObjectFromJWT, verifyGJWT } from '$lib/server/GAuth';
import { verifyAndGetUser } from '$lib/server/Backend';
import { createTicket } from '$lib/server/BackendAgentSupport.js';
import { generateChecksum } from '$lib/server/CacheMaster';

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
            const userJson = cookies.get('userInfo');
            const checksum = cookies.get('userChecksum');
            const user = await verifyAndGetUser(token, userJson, checksum);
            if (userJson == null || checksum == null) {
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
                problem: problem == null ? '' : problem as string,
                description: desc as string,
                category: cat,
                ticketID: ticketID,
                email: email,
                timestamp: time,
                solved: solved,
                solved_by_email: null,
                comment: ''
            };
            createTicket(ticket);
            console.log(ticket);
            return { success: true }
        } catch (err) {
            return { success: false, error: JSON.stringify(err) }
        }

    }
}
