import { authenticateCreds, logIn, type CheckerUserLogin } from "$lib/server/CheckerUser.js";
import { json } from "@sveltejs/kit";



export async function POST({ request }) {
    try {
        const body = await request.json() as CheckerUserLogin;
        const log = await logIn(body);

        if (log.success == false) {
            return json({ error: log.error }, { status: 403 })
        } else {
            return json({ token: log.result }, { status: 200 })
        }
    }
    catch (err) {
        return json({ error: err }, { status: 500 })
    }
}