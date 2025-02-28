import { verifyAndGetUser, type Result } from "./Backend";
import { getEventInfo } from "./BackendAgentEvent";
import { getUserId } from "./BackendAgentUser";

const admins: string[] = ['aryan.d.dalal@gmail.com'];
const IT_OCs: string[] = ['blucraft2104@gmail.com'];
const OC_team: string[] = [];
const HR_team: string[] = [];

export async function checkAdminAccess(jwt: string | null | undefined): Promise<boolean> {
    const user = await verifyAndGetUser(jwt);
    if (user.success == false) { return false; }
    if (user.result == null) { return false; }
    if (user.result.email_address in admins) { return true; }
    return false;
}
export async function check_manage_Access(jwt: string | null | undefined) {
    const user = await verifyAndGetUser(jwt);
    if (user.success == false) { return false; }
    if (user.result == null) { return false; }
    if (admins.includes(user.result?.email_address)) { return true; }
    if (OC_team.includes(user.result?.email_address)) { return true; }
    if (IT_OCs.includes(user.result?.email_address)) { return true; }
    if (HR_team.includes(user.result?.email_address)) { return true; }
    return false;
}
export async function check_OC_Access(jwt: string | null | undefined): Promise<boolean> {
    const user = await verifyAndGetUser(jwt);
    if (user.success == false) { return false; }
    if (user.result == null) { return false; }
    if (admins.includes(user.result?.email_address)) { return true; }
    if (OC_team.includes(user.result?.email_address)) { return true; }
    return false;
}

export async function check_ITOC_Access(jwt: string | null | undefined): Promise<boolean> {
    const user = await verifyAndGetUser(jwt);
    if (user.success == false) { return false; }
    if (user.result == null) { return false; }
    if (admins.includes(user.result?.email_address)) { return true; }
    if (IT_OCs.includes(user.result?.email_address)) { return true; }
    return false;
}

export async function check_HR_Access(jwt: string | null | undefined): Promise<boolean> {
    const user = await verifyAndGetUser(jwt);
    if (user.success == false) { return false; }
    if (user.result == null) { return false; }
    if (admins.includes(user.result?.email_address)) { return true; }
    if (IT_OCs.includes(user.result?.email_address)) { return true; }
    if (HR_team.includes(user.result?.email_address)) { return true; }
    return false;
}

export async function check_EventRW_Access(jwt: string | null | undefined, eventID: string): Promise<boolean> {
    const user = await verifyAndGetUser(jwt);
    if (user.success == false) { return false; }
    if (user.result == null) { return false; }
    if (admins.includes(user.result?.email_address)) { return true; }
    const org = await getUserId(user.result.email_address);
    const event = await getEventInfo(eventID);

    if (org == null) { return false; }
    if (event == null) { return false; }
    if (event.organizer_id == null) { return false; }

    return event.organizer_id == org;
}
export async function check_EventRead_Access(jwt: string | null | undefined, eventID: string): Promise<boolean> {
    const user = await verifyAndGetUser(jwt);
    if (user.success == false) { return false; }
    if (user.result == null) { return false; }
    if (admins.includes(user.result?.email_address)) { return true; }
    if (IT_OCs.includes(user.result?.email_address)) { return true; }
    const org = await getUserId(user.result.email_address);
    const event = await getEventInfo(eventID);

    if (org == null) { return false; }
    if (event == null) { return false; }
    if (event.organizer_id == null) { return false; }

    return event.organizer_id == org;
}

