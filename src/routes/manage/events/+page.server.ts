import { check_EventRW_Access, check_OC_Access } from "$lib/components/backend/BackendAdmin";
import { redirect } from "@sveltejs/kit";

export async function load({ cookies }) {
    const jwt = cookies.get('authToken');
    const canAccess = await check_OC_Access(jwt);
    if (canAccess == false) { redirect(308, '/profile'); }
}