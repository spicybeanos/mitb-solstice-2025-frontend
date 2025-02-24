import { check_OC_Access } from "$lib/components/backend/BackendAdmin";
import { getPassInfo } from "$lib/components/backend/BackendAgentPass";
import { getUserId, getUserInfo } from "$lib/components/backend/BackendAgentUser";
import { error, fail, json, type Cookies } from "@sveltejs/kit";

export async function GET({ url, cookies }: { url: URL, cookies: Cookies }) {
    const isOC = await check_OC_Access(cookies.get('authToken'));
    if (isOC == false) { return json({ error: 'Unauthorized user!' },{status:403}); }

    const email = url.searchParams.get('email');

    if (email == null || email == undefined) { return json({ error: 'Email not provided!' },{status:400}); }

    const userID = await getUserId(email as string);
    if (userID == null) { return json({ error: 'User does not exist!' },{status:400}); }

    const userInfo = await getUserInfo(userID);
    if (userInfo == null) { return json({ error: 'User info fetch failed!' },{status:400}); }

    if (userInfo.pass_id == null) {
        return json({
            ownsPass: false,
            error: null,
            pass: null
        }, { status: 200 });
    }

    const passInfo = await getPassInfo(userInfo.pass_id);
    if (passInfo == null) { return json({ error: 'Pass for this user is invalid!' },{status:400}); }
    return json({
        ownsPass: true,
        pass: passInfo,
        error: null
    }, { status: 200 })
}