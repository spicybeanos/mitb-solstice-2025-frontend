import { check_manage_Access } from '$lib/server/BackendAdmin'
import { getPassInfo } from '$lib/server/BackendAgentPass';
import { getUserId, getUserInfo } from '$lib/server/BackendAgentUser.js';
import { error, fail, redirect } from '@sveltejs/kit';

export const actions = {
    verifyPassEmail: async ({ cookies, request, url }) => {
        try {
            const isOC = await check_manage_Access(cookies.get('authToken'));
            if (isOC == false) { return fail(403, { error: 'Unauthorized user!' }); }

            const form = await request.formData();
            const email = form.get('email');
            //url.searchParams.get('email');

            if (email == null || email == undefined) { return fail(400, { error: 'Email not provided!' }); }

            const userID = await getUserId(email as string);
            if (userID == null) { return fail(400, { error: 'User does not exist!' }); }

            const userInfo = await getUserInfo(userID);
            if (userInfo == null) { return fail(400, { error: 'User info fetch failed!' }); }

            if (userInfo.pass_id == null) {
                return {
                    ownsPass: false
                };
            }
            const passInfo = await getPassInfo(userInfo.pass_id);
            if (passInfo == null) { return fail(400, { error: 'Pass for this user is invalid!' }); }

            return {
                ownsPass: true,
                pass: passInfo
            }
        } catch (err) {
            return fail(500, { error: 'failed to perform verification of pass' });
        }

    }
}