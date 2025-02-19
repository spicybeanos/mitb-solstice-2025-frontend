import { backendURL } from "./Backend";
import type { SolsticeEventInfo } from "./BackendAgentEvent";

interface SolsticePassInfo {
    name: string;
    description: string | null;
    cost: string;
    id: string;
}

const DEFAUL_PASS_NAME = 'default-pass';

export async function getAllPasses() {
    const res = await fetch(`${backendURL}/pass`, {
        method: 'GET'
    });

    if (res.status === 200) {
        return (await res.json()) as SolsticePassInfo[];
    }
    return null;
}

export async function getPassInfo(passId: string) {
    const res = await fetch(`${backendURL}/pass/${passId}`, {
        method: 'GET'
    });

    if (res.status === 200) {
        return (await res.json()) as SolsticePassInfo;
    }
    return null;
}
export async function getEventsAccessableByPass(passID: string): Promise<SolsticeEventInfo[] | null> {
    const res = await fetch(`${backendURL}/pass/${passID}/events`, {
        method: 'GET'
    });

    if (res.status == 200) {
        return (await res.json()) as SolsticeEventInfo[];
    }

    return null;
}
export async function checkEventAccesableByPass(eventID: string, passID: string | null): Promise<boolean> {
    if (passID == null) return false;
    const events = await getEventsAccessableByPass(passID);
    if (events == null) { return false; }
    events.forEach(ev => {
        if (ev.id == eventID) { return true; }
    });

    return false;
}
export async function getDefaultPass() : Promise<string|null> {
    const passes = await getAllPasses();

    if (passes == null) { return null; }
    passes.forEach(pas => {
        if (pas.name == DEFAUL_PASS_NAME){return pas.id;}
    });
    return null;
}