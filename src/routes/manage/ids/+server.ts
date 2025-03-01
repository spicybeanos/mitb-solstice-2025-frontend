

import { check_manage_Access } from "$lib/server/BackendAdmin";
import { getPassInfo } from "$lib/server/BackendAgentPass";
import { getUserId, getUserInfo } from "$lib/server/BackendAgentUser";
import { error, fail, json, type Cookies } from "@sveltejs/kit";

export async function GET({ url, cookies }: { url: URL, cookies: Cookies }) {
    const isOC = await check_manage_Access(cookies.get('authToken'));
    if (isOC == false) { return json({ error: 'Unauthorized user!' }, { status: 403 }); }

    const email = url.searchParams.get('email');
    if (email == null || email == undefined) { return json({ error: 'Email not provided!' }, { status: 400 }); }

    const userID = await getUserId(email as string);
    if (userID == null) { return json({ error: 'User does not exist!' }, { status: 400 }); }

    const userInfo = await getUserInfo(userID);
    if (userInfo == null) { return json({ error: 'User info fetch failed!' }, { status: 400 }); }

    return json({
        userData: userInfo,
        error: null
    }, { status: 200 })
}