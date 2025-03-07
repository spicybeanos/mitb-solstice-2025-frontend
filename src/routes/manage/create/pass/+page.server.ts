import { patch, post } from "$lib/server/Backend.js";
import { checkAdminAccess } from "$lib/server/BackendAdmin.js";
import { getAllPasses } from "$lib/server/BackendAgentPass.js";
import { fail } from "@sveltejs/kit"


export const actions = {
    createPass: async ({ cookies, request }) => {
        try {
            const access = await checkAdminAccess(cookies.get('authToken'));
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
                res = await patch(`pass/${ep?.id}`,body);
            }else{
                res = await post('pass/',body);
            }
            if(res.success == true){
                return {msg:`successfully ${edit ? 'edited' : 'created'} pass!`}
            }else{
                return fail(400,{msg:`Could not create pass : ${res.error}`})
            }
        }
        catch (e) {
            return fail(503, { msg: `${e}` });
        }
    }
}