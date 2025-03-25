

import { verifyAndGetUser } from "$lib/server/Backend";
import { check_manage_Access } from "$lib/server/BackendAdmin";
import { getPass } from "$lib/server/BackendAgentPass";
import { getUserId, getUserInfo } from "$lib/server/BackendAgentUser";
import { generateChecksum } from "$lib/server/CacheMaster";
import { error, fail, json, type Cookies } from "@sveltejs/kit";

export async function GET({ url, cookies }: { url: URL, cookies: Cookies }) {
    try {
        const userJson = cookies.get('userInfo');
        const checksum = cookies.get('userChecksum');
        const isOC = await check_manage_Access(cookies.get('authToken'), userJson, checksum);
        if (userJson == null || checksum == null) {
            const user = await verifyAndGetUser(cookies.get('authToken'), userJson, checksum);
            if (user.result != null) {
                cookies.set('userInfo', JSON.stringify(user.result), {
                    httpOnly: false, // Accessible by frontend
                    secure: true,
                    sameSite: "strict",
                    path: "/",
                    maxAge:3600
                });
                cookies.set('userChecksum', generateChecksum(user.result), {
                    httpOnly: false, // Accessible by frontend
                    secure: true,
                    sameSite: "strict",
                    path: "/",
                    maxAge:3600
                });
            }
        }
        if (isOC == false) { return json({ error: 'Unauthorized user!' }, { status: 403 }); }

        let userID = null;
        const email = url.searchParams.get('email');
        if (email != null || email != undefined) {
            userID = await getUserId(email as string);
        } else {
            userID = url.searchParams.get('userid');
        }


        if (userID == null) { return json({ error: 'User does not exist!' }, { status: 400 }); }

        const userInfo = await getUserInfo(userID);
        if (userInfo == null) { return json({ error: 'User info fetch failed!' }, { status: 400 }); }
        
        let pass_name = '';
        const pass_details = await getPass(userInfo.pass_id);
        if(pass_details == null) {pass_name = 'No pass owned';}
        else{
            pass_name = pass_details.name;
        }

        return json({
            passName:pass_name,
            userData: userInfo,
            error: null
        }, { status: 200 })
    } catch (er) {
        return json({ error: 'Check failed!' }, { status: 503 });
    }

}