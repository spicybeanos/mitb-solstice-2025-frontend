import { check_OC_Access } from '$lib/components/backend/BackendAdmin.js';
import { error, redirect } from '@sveltejs/kit';

export async function load({ cookies }) {
    try {
        const jwt = cookies.get('authToken');
        const canAccess = await check_OC_Access(jwt);
        if (canAccess == false) { error(403, 'You do not have access to management functions') }
    } catch (err) {
        error(403,err as string);
    }
}