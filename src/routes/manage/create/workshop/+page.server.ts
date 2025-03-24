import { verifyAndGetUser } from "$lib/server/Backend";
import { check_EventCreation_Access } from "$lib/server/BackendAdmin";
import { addWorkshop } from "$lib/server/BackendWorkshop.js";
import { generateChecksum } from "$lib/server/CacheMaster";
import { getUserObjectFromJWT } from "$lib/server/GAuth";
import { fail } from "@sveltejs/kit";
import { v4 as uuid } from 'uuid';



export const actions = {
    createWorkshop: async ({ request, cookies }) => {
        const userJson = cookies.get('userInfo');
        const checksum = cookies.get('userChecksum');
        const access = await check_EventCreation_Access(cookies.get('authToken'), userJson, checksum);
        if (access == false) { return fail(403, { success: false, error: 'Unauthorized!' }) }
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
        const form = await request.formData();
        if (form == null) { return fail(400, { success: false, error: 'no form!' }); }

        const name = form.get('name') as string | null;
        const club = form.get('club') as string | null;
        const desc = form.get('desc') as string | null;
        const venue = form.get('venue') as string | null;
        let image_url = form.get('image_url') as string | null;
        const dfrom = form.get('dfrom') as string | null;
        const dto = form.get('dto') as string | null;

        if (name == undefined || name == null) { return fail(400, { success: false, error: 'name field undefined/null!' }) }
        if (desc == undefined || desc == null) { return fail(400, { success: false, error: 'description field undefined/null!' }) }
        if (club == undefined || club == null) { return fail(400, { success: false, error: 'club field undefined/null!' }) }
        if (venue == undefined || venue == null) { return fail(400, { success: false, error: 'venue field undefined/null!' }) }
        if (dfrom == undefined || dfrom == null) { return fail(400, { success: false, error: 'date from field undefined/null!' }) }
        if (dto == undefined || dto == null) { return fail(400, { success: false, error: 'date to field undefined/null!' }) }

        if (image_url == '') { image_url = null; }

        const res = await addWorkshop({
            club:club,
            date_from:dfrom,
            date_to:dto,
            description:desc,
            id:uuid(),
            name:name,
            venue:venue,
            image_url:image_url
        });

        return res;
    }
}