import { checkAdminAccess } from '$lib/server/BackendAdmin';
import { getEvents } from '$lib/server/BackendAgentEvent';
import type { SolsticeEventInfo } from '$lib/server/BackendTypes.ts';
import { error, fail, redirect } from '@sveltejs/kit';

export async function load({ cookies }) {
    const isAdmin = await checkAdminAccess(cookies.get('authToken'));
    if (isAdmin == false) { redirect(308, '/'); }
    let events:SolsticeEventInfo[] = await getEvents() ?? [];
    
}