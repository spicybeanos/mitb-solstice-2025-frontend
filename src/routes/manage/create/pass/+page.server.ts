import { logAuditChange } from "$lib/server/AuditLogger";
import { patch, post, verifyAndGetUser } from "$lib/server/Backend.js";
import { check_PassRW_Access, checkAdminAccess } from "$lib/server/BackendAdmin.js";
import { getAllPasses } from "$lib/server/BackendAgentPass.js";
import { generateChecksum } from "$lib/server/CacheMaster";
import { getUserObjectFromJWT } from "$lib/server/GAuth";
import { fail } from "@sveltejs/kit"
import type { SolsticePassInfo } from '$lib/server/BackendTypes.ts';

export const actions = {
    createPass: async ({ cookies, request }) => {
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
            const guser = getUserObjectFromJWT(cookies.get('authToken') as string);
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
            let edit = false, ep;
            const passes = await getAllPasses();
            if (passes == null) {
                edit = false;
            } else {
                for (const pa of passes) {
                    if (pa.name == name) {
                        edit = true;
                        ep = pa;
                        break;
                    }
                }
            }
            const body = {
                name: name,
                description: desc,
                cost: cost
            };
            let res;
            if (edit == true) {
                res = await patch<SolsticePassInfo>(`pass/${ep?.id}`, body);
                await logAuditChange({ action: 'UPDATE', table_name: 'pass', user_email: guser.email, new_data: res.result });
            } else {
                res = await post<SolsticePassInfo>('pass/', body);
                await logAuditChange({ action: 'INSERT', table_name: 'pass', user_email: guser.email, new_data: res.result });
            }
            if (res.success == true) {
                return { msg: `successfully ${edit ? 'edited' : 'created'} pass!` }
            } else {
                return fail(400, { msg: `Could not create pass : ${res.error}` })
            }
        }
        catch (e) {
            return fail(503, { msg: `${e}` });
        }
    }
}