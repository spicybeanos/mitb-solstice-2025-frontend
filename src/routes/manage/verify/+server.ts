import { checkOCAccess } from "$lib/components/backend/BackendAdmin";
import { getPassInfo } from "$lib/components/backend/BackendAgentPass";
import { getUserId, getUserInfo } from "$lib/components/backend/BackendAgentUser";
import { fail, type Cookies } from "@sveltejs/kit";

export async function GET({ url, cookies }: { url: URL, cookies: Cookies }) {
    const isOC = await checkOCAccess(cookies.get('authToken'));
    if (isOC == false) { return fail(403, { error: 'Unauthorized user!' }); }

    const email = url.searchParams.get('email');

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
}