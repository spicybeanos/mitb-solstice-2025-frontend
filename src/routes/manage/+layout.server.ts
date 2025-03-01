import { check_manage_Access } from '$lib/server/BackendAdmin.js';
import { error, redirect } from '@sveltejs/kit';

export async function load({ cookies }) {
    try {
        const jwt = cookies.get('authToken');
        const canAccess = await check_manage_Access(jwt);
        if (canAccess == false) { error(403, 'You do not have access to management functions') }
    } catch (err) {
        error(403,err as string);
    }
}