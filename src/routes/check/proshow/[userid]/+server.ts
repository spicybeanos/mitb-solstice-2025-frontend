import { getProshowBand } from '$lib/server/BandDistribution';
import { validateToken } from '$lib/server/CheckerUser';
import { fail, json, text } from '@sveltejs/kit';


export async function GET({ request, params }) {
    try {
        const header = request.headers.get('Authorization');
        const token = header?.split(' ')[1];

        if (token == undefined || token == null) {
            return json({ error: 'Unauthorized' }, { status: 401 });
        }

        const valid = await validateToken(token);
        if (!valid) { return json({ error: 'Invalid token' }, { status: 403 }); }

        const get = await getProshowBand(params.userid);

        if (get.success == false) { return json({ error: get.error }, { status: 400 }) }
        if (get.result == null) { return json({ error: "Not found" }, { status: 404 }) }

        return json({ entry: get.result }, { status: 200 });

    } catch (ex) {
        return json({ error: JSON.stringify(ex) }, { status: 500 });
    }
}

export async function POST({ request, params }) {
    try {
        const header = request.headers.get('Authorization');
        const token = header?.split(' ')[1];

        if (token == undefined || token == null) {
            return json({ error: 'Unauthorized' }, { status: 401 });
        }

        const valid = await validateToken(token);
        if (!valid) { return json({ error: 'Invalid token' }, { status: 403 }); }

        const get = await getProshowBand(params.userid);
        
    } catch (exc) {
        
    }
}