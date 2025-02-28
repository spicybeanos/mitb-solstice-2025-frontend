import { get } from "./Backend.ts";
import type { SolsticeEventInfo, SolsticePassInfo } from "./BackendTypes.ts";

const DEFAULT_PASS_NAME = "default-pass";

export async function getAllPasses(): Promise<SolsticePassInfo[] | null> {
    const res = await get("pass");

    if (res.success) {
        return (await res.result) as SolsticePassInfo[];
    }
    return null;
}

export async function getPassInfo(passID: string): Promise<SolsticePassInfo | null> {
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
    if (!passID) return false;
    const events = await getEventsAccessibleByPass(passID);
    if (!events) return false;

    return events.some(event => event.id === eventID);
}

export async function getDefaultPass(): Promise<string | null> {
    const passes = await getAllPasses();
    if (!passes) return null;

    for (const pass of passes) {
        if (pass.name === DEFAULT_PASS_NAME) return pass.id;
    }
    return null;
}

export async function getAllEventsInPass(passId: string) {
    return await getEventsAccessibleByPass(passId);
}
