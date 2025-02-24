import { BEARER_TOKEN } from "$env/static/private";
import { backendURL } from "./Backend";
import { addTeamToEvent } from "./BackendAgentEvent";
import type { SolsticeUser } from "./BackendTypes.ts"
import type { SolsticeTeamInfo } from "./BackendTypes";


export async function createTeam(teamName: string, hostId: string): Promise<SolsticeTeamInfo | null> {
    const res = await fetch(`${backendURL}/team`, {
        method: 'POST',
        headers: {
            "Content-type": "application/json"
        },
        body: JSON.stringify({
            name: teamName,
            host_id: hostId
        })
    });

    if (res.status === 200) {
        return (await res.json()) as SolsticeTeamInfo;
    }
    return null;
}

export async function createTeamAndAttach(teamName: string, hostId: string, eventId: string): Promise<SolsticeTeamInfo | null> {
    const createRes = await createTeam(teamName, hostId);
    if (createRes == null) { return null; }

    const att = await addTeamToEvent(eventId, createRes.id);
    if (att == null) { return null; }
    return createRes;
}
export async function addUserToTeam(teamId: string, userID: string): Promise<SolsticeTeamInfo | null> {
    const res = await fetch(`${backendURL}/team/${teamId}/user/${userID}`, {
        method: 'POST',
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${BEARER_TOKEN}`
        }
    });

    if (res.status === 200) {
        return (await res.json()) as SolsticeTeamInfo;
    }
    return null;
}
export async function removeUserFromTeam(teamId: string, userID: string): Promise<SolsticeTeamInfo | null> {
    const res = await fetch(`${backendURL}/team/${teamId}/user/${userID}`, {
        method: 'DELETE',
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${BEARER_TOKEN}`
        }
    });

    if (res.status === 200) {
        return (await res.json()) as SolsticeTeamInfo;
    }
    return null;
}
export async function getUsersInTeam(teamId: string) {
    const res = await fetch(`${backendURL}/team/${teamId}/users`, {
        method: 'GET',
        headers:{
            "Authorization": `Bearer ${BEARER_TOKEN}`
        }
    });

    if (res.status === 200) {
        return (await res.json()) as SolsticeUser[];
    }
    return null;
}
export async function updateTeam(teamName: string, hostId: string): Promise<SolsticeTeamInfo | null> {
    const res = await fetch(`${backendURL}/team`, {
        method: 'PATCH',
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${BEARER_TOKEN}`
        },
        body: JSON.stringify({
            name: teamName,
            host_id: hostId
        })
    });

    if (res.status === 200) {
        return (await res.json()) as SolsticeTeamInfo;
    }
    return null;
}
export async function getTeamDetails(teamId: string): Promise<SolsticeTeamInfo | null> {
    const res = await fetch(`${backendURL}/team/${teamId}`, {
        method: 'GET',
        headers:{
            "Authorization": `Bearer ${BEARER_TOKEN}`
        }
    });

    if (res.status === 200) {
        return (await res.json()) as SolsticeTeamInfo;
    }

    return null;
}
export async function deleteTeam(teamId: string): Promise<SolsticeTeamInfo | null> {
    const res = await fetch(`${backendURL}/team/${teamId}`, {
        method: 'DELETE',
        headers:{
            "Authorization": `Bearer ${BEARER_TOKEN}`
        }
    });

    if (res.status === 200) {
        return (await res.json()) as SolsticeTeamInfo;
    }

    return null;

}
