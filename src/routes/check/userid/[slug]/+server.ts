import { verifyGJWT } from "$lib/server/GAuth";
import { json, type RequestEvent } from "@sveltejs/kit";


export async function GET({ request, params }: RequestEvent) {
    try {
        const header = request.headers.get('Authorization');
        const token = header?.split(' ')[1]; 

        if(token == undefined || token == null){
            return json({ error: 'Unauthorized' }, { status: 401 });
        }

        const usr =await verifyGJWT(token);
        const email = usr.object?.email;
        const userID = params.slug;

        

    } catch (ex) {

    }
}