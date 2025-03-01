import { getUserId } from '$lib/server/BackendAgentUser';
import { json } from '@sveltejs/kit';


export async function GET({ url }: { url: URL }) {
    try {
        const email_ = url.searchParams.get('email');
        if(email_ == null){
            return json({ userid: null }, { status: 400 });
        }
        const userId = await getUserId(email_);

        if (userId == null) return json({ message: "not registered" }, { status: 404 });

        return json({ userid: userId }, { status: 200 });
    } catch (err) {
        return json({userid:null},{status:500});
    }

}