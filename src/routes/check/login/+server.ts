import { json } from "@sveltejs/kit";

export async function POST({request}) {
    try {
        
    } 
    catch (err) {
        return json({exc:err},{status:500})
    }
}