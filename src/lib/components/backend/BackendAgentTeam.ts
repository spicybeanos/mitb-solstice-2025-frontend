import { get, post, patch, del } from "./Backend";
import { addTeamToEvent } from "./BackendAgentEvent";
import type { SolsticeUser } from "./BackendTypes.ts";
import type { SolsticeTeamInfo } from "./BackendTypes";

export async function createTeam(teamName: string, hostId: string): Promise<SolsticeTeamInfo | null> {
    const res = await post("team", { name: teamName, host_id: hostId });

    if (res.status === 200) {
        const team_info = (await res.json()) as SolsticeTeamInfo;
        await addUserToTeam(team_info.id, hostId);
        return team_info;
    }
    return null;
}

export async function createTeamAndAttach(teamName: string, hostId: string, eventId: string): Promise<SolsticeTeamInfo | null> {
    const createRes = await createTeam(teamName, hostId);
    if (!createRes) return null;

    const att = await addTeamToEvent(eventId, createRes.id);
    return att ? createRes : null;
}

export async function addUserToTeam(teamId: string, userID: string): Promise<SolsticeTeamInfo | null> {
    const res = await post(`team/${teamId}/user/${userID}`);

    if (res.status === 200) {
        return (await res.json()) as SolsticeTeamInfo;
    }
    return null;
}

export async function removeUserFromTeam(teamId: string, userID: string): Promise<SolsticeTeamInfo | null> {
    const res = await del(`team/${teamId}/user/${userID}`);

    if (res.status === 200) {
        return (await res.json()) as SolsticeTeamInfo;
    }
    return null;
}

export async function getUsersInTeam(teamId: string): Promise<SolsticeUser[] | null> {
    const res = await get(`team/${teamId}/users`);

    if (res.status === 200) {
        return (await res.json()) as SolsticeUser[];
    }
    return null;
}

export async function updateTeam(teamName: string, hostId: string): Promise<SolsticeTeamInfo | null> {
    const res = await patch("team", { name: teamName, host_id: hostId });

    if (res.status === 200) {
        return (await res.json()) as SolsticeTeamInfo;
    }
    return null;
}

export async function getTeamDetails(teamId: string): Promise<SolsticeTeamInfo | null> {
    const res = await get(`team/${teamId}`);

    if (res.status === 200) {
        return (await res.json()) as SolsticeTeamInfo;
    }
    return null;
}

export async function deleteTeam(teamId: string): Promise<SolsticeTeamInfo | null> {
    const res = await del(`team/${teamId}`);

    if (res.status === 200) {
        return (await res.json()) as SolsticeTeamInfo;
    }
    return null;
}
