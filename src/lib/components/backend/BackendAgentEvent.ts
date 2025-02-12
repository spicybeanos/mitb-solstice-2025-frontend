import { backendURL } from "./Backend";

interface SolsticeEventInfo {
    name: string,
    description: string,
    type: string,
    team_members: number,
    start: string,
    venue: string,
    id: string
}

export async function getEvents() {

}

export async function getEventInfo(eventId: string) : Promise<SolsticeEventInfo|null> {
    const res = await fetch(`${backendURL}/event/${eventId}`, {
        method: 'GET'
    });

    if (res.status === 200) {
        return (await res.json()) as SolsticeEventInfo;
    }
    return null;
}