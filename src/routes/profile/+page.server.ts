import { registerUser } from '$lib/components/backend/BackendAgentUser.js';
import { getUserObjectFromJWT } from '$lib/components/GAuth.js';
import { json, redirect } from '@sveltejs/kit';

export function load({cookies}){
    return {authToken : cookies.get('authToken')};
}

export const actions = {
    register: async ({request,cookies}) => {
        const jwt = cookies.get('authToken');
        if(jwt == null){
            redirect(302,'/profile');
        }
        const user = getUserObjectFromJWT(jwt);
        const form = await request.formData();
        const fname = form.get('first_name') as string;
        const lname = form.get('last_name') as string;
        const phone = form.get('phone_num') as string;
        const reg = parseInt(form.get('mahe_num') as string);

        const soluser = registerUser({
            email_address:user.email,
            first_name:fname,
            last_name:lname,
            mahe_registration_number:reg,
            phone_number:phone,
            id:"",
            pass_id:''
        });

        
    }
}