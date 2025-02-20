import { checkOCAccess } from '$lib/components/backend/BackendAdmin.js';
import { redirect } from '@sveltejs/kit';

export async function load({ cookies }) {
    const jwt = cookies.get('authToken');
    const canAccess = await checkOCAccess(jwt);
    if (canAccess == false) { redirect(308, '/profile'); }
}