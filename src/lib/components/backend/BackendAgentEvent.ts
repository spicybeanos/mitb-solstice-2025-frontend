import { backendURL } from "./Backend";

interface FalakEventInfo {
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
export async function getEventInfo(eventId: string) : Promise<FalakEventInfo|null> {
    const res = await fetch(`${backendURL}/event/${eventId}`, {
        method: 'GET'
    });

    if (res.status === 200) {
        return (await res.json()) as FalakEventInfo;
    }
    return null;
}