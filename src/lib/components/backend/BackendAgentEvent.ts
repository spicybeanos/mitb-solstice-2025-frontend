import { backendURL } from "./Backend";
import type { SolsticeTeamInfo } from "./BackendAgentTeam";

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

export async function getTeams(eventId:string) {
    const res = await fetch(`${backendURL}/event/${eventId}/teams`, {
        method: 'GET'
    });

    if (res.status === 200) {
        return (await res.json()) as SolsticeTeamInfo[];
    }
    return null;
}
export async function addTeamToEvent(eventId:string,teamId:string) {
    const res = await fetch(`${backendURL}/event/${eventId}/teams/${teamId}`, {
        method: 'POST',
        headers:{
            'Content-type':'application/json'
        }
    });

    if (res.status === 200) {
        return (await res.json()) as string;
    }
    return null;
}
export async function removeTeaFromEvent(eventId:string,teamId:string) {
    const res = await fetch(`${backendURL}/event/${eventId}/teams/${teamId}`, {
        method: 'DELETE',
        headers:{
            'Content-type':'application/json'
        }
    });

    if (res.status === 200) {
        return (await res.json()) as string;
    }
    return null;
}