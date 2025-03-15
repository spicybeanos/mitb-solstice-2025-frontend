import { BACKEND_URL, BEARER_TOKEN } from "$env/static/private";
import { get } from "./Backend.ts";
import type { SolsticeEventInfo, SolsticePassInfo } from "./BackendTypes.ts";

const DEFAULT_PASS_NAME = "default-pass";

export async function getAllPasses(): Promise<SolsticePassInfo[] | null> {
    const res = await get("pass/");
    if (res.success) {
        return (await res.result) as SolsticePassInfo[];
    }
    return null;
}

export async function getPassInfo(passID: string|null): Promise<SolsticePassInfo | null> {
    if(passID == null){
        return null;
    }

    const res = await get(`pass/${passID}`);

    if (res.success) {
        return (await res.result) as SolsticePassInfo;
    }
    return null;
}

export async function getPass(passId: string): Promise<SolsticePassInfo | null> {
    return await getPassInfo(passId);
}

export async function getEventsAccessibleByPass(passID: string): Promise<SolsticeEventInfo[] | null> {
    const res = await get(`pass/${passID}/events`);

    if (res.success) {
        return (await res.result) as SolsticeEventInfo[];
    }
    return null;
}

export async function checkEventAccessibleByPass(eventID: string, passID: string | null): Promise<boolean> {
    const res = await get(`event/${eventID}/passes`);
    if (res.success == false) { return false; }
    const passes = res.result as SolsticePassInfo[];
    if (passes.length == 0) { return true; }
    for (const pass of passes) {
        if (passID == pass.id) { return true; }
    }
    return false;
}

export async function getAllEventsInPass(passId: string) {
    return await getEventsAccessibleByPass(passId);
}
