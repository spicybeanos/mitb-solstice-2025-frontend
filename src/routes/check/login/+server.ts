import { json } from "@sveltejs/kit";

export async function POST({request}) {
    return json({},{status:200})
}