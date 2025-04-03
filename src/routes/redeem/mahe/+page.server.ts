import { verifyAndGetUser } from '$lib/server/Backend.js';


export async function load({cookies}) {
    const usr = await verifyAndGetUser(cookies.get('authToken'),null,null);
    if(usr.result == null){
        return {
            is_logged_in:false
        }
    }
    return {
        is_logged_in:true
    }
}