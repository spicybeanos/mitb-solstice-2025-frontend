import { getUserId } from '$lib/components/backend/BackendAgentUser.js';
import { json } from '@sveltejs/kit';


export async function GET({ url }: { url: URL }){
    const email_ = url.searchParams.get('email') as string;
    const userId = await getUserId(email_);

    if(userId == null) return json({message:"not registered"}, {status:404});

    return json({userid:userId}, {status:200});
}