import { verifyAndGetUser, type Result } from "./Backend";
import { getUserId, type SolsticeUser } from "./BackendAgentUser";

const admins:string[] = ['aryan.d.dalal@gmail.com','srivastavak1223@gmail.com'];
const IT_OCs:string[] = [];
const OC_team:string[] = []
type EventHeadsMap = { [key: string]: string[] };
const eventHeads: EventHeadsMap  = {};

export async function checkAdminAccess(jwt: string | null | undefined): Promise<boolean> {
    const user = await verifyAndGetUser(jwt);
    if (user.success == false) { return false; }
    if (user.result == null) { return false; }
    for (let index = 0; index < admins.length; index++) {
        const element = admins[index];
        if(element == user.result.email_address){return true;}
    }
    return false;
}

export async function check_OC_Access(jwt: string | null | undefined): Promise<boolean> {
    const user = await verifyAndGetUser(jwt);
    if (user.success == false) { return false; }
    if (user.result == null) { return false; }
    for (let index = 0; index < admins.length; index++) {
        const element = admins[index];
        if(element == user.result.email_address){return true;}
    }
    for (let index = 0; index < OC_team.length; index++) {
        const element = OC_team[index];
        if(element == user.result.email_address){return true;}
    }
    return false;
}

export async function check_ITOC_Access(jwt: string | null | undefined): Promise<boolean> {
    const user = await verifyAndGetUser(jwt);
    if (user.success == false) { return false; }
    if (user.result == null) { return false; }
    for (let index = 0; index < admins.length; index++) {
        const element = admins[index];
        if(element == user.result.email_address){return true;}
    }
    for (let index = 0; index < OC_team.length; index++) {
        const element = IT_OCs[index];
        if(element == user.result.email_address){return true;}
    }
    return false;
}

export async function check_EventRW_Access(jwt: string | null | undefined,eventID:string): Promise<boolean> {
    const user = await verifyAndGetUser(jwt);
    if (user.success == false) { return false; }
    if (user.result == null) { return false; }
    for (let index = 0; index < admins.length; index++) {
        const element = admins[index];
        if(element == user.result.email_address){return true;}
    }
    const org = await getUserId(user.result.email_address);
    return false;
}
