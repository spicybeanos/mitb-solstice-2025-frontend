import { json } from '@sveltejs/kit';


export async function GET({params}) {
    return json({},{status:200})
}