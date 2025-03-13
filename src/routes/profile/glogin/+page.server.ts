import { getUserId, getUserInfo } from "$lib/server/BackendAgentUser.js";
import { getUserObjectFromJWT, verifyGJWT, type VerificationResult } from "$lib/server/GAuth";
import { fail, json } from "@sveltejs/kit";

export async function load({ cookies }) {
    const token = cookies.get('authToken');
    if (!token) {
        return { msg: `You're not logged in!`, user: null };
    }

    const user = getUserObjectFromJWT(token);
    const id = await getUserId(user.email);
    if (id == null) {
        return { user: user, sol: null }
    } else {
        const info = await getUserInfo(id);
        return { user: user, sol: info };
    }

}

export const actions = {
    default: async ({ request, cookies }) => {
        try {
            const form = await request.formData();
            const token = form.get('credential') as string | null;

            if (!token) {
                return json({ message: 'Token is required' }, { status: 400 });
            }

            const res = (await verifyGJWT(token)) as VerificationResult;
            if (res.result === true) {
                cookies.set('authToken', token,
                    {
                        path: '/',
                        httpOnly: true,  // Prevent access via JavaScript
                        secure: true,    // Only send over HTTPS
                        sameSite: 'strict', // Protect against CSRF
                        maxAge: 24 * 3600 * 1000, // 24 hour
                    }
                );

                return res.object
            } else {
                return fail(400, { message: 'Token is invalid' });
            }
        }
        catch (ex) {
            return fail(503, { message: `Failed to log in : ${ex}` });
        }
    }
}