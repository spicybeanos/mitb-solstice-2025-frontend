import { get } from "svelte/store";
import { backendURL, type Result } from "./Backend";
import { getUsersInTeam } from "./BackendAgentTeam";
import type { DateTime } from "@auth/core/providers/kakao";
import { BEARER_TOKEN } from "$env/static/private";
import type { EventType, SolsticeEventInfo, SolsticeTeamInfo, UpdateEvent } from "./BackendTypes.ts";


let serverEvents: SolsticeEventInfo[] = [];



export async function getEvents() {
    const res = await fetch(`${backendURL}/event`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${BEARER_TOKEN}`
        }
    });

    if (res.status === 200) {
        serverEvents = await res.json();
        return serverEvents;
    }
    return null;
}
export async function getEventID(eventName: string): Promise<string | null> {
    if (serverEvents == null) { await getEvents(); }
    if (serverEvents == null) return null;

    serverEvents.forEach(ev => {
        if (ev.name == eventName) { return ev.id; }
    });

    return null;
}
export async function getUsersInEvent(eventId: string): Promise<string[] | null> {
    const teams = await getTeams(eventId);
    if (teams == null) { return null; }

    let users: string[] = [];
    teams.forEach(async t => {
        users.push(t.host_id);
        const usrs = await getUsersInTeam(t.id);
        if (usrs != null) {
            usrs.forEach(u => {
                users.push(u.id);
            });
        }
    });

    return users;
}
export async function updateEventDetails(eventID: string, info: UpdateEvent) {
    const res = await fetch(`${backendURL}/event/${eventID}`, {
        method: 'PATCH',
        headers: {
            'Content-type': 'application/json',
            "Authorization": `Bearer ${BEARER_TOKEN}`
        },
        body: JSON.stringify(info)
    });
    if (res.ok) { return {success:true}; }
    const body = await res.json();
    console.log(`Could not update event: ${JSON.stringify(body)}`);
    return {success:false,error: JSON.stringify(body),code:res.status};
}
export async function getUserTeamIDInEvent(userID: string, eventID: string): Promise<string | null> {
    const teams = await getTeams(eventID);
    if (teams == null) { return null; }

    teams.forEach(async t => {
        if (t.host_id == userID) { return t.id; }

        const usrs = await getUsersInTeam(t.id);
        if (usrs != null) {
            usrs.forEach(u => {
                if (u.id == userID) {
                    return t.id;
                }
            });
        }
    });

    return null;
}
export async function getEventInfo(eventId: string): Promise<SolsticeEventInfo | null> {
    const res = await fetch(`${backendURL}/event/${eventId}`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${BEARER_TOKEN}`
        }
    });

    if (res.status === 200) {
        return (await res.json()) as SolsticeEventInfo;
    }
    return null;
}

export async function getTeams(eventId: string) {
    const res = await fetch(`${backendURL}/event/${eventId}/teams`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${BEARER_TOKEN}`
        }
    });

    if (res.status === 200) {
        return (await res.json()) as SolsticeTeamInfo[];
    }
    return null;
}
export async function addTeamToEvent(eventId: string, teamId: string) {
    const res = await fetch(`${backendURL}/event/${eventId}/teams/${teamId}`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            "Authorization": `Bearer ${BEARER_TOKEN}`
        }
    });

    if (res.status === 200) {
        return (await res.json()) as string;
    }
    return null;
}
export async function removeTeamFromEvent(eventId: string, teamId: string) {
    const res = await fetch(`${backendURL}/event/${eventId}/teams/${teamId}`, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json',
            "Authorization": `Bearer ${BEARER_TOKEN}`
        }
    });

    if (res.status === 200) {
        return (await res.json()) as string;
    }
    return null;
}