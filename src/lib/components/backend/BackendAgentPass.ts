import { backendURL } from "./Backend";
import type { SolsticeEventInfo } from "./BackendAgentEvent";

interface SolsticePassInfo{
    name: string;
    description: string | null;
    cost: string;
    id: string;
}

export async function getPasses(passId: string) {
    const res = await fetch(`${backendURL}/pass/${passId}`, {
        method: 'GET'
    });

    if (res.status === 200) {
        return (await res.json()) as SolsticePassInfo[];
    }
    return null;
}
export async function getEventsAccessableByPass(passID:string) : Promise<SolsticeEventInfo[] | null> {
    const res = await fetch(`${backendURL}/pass/${passID}/events`, {
        method: 'GET'
    });

    if(res.status == 200){
        return (await res.json()) as SolsticeEventInfo[];
    }

    return null;
}
export async function checkEventAccesableByPass(eventID:string,passID:string) : Promise<boolean> {
    const events = await getEventsAccessableByPass(passID);
    if(events == null) { return false;}
    events.forEach(ev => {
        if(ev.id == eventID) { return true;}
    });

    return false;
}