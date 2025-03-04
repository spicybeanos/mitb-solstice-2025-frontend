import { check_TicketsRW_Access } from "$lib/server/BackendAdmin";
import { error, redirect } from "@sveltejs/kit";

export async function load({ cookies }) {
    try {
        const check = await check_TicketsRW_Access(cookies.get('authToken'));
        if (!check) { error(403, 'You do not have access to support tickets!') }
    }
    catch(err){
        error(403,err as string);
    }
}