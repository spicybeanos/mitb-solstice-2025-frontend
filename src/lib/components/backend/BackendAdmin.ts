import { verifyAndGetUser, type Result } from "./Backend";
import type { SolsticeUser } from "./BackendAgentUser";

const admins = ['aryan.d.dalal@gmail.com'];
const ocs = ['']

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

export async function checkOCAccess(jwt: string | null | undefined): Promise<boolean> {
    const user = await verifyAndGetUser(jwt);
    if (user.success == false) { return false; }
    if (user.result == null) { return false; }
    for (let index = 0; index < admins.length; index++) {
        const element = admins[index];
        if(element == user.result.email_address){return true;}
    }
    for (let index = 0; index < ocs.length; index++) {
        const element = ocs[index];
        if(element == user.result.email_address){return true;}
    }
    return false;
}