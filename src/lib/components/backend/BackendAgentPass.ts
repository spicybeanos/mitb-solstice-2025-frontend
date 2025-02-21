import { BEARER_TOKEN } from "$env/static/private";
import { backendURL } from "./Backend";
import type { SolsticeEventInfo } from "./BackendAgentEvent";

export interface SolsticePassInfo {
    name: string;
    description: string | null;
    cost: string;
    id: string;
}

const DEFAULT_PASS_NAME = 'default-pass';

export async function getAllPasses() {
    const res = await fetch(`${backendURL}/pass`, {
        method: 'GET',
        headers:{
            "Authorization": `Bearer ${BEARER_TOKEN}`
        }
    });

    if (res.status === 200) {
        return (await res.json()) as SolsticePassInfo[];
    }
    return null;
}
export async function getPassInfo(passID:string) {
    const res = await fetch(`${backendURL}/pass/${passID}`, {
        method: 'GET',
        headers:{
            "Authorization": `Bearer ${BEARER_TOKEN}`
        }
    });

    if (res.status === 200) {
        return (await res.json()) as SolsticePassInfo;
    }
    return null;
}
export async function getPass(passId: string) {
    const res = await fetch(`${backendURL}/pass/${passId}`, {
        method: 'GET',
        headers:{
            "Authorization": `Bearer ${BEARER_TOKEN}`
        }
    });

    if (res.status === 200) {
        return (await res.json()) as SolsticePassInfo;
    }
    return null;
}
export async function getEventsAccessableByPass(passID: string): Promise<SolsticeEventInfo[] | null> {
    const res = await fetch(`${backendURL}/pass/${passID}/events`, {
        method: 'GET',
        headers:{
            "Authorization": `Bearer ${BEARER_TOKEN}`
        }
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
    let flag = false;
    for (let index = 0; index < events.length; index++) {
        if(events[index].id == eventID) return true;    
    }

    return flag;
}
export async function getDefaultPass() : Promise<string|null> {
    const passes = await getAllPasses();

    if (passes == null) { return null; }
    passes.forEach(pas => {
        if (pas.name == DEFAULT_PASS_NAME){return pas.id;}
    });
    return null;

}
export async function getAllEventsInPass(passId:string) {
    return await getEventsAccessableByPass(passId);
}