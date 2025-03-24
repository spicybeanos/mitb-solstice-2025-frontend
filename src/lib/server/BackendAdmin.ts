import { verifyAndGetUser, type Result } from "./Backend";
import { getEventInfo } from "./BackendAgentEvent";
import { getUserId } from "./BackendAgentUser";

const admins: string[] = ['aryan.d.dalal@gmail.com','krishnasaraf1321@gmail.com'];
const IT_OCs: string[] = ['blucraft2104@gmail.com'];
const OPS_CC_team: string[] = ['atharvamaik200@gmail.com','sarveshbagla07@gmail.com', 'tyagi.aryan3434@gmail.com','aarushie1204@gmail.com','annanykapoor1304@gmail.com','shashwatshukla120@gmail.com','bagadiaakshat11@gmail.com','anushkamishra0102@gmail.com','sambhav02082004@gmail.com','harshitashahi26@gmail.com'];
const HR_team: string[] = ['atharvamaik200@gmail.com', 'rohitnandagopal010305@gmail.com', 'suryanshabhijit1@gmail.com', 'aishanisharma3@gmail.com', 'snishtha.381@gmail.com', 'ayushi.khubber@gmail.com', 'kshitij.betwal@gmail.com'];
const Finance_Team: string[] = ['shashwatshukla120@gmail.com','aarushie1204@gmail.com','annanykapoor1304@gmail.com'];


export async function checkAdminAccess(jwt: string | null | undefined, userInfoCookieJson: string | null | undefined, userChecksum: string | null | undefined): Promise<boolean> {
    const user = await verifyAndGetUser(jwt, userInfoCookieJson, userChecksum);
    if (user.success == false) { return false; }
    if (user.result == null) { return false; }
    for (const e of admins) {
        if (user.result.email_address == e) { return true; }
    }
    return false;
}
export async function check_manage_Access(jwt: string | null | undefined, userInfoCookieJson: string | null | undefined, userChecksum: string | null | undefined) {
    const user = await verifyAndGetUser(jwt, userInfoCookieJson, userChecksum);
    if (user.success == false) { return false; }
    if (user.result == null) { return false; }
    if (admins.includes(user.result?.email_address)) { return true; }
    if (OPS_CC_team.includes(user.result?.email_address)) { return true; }
    if (IT_OCs.includes(user.result?.email_address)) { return true; }
    if (HR_team.includes(user.result?.email_address)) { return true; }
    if (Finance_Team.includes(user.result?.email_address)) { return true; }
    return false;
}

export async function check_ITOC_Access(jwt: string | null | undefined, userInfoCookieJson: string | null | undefined, userChecksum: string | null | undefined): Promise<boolean> {
    const user = await verifyAndGetUser(jwt, userInfoCookieJson, userChecksum);
    if (user.success == false) { return false; }
    if (user.result == null) { return false; }
    if (admins.includes(user.result?.email_address)) { return true; }
    if (IT_OCs.includes(user.result?.email_address)) { return true; }
    return false;
}

export async function check_Creator_Access(jwt: string | null | undefined, userInfoCookieJson: string | null | undefined, userChecksum: string | null | undefined): Promise<boolean> {
    const user = await verifyAndGetUser(jwt, userInfoCookieJson, userChecksum);
    if (user.success == false) { return false; }
    if (user.result == null) { return false; }
    if (admins.includes(user.result?.email_address)) { return true; }
    if (OPS_CC_team.includes(user.result?.email_address)) { return true; }
    if (Finance_Team.includes(user.result?.email_address)) { return true; }
    return false;
}

export async function check_HR_Access(jwt: string | null | undefined, userInfoCookieJson: string | null | undefined, userChecksum: string | null | undefined): Promise<boolean> {
    const user = await verifyAndGetUser(jwt, userInfoCookieJson, userChecksum);
    if (user.success == false) { return false; }
    if (user.result == null) { return false; }
    if (admins.includes(user.result?.email_address)) { return true; }
    if (IT_OCs.includes(user.result?.email_address)) { return true; }
    if (HR_team.includes(user.result?.email_address)) { return true; }
    return false;
}

export async function check_PassRW_Access(jwt: string | null | undefined, userInfoCookieJson: string | null | undefined, userChecksum: string | null | undefined): Promise<boolean> {
    const user = await verifyAndGetUser(jwt, userInfoCookieJson, userChecksum);
    if (user.success == false) { return false; }
    if (user.result == null) { return false; }
    if (admins.includes(user.result?.email_address)) { return true; }
    if (Finance_Team.includes(user.result?.email_address)) { return true; }
    return false;
}

export async function check_EventCreation_Access(jwt: string | null | undefined, userInfoCookieJson: string | null | undefined, userChecksum: string | null | undefined): Promise<boolean> {
    const user = await await verifyAndGetUser(jwt, userInfoCookieJson, userChecksum);
    if (user.success == false) { return false; }
    if (user.result == null) { return false; }
    for (const e of admins) {
        if (e == user.result?.email_address) { return true; }
    }
    for (const e of OPS_CC_team) {
        if (e == user.result?.email_address) { return true; }
    }
    for (const e of Finance_Team) {
        if (e == user.result?.email_address) { return true; }
    }

    return false;
}

export async function check_EventRW_Access(jwt: string | null | undefined, userInfoCookieJson: string | null | undefined, userChecksum: string | null | undefined, eventID: string): Promise<boolean> {
    const user = await await verifyAndGetUser(jwt, userInfoCookieJson, userChecksum);
    if (user.success == false) { return false; }
    if (user.result == null) { return false; }
    for (const e of admins) {
        if (e == user.result?.email_address) { return true; }
    }
    for (const e of OPS_CC_team) {
        if (e == user.result?.email_address) { return true; }
    }

    const org = await getUserId(user.result.email_address);
    const event = await getEventInfo(eventID);

    if (org == null) { return false; }
    if (event == null) { return false; }
    if (event.organizer_id == null) { return false; }

    return event.organizer_id == org;
}

export async function check_TicketsRW_Access(jwt: string | null | undefined, userInfoCookieJson: string | null | undefined, userChecksum: string | null | undefined): Promise<boolean> {
    const user = await verifyAndGetUser(jwt, userInfoCookieJson, userChecksum);
    if (user.success == false) { return false; }
    if (user.result == null) { return false; }
    if (admins.includes(user.result?.email_address)) { return true; }
    if (IT_OCs.includes(user.result?.email_address)) { return true; }
    if (HR_team.includes(user.result?.email_address)) { return true; }
    return false;
}

export async function check_EventRead_Access(jwt: string | null | undefined, userInfoCookieJson: string | null | undefined, userChecksum: string | null | undefined, eventID: string): Promise<boolean> {
    const user = await verifyAndGetUser(jwt, userInfoCookieJson, userChecksum);
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

