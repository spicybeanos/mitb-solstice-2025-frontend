import { patch, post, verifyAndGetUser } from "$lib/server/Backend.js";
import { check_PassRW_Access, checkAdminAccess } from "$lib/server/BackendAdmin.js";
import { getAllPasses, getPassInfo } from "$lib/server/BackendAgentPass.js";
import { generateChecksum } from "$lib/server/CacheMaster";
import { fail } from "@sveltejs/kit"

export async function load({ cookies, params }) {
    try {
        const userJson = cookies.get('userInfo');
        const checksum = cookies.get('userChecksum');
        const access = await check_PassRW_Access(cookies.get('authToken'), userJson, checksum);
        if (userJson == null || checksum == null) {
            const user = await verifyAndGetUser(cookies.get('authToken'), userJson, checksum);
            if (user.result != null) {
                cookies.set('userInfo', JSON.stringify(user.result), {
                    httpOnly: false, // Accessible by frontend
                    secure: true,
                    sameSite: "strict",
                    path: "/",
                    maxAge: 3600
                });
                cookies.set('userChecksum', generateChecksum(user.result), {
                    httpOnly: false, // Accessible by frontend
                    secure: true,
                    sameSite: "strict",
                    path: "/",
                    maxAge: 3600
                });
            }
        }
        if (access == false) {
            return fail(403, { msg: 'You shall not pass!' });
        }
        const pass = await getPassInfo(params.slug);
        if (pass == null) {
            return fail(404, { msg: 'That pass does not exist!' });
        }

        return { pass: pass }
    } catch (ex) {

    }
}

export const actions = {
    updatePass: async ({ cookies, request, params }) => {
        try {
            const userJson = cookies.get('userInfo');
            const checksum = cookies.get('userChecksum');
            const access = await check_PassRW_Access(cookies.get('authToken'), userJson, checksum);
            if (userJson == null || checksum == null) {
                const user = await verifyAndGetUser(cookies.get('authToken'), userJson, checksum);
                if (user.result != null) {
                    cookies.set('userInfo', JSON.stringify(user.result), {
                        httpOnly: false, // Accessible by frontend
                        secure: true,
                        sameSite: "strict",
                        path: "/",
                        maxAge: 3600
                    });
                    cookies.set('userChecksum', generateChecksum(user.result), {
                        httpOnly: false, // Accessible by frontend
                        secure: true,
                        sameSite: "strict",
                        path: "/",
                        maxAge: 3600
                    });
                }
            }
            if (access == false) {
                return fail(403, { msg: 'You shall not pass!' });
            }

            const form = await request.formData();
            if (form == null) { return fail(400, { msg: 'no form' }) }

            const name = form.get('name') as string | null;
            const desc = form.get('desc') as string | null;
            const p_rice = form.get('price') as string | null;
            let cost = 0;

            if (name == null) { return fail(400, { msg: 'name is null!' }) }
            if (desc == null) { return fail(400, { msg: 'description is null!' }) }
            if (p_rice == null) { return fail(400, { msg: 'price is null!' }) }

            try {
                cost = parseFloat(p_rice)
            } catch {
                return fail(400, { msg: 'price value is not a number!' })
            }

            const body = {
                name: name,
                description: desc,
                cost: cost
            };

            let res = await patch(`pass/${params.slug}`, body);

            if (res.success == true) {
                return { msg: `successfully edited pass!` }
            } else {
                return fail(400, { msg: `Could not create pass : ${res.error}` })
            }
        }
        catch (e) {
            return fail(503, { msg: `${e}` });
        }
    }
}