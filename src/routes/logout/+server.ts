import { json } from "@sveltejs/kit";

export async function POST({ request, cookies }) {
    try {
        cookies.delete('authToken',
            {
                path: '/',
                httpOnly: true,  // Prevent access via JavaScript
                secure: true,    // Only send over HTTPS
                sameSite: 'strict', // Protect against CSRF
                maxAge: 0, // 1 hour
            }
        );
        cookies.delete('userInfo', {
            httpOnly: false, // Accessible by frontend
            secure: true,
            sameSite: "strict",
            path: "/",
            maxAge: 0
        });
        cookies.delete('userChecksum', {
            httpOnly: false, // Accessible by frontend
            secure: true,
            sameSite: "strict",
            path: "/",
            maxAge: 0
        });
        return json({ message: "logged out." }, { status: 200 })
    } catch (err) {
        return json({ message: 'Failed to log out' }, { status: 500 })
    }

}