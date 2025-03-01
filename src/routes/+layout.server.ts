import { check_manage_Access } from '$lib/server/BackendAdmin.ts';
import { error } from '@sveltejs/kit';

export async function load({ cookies }) {
    try {
        const jwt = cookies.get('authToken');
        const manageAccess = await check_manage_Access(jwt);
        return { authToken: jwt, manageAccess: manageAccess };
    } catch (err) {
        error(500,"Could not read user cookies")
    }
}
