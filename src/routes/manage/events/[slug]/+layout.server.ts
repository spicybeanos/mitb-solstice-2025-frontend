import { check_EventRW_Access } from "$lib/components/backend/BackendAdmin";
import { redirect } from "@sveltejs/kit";

export async function load({ cookies,params }) {
    const jwt = cookies.get('authToken');
    const canAccess = await check_EventRW_Access(jwt,params.slug);
    if (canAccess == false) { redirect(308, '/profile'); }
}