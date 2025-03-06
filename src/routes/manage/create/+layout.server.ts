import { checkAdminAccess } from '$lib/server/BackendAdmin';
import { redirect } from '@sveltejs/kit';

export async function load({ cookies }) {
    const access = await checkAdminAccess(cookies.get('authToken'));
    if (access == false) { redirect(308, '/'); }
}