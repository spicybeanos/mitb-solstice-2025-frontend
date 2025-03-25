import type { Result } from "$lib/server/Backend";
import { getPass } from "$lib/server/BackendAgentPass";
import { getUserInfo } from "$lib/server/BackendAgentUser";
import type { SolsticePassInfo, SolsticeUser } from "$lib/server/BackendTypes";
import { verifyGJWT } from "$lib/server/GAuth";
import { fail, json, type RequestEvent } from "@sveltejs/kit";

interface UserInfoRequest {
    user: SolsticeUser,
    pass: SolsticePassInfo | null
}

export async function GET({ request, params }: RequestEvent) {
    try {
        const header = request.headers.get('Authorization');
        const token = header?.split(' ')[1]; 

        if(token == undefined || token == null){
            return json({ error: 'Unauthorized' }, { status: 401 });
        }

        const usr = await verifyGJWT(token);
        const email = usr.object?.email;
        const userID = params.userid;

        if (userID == null || userID == undefined) {
            return json({msg:`user feid null`},{status:400})
        }

        const userInfo = await getUserInfo(userID);
        if (userInfo == null) {
            return json({msg:`user not found`},{status:404})
        }

        const pass = await getPass(userInfo.pass_id);

        return json({ pass: pass, user: userInfo } as UserInfoRequest)


    } catch (ex) {

    }
}