import { get, post, patch, del } from "./Backend.ts";
import { addTeamToEvent } from "./BackendAgentEvent.ts";
import type { SolsticeUser, SolsticeTeamInfo } from "./BackendTypes.ts";

export async function createTeam(teamName: string, hostId: string): Promise<SolsticeTeamInfo | null> {
    const res = await post<SolsticeTeamInfo>(`team`, { name: teamName, host_id: hostId });

    if (!res.success || !res.result) return null;

    const addUserRes = await addUserToTeam(res.result.id, hostId);
    return addUserRes ? res.result : null;
}

export async function createTeamAndAttach(teamName: string, hostId: string, eventId: string): Promise<SolsticeTeamInfo | null> {
    const createRes = await createTeam(teamName, hostId);
    if (!createRes) return null;

    const attachRes = await addTeamToEvent(eventId, createRes.id);
    return attachRes ? createRes : null;
}

export async function addUserToTeam(teamId: string, userID: string): Promise<SolsticeTeamInfo | null> {
    const res = await post<SolsticeTeamInfo>(`team/${teamId}/user/${userID}`);
    return res.success ? res.result : null;
}

export async function removeUserFromTeam(teamId: string, userID: string): Promise<SolsticeTeamInfo | null> {
    const res = await del<SolsticeTeamInfo>(`team/${teamId}/user/${userID}`);
    return res.success ? res.result : null;
}

export async function getUsersInTeam(teamId: string): Promise<SolsticeUser[] | null> {
    const res = await get<SolsticeUser[]>(`team/${teamId}/users`);
    return res.success ? res.result : null;
}

export async function updateTeam(teamName: string, hostId: string): Promise<SolsticeTeamInfo | null> {
    const res = await patch<SolsticeTeamInfo>(`team`, { name: teamName, host_id: hostId });
    return res.success ? res.result : null;
}

export async function getTeamDetails(teamId: string): Promise<SolsticeTeamInfo | null> {
    const res = await get<SolsticeTeamInfo>(`team/${teamId}`);
    return res.success ? res.result : null;
}

export async function deleteTeam(teamId: string): Promise<SolsticeTeamInfo | null> {
    const res = await del<SolsticeTeamInfo>(`team/${teamId}`);
    return res.success ? res.result : null;
}

export async function disbandTeam(teamID:string) {
    const parts = await getUsersInTeam(teamID);
    if(parts != null){
        for (const usr of parts) {
             await removeUserFromTeam(teamID,usr.id);
            
        }
    }
    return await deleteTeam(teamID);
}