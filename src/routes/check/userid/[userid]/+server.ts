import type { Result } from "$lib/server/Backend";
import { getPass } from "$lib/server/BackendAgentPass";
import { getUserInfo } from "$lib/server/BackendAgentUser";
import type { SolsticePassInfo, SolsticeUser } from "$lib/server/BackendTypes";
import { validateToken } from "$lib/server/CheckerUser";
import { fail, json, type RequestEvent } from "@sveltejs/kit";

interface UserInfoRequest {
    user: SolsticeUser,
    pass: SolsticePassInfo | null
}

export async function GET({ request, params }: RequestEvent) {
    try {
        const header = request.headers.get('Authorization');
        const token = header?.split(' ')[1];

        if (token == undefined || token == null) {
            return json({ error: 'Unauthorized' }, { status: 401 });
        }

        const valid = await validateToken(token);
        if (!valid) { return json({ error: 'Invalid token' }, { status: 403 }); }

        const userID = params.userid;

        if (userID == null || userID == undefined || userID == '') {
            return json({ error: `user feild null` }, { status: 400 })
        }

        const userInfo = await getUserInfo(userID);
        if (userInfo == null) {
            return json({ error: `user not found` }, { status: 404 })
        }

        const pass = await getPass(userInfo.pass_id);

        return json({ pass: pass, user: userInfo } as UserInfoRequest,{status:200})


    } catch (ex) {
        return json({ error: `${JSON.stringify(ex)}` }, { status: 500 });
    }
}