import { json } from "@sveltejs/kit";

export async function POST({ request, cookies }){
    cookies.delete('authToken', 
        {
            path: '/',
            httpOnly: true,  // Prevent access via JavaScript
            secure: true,    // Only send over HTTPS
            sameSite: 'strict', // Protect against CSRF
            maxAge: 0, // 1 hour
        }
    );
    return json({message:"logged out."}, {status:200})
}