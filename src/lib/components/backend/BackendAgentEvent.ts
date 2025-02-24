import { get } from "svelte/store";
import { backendURL, type Result } from "./Backend";
import { getUsersInTeam } from "./BackendAgentTeam";
import type { DateTime } from "@auth/core/providers/kakao";
import { BEARER_TOKEN } from "$env/static/private";
import type { EventType, SolsticeEventInfo, SolsticeEventRegRow, SolsticeTeamInfo, SolsticeUser, UpdateEvent, UserID } from "./BackendTypes.ts";
import { getUserInfo } from "./BackendAgentUser.ts";

let serverEvents: SolsticeEventInfo[] = [];

export async function getEventRegisTable(eventID: string): Promise<SolsticeEventRegRow[] | null> {
    const teams = await getTeams(eventID);
    if (!teams) return null;

    console.log(`number of teams: ${teams.length}`);

    let rows: SolsticeEventRegRow[] = [];

    for (const t of teams) {
        const usrs = await getUsersInTeam(t.id);
        if (usrs) {
            for (const u of usrs) {
                console.log(`User : ${u.first_name} ${u.last_name}`);
                rows.push({
                    player_email: u.email_address,
                    player_name: `${u.first_name} ${u.last_name}`,
                    player_phno: u.phone_number ?? 'none',
                    team_name: t.name,
                    player_reg: u.mahe_registration_number !== null ? `${u.mahe_registration_number}` : 'none',
                    is_captain: u.id == t.host_id
                });
            }
        }
    }

    console.log(`Rows : ${rows.length}; teams : ${teams.length}`);
    return rows;
}


export async function getEvents() {
    const res = await fetch(`${backendURL}/event`, {
        method: 'GET',
        headers: { "Authorization": `Bearer ${BEARER_TOKEN}` }
    });

    if (res.status === 200) {
        serverEvents = await res.json();
        return serverEvents;
    }
    return null;
}

export async function getEventID(eventName: string): Promise<string | null> {
    if (!serverEvents.length) await getEvents();
    return serverEvents.find(ev => ev.name === eventName)?.id ?? null;
}

export async function getUserIDsInEvent(eventId: string): Promise<UserID[] | null> {
    const teams = await getTeams(eventId);
    if (!teams) return null;

    let users: UserID[] = [];
    
    for (const t of teams) {
        users.push(t.host_id);
        const usrs = await getUsersInTeam(t.id);
        if (usrs) {
            users.push(...usrs.map(u => u.id));
        }
    }

    return users;
}

export async function getUserInfosInEvent(eventId: string): Promise<SolsticeUser[] | null> {
    const teams = await getTeams(eventId);
    if (!teams) return null;

    let users: SolsticeUser[] = [];
    
    for (const t of teams) {
        const usrs = await getUsersInTeam(t.id);
        if (usrs) {
            users.push(...usrs);
        }
    }

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

    if (res.ok) return { success: true };
    const body = await res.json();
    return { success: false, error: JSON.stringify(body), code: res.status };
}

export async function getUserTeamIDInEvent(userID: string, eventID: string): Promise<string | null> {
    const teams = await getTeams(eventID);
    if (!teams) return null;

    for (const t of teams) {
        const usrs = await getUsersInTeam(t.id);
        if (usrs && usrs.some(u => u.id === userID)) {
            return t.id;
        }
    }

    return null;
}

export async function getEventInfo(eventId: string): Promise<SolsticeEventInfo | null> {
    const res = await fetch(`${backendURL}/event/${eventId}`, {
        method: 'GET',
        headers: { "Authorization": `Bearer ${BEARER_TOKEN}` }
    });

    return res.status === 200 ? (await res.json()) as SolsticeEventInfo : null;
}

export async function getTeams(eventId: string) {
    const res = await fetch(`${backendURL}/event/${eventId}/teams`, {
        method: 'GET',
        headers: { "Authorization": `Bearer ${BEARER_TOKEN}` }
    });

    return res.status === 200 ? (await res.json()) as SolsticeTeamInfo[] : null;
}

export async function addTeamToEvent(eventId: string, teamId: string) {
    const res = await fetch(`${backendURL}/event/${eventId}/teams/${teamId}`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            "Authorization": `Bearer ${BEARER_TOKEN}`
        }
    });

    return res.status === 200 ? (await res.json()) as string : null;
}

export async function removeTeamFromEvent(eventId: string, teamId: string) {
    const res = await fetch(`${backendURL}/event/${eventId}/teams/${teamId}`, {
        method: 'DELETE',
        headers: {
            'Content-type': 'application/json',
            "Authorization": `Bearer ${BEARER_TOKEN}`
        }
    });

    return res.status === 200 ? (await res.json()) as string : null;
}
