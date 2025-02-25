import { check_manage_Access } from '$lib/components/backend/BackendAdmin.js';

export async function load({cookies}){
    const jwt = cookies.get('authToken');
    const manageAccess = await check_manage_Access(jwt);
    return {authToken : jwt,manageAccess:manageAccess};
}
