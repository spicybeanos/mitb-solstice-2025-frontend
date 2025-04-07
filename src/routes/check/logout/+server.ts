import { logout } from '$lib/server/CheckerUser'
import { json } from '@sveltejs/kit'

export async function POST({ request }) {
    try {
        return json({ error: 'Service stopped' }, { status: 503 });
        const header = request.headers.get('Authorization');
        const token = header?.split(' ')[1]; 

        if(token == undefined || token == null){
            return json({ error: 'Unauthorized' }, { status: 401 });
        }

        await logout(token);
        return json({},{status:200})
    }
    catch (err) {
        return json({ error: err }, { status: 500 })
    }
}