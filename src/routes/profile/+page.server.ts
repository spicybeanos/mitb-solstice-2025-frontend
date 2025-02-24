import { verifyAndGetUser } from '$lib/components/backend/Backend.js';
import { getUserId, registerUser, updateUserInfo } from '$lib/components/backend/BackendAgentUser.js';
import { getUserObjectFromJWT } from '$lib/components/GAuth.js';
import { json, redirect } from '@sveltejs/kit';

export async function load({ cookies }) {
    const usr = await verifyAndGetUser(cookies.get('authToken'));
    if (usr.success) {
        return { user: usr.result, authToken: cookies.get('authToken') }
    }
    return { authToken: cookies.get('authToken') };
}

export const actions = {
    register: async ({ request, cookies }) => {
        const jwt = cookies.get('authToken');
        if (jwt == null) {
            redirect(302, '/profile');
        }
        const user = getUserObjectFromJWT(jwt);
        const form = await request.formData();
        const fname = form.get('first_name') as string;
        const lname = form.get('last_name') as string;
        const phone = form.get('phone_num') as string;
        const reg = parseInt(form.get('mahe_num') as string);

        const soluser = registerUser({
            email_address: user.email,
            first_name: fname,
            last_name: lname,
            mahe_registration_number: reg,
            phone_number: phone,
            id: '',
            pass_id: null
        });


    },
    update: async ({ request, cookies }) => {
        const jwt = cookies.get('authToken');
        if (jwt == null) {
            redirect(302, '/profile');
        }
        const user = getUserObjectFromJWT(jwt);
        const form = await request.formData();
        const fname = form.get('f-name') as string;
        const lname = form.get('l-name') as string;
        const phone = form.get('ph-num') as string;
        const reg = parseInt(form.get('mahe_num_update') as string);
        const uid = await getUserId(user.email);
        const userObject = {
            email_address: user.email,
            first_name: fname,
            last_name: lname,
            phone_number: phone,
            mahe_registration_number: reg,
            pass_id: "",
            id: String(uid)
        }
        try {
            const success = await updateUserInfo(userObject.id, userObject);
            if (!success) {
                return { success: false, error: 'Failed to update user information' };
            }
            return { success: true };
        } catch (error) {
            console.error('Error updating user:', error);
            return { success: false, error: 'An error occurred while updating user information' };
        }

    }
}
