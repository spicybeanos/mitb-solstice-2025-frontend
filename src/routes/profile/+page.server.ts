import { verifyAndGetUser } from '$lib/server/Backend';
import { getUserId, getUserInfo, getUserPassInfo, registerUser, updateUserInfo } from '$lib/server/BackendAgentUser';
import { generateChecksum } from '$lib/server/CacheMaster';
import { getUserObjectFromJWT, verifyGJWT, type VerificationResult } from '$lib/server/GAuth';
import { error, fail, json, redirect } from '@sveltejs/kit';

export async function load({ cookies }) {
    const userJson = cookies.get('userInfo');
    const checksum = cookies.get('userChecksum');
    const usr = await verifyAndGetUser(cookies.get('authToken'), userJson, checksum);
    if (userJson == null || checksum == null) {
        const user = await verifyAndGetUser(cookies.get('authToken'), userJson, checksum);
        if (user.result != null) {
            cookies.set('userInfo', JSON.stringify(user.result), {
                httpOnly: false, // Accessible by frontend
                secure: true,
                sameSite: "strict",
                path: "/"
            });
            cookies.set('userChecksum', generateChecksum(user.result), {
                httpOnly: false, // Accessible by frontend
                secure: true,
                sameSite: "strict",
                path: "/"
            });
        }
    }
    if (usr.success && usr.result != null) {
        // console.log(`User is registered! ${usr.result?.email_address}`);
        const pass = await getUserPassInfo(usr.result?.id);
        return { success: true, user: usr.result, pass: pass }
    }
    return { success: false };
}

export const actions = {
    glogin: async ({ request, cookies }) => {
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
    },
    register: async ({ request, cookies }) => {
        try {
            const jwt = cookies.get('authToken');
            if (jwt == null) {
                redirect(302, '/profile');
            }
            const user = getUserObjectFromJWT(jwt);
            const form = await request.formData();
            const fname = form.get('first_name') as string | null;
            const lname = form.get('last_name') as string | null;
            const phone = form.get('phone_num') as string | null;
            const is_mahe = form.get('is_mahe');
            let reg = null;

            if(fname == null){return { success: false, error: 'First name field empty!' }; }
            if(lname == null){return { success: false, error: 'Last name field empty!' }; }
            if(phone == null){return { success: false, error: 'Phone number field empty!' }; }

            if (phone.length != 10) { return { success: false, error: 'Phone number must be 10 digits only' }; }
            if (is_mahe != null) {
                reg = parseInt(form.get('mahe_num') as string);
            }

            const soluser = await registerUser({
                email_address: user.email,
                first_name: fname,
                last_name: lname,
                mahe_registration_number: is_mahe ? reg : null,
                phone_number: phone,
                id: '',
                pass_id: null
            });
            window.location.reload()
            return { success: true, user: soluser };

        } catch (err) {
            return { success: false, error: 'An error occurred while parsing form' };
        }



    },
    update: async ({ request, cookies }) => {
        try {

            const jwt = cookies.get('authToken');
            if (jwt == null) {
                redirect(302, '/profile');
            }
            const userJson = cookies.get('userInfo');
            const checksum = cookies.get('userChecksum');
            const user = await verifyAndGetUser(jwt, userJson, checksum);
            if (user.success == false) { return fail(403, { error: 'User with this email does not exist!' }) }
            if (userJson == null || checksum == null) {
                const user = await verifyAndGetUser(cookies.get('authToken'), userJson, checksum);
                if (user.result != null) {
                    cookies.set('userInfo', JSON.stringify(user.result), {
                        httpOnly: false, // Accessible by frontend
                        secure: true,
                        sameSite: "strict",
                        path: "/"
                    });
                    cookies.set('userChecksum', generateChecksum(user.result), {
                        httpOnly: false, // Accessible by frontend
                        secure: true,
                        sameSite: "strict",
                        path: "/"
                    });
                }
            }
            const form = await request.formData();
            const phone = form.get('ph-num') as string;
            const uid = user.result?.id
            if (uid == null) { return fail(400, { error: 'User with this email does not exist!' }); }
            const og = await getUserInfo(uid);
            if (og == null) { return fail(400, { error: 'User does not exist in records!' }) }
            const userObject = {
                email_address: user.result?.email_address as string,
                first_name: og.first_name,
                last_name: og.last_name,
                phone_number: phone,
                mahe_registration_number: og.mahe_registration_number,
                pass_id: og.pass_id,
                id: String(uid)
            }
            try {
                const success = await updateUserInfo(userObject.id, userObject);
                if (!success) {
                    return { success: false, error: 'Failed to update user information' };
                }
                cookies.set('userInfo', JSON.stringify(userObject), {
                    httpOnly: false, // Accessible by frontend
                    secure: true,
                    sameSite: "strict",
                    path: "/"
                });
                cookies.set('userChecksum', generateChecksum(userObject), {
                    httpOnly: false, // Accessible by frontend
                    secure: true,
                    sameSite: "strict",
                    path: "/"
                });
                return { success: true };
            } catch (error) {
                console.error('Error updating user:', error);
                return { success: false, error: 'An error occurred while updating user information' };
            }

        } catch (err) {
            return { success: false, error: 'An error occurred while parsing form' };
        }
    }
}
