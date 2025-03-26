import { authenticateCreds, logIn, signUp, type CheckerUserLogin } from "$lib/server/CheckerUser.js";
import { json } from "@sveltejs/kit";
import { APP_ADMIN_KEY } from '$env/static/private'


export async function POST({ request }) {
    try {
        const auth = request.headers.get('Authorization')

        if (!auth?.startsWith("Bearer ")) {
            return json({ error: "Unauthorized" }, { status: 401 });
        }

        const token = auth.split(" ")[1];
        if (token != APP_ADMIN_KEY) { return json({ error: "Unauthorized" }, { status: 403 }) }

        const body = await request.json() as CheckerUserLogin;
        const log = await signUp(body);

        if (log.success == false) {
            return json({ error: 'User already exists' }, { status: 500 })
        } else {
            return json({username:body.user}, { status: 201 })
        }
    }
    catch (err) {
        return json({ exc: err }, { status: 500 })
    }
}