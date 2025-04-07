import { resetPass, validateToken, type CheckerUserReset } from "$lib/server/CheckerUser.ts";
import { json } from "@sveltejs/kit";



export async function POST({ request }) {
    return json({ error: 'Service stopped' }, { status: 503 });
    try {

        const header = request.headers.get('Authorization');
        const token = header?.split(' ')[1];

        if (token == undefined || token == null) {
            return json({ error: 'Unauthorized' }, { status: 401 });
        }

        const valid = await validateToken(token);
        if (!valid) { return json({ error: 'Invalid token' }, { status: 403 }); }

        const body = await request.json() as CheckerUserReset;
        const reset = await resetPass(body, token);

        if (reset.success == false) {
            return json({ error: reset.error }, { status: 403 })
        } else {
            return json({ username: reset.result }, { status: 200 })
        }
    }
    catch (err) {
        return json({ error: JSON.stringify(err) }, { status: 500 })
    }
}