import { get, post, patch, del, type Result } from "./Backend.ts";
import { addTeamToEvent } from "./BackendAgentEvent.ts";
import type { SolsticeUser, SolsticeTeamInfo, SolsticeTeamContent } from "./BackendTypes.ts";

export async function createTeam(teamName: string, hostId: string): Promise<SolsticeTeamInfo | null> {

    const res = await post<SolsticeTeamInfo>(`team/`, { name: teamName, host_id: hostId });

    if (!res.success || !res.result) { console.log('Create team post failed!' + res.error); return null; }

    const addUserRes = await addUserToTeam(res.result.id, hostId);
    if(addUserRes == null) { console.log('attaching user to team failed!')}
    return addUserRes != null ? res.result : null;
}

export async function createTeamAndAttach(teamName: string, hostId: string, eventId: string): Promise<Result<SolsticeTeamInfo>> {
    const createRes = await createTeam(teamName, hostId);
    if (!createRes) return { success: false, error: 'Could not create a team', result: null };

    const attachRes = await addTeamToEvent(eventId, createRes.id);
    return attachRes ? { success: true, error: null, result: createRes } : { success: false, error: 'Could not attach team to event', result: null };
}

export async function addUserToTeam(teamId: string, userInfo:string): Promise<SolsticeTeamInfo | null> {
    const res = await post<SolsticeTeamInfo>(`team/${teamId}/users/${userInfo}?validate=false`);
    if(res.success == false){console.log(`could not attach user to team: ${JSON.stringify(res.error)}`)}
    return res.success ? res.result : null;
}

export async function removeUserFromTeam(teamId: string, userID: string): Promise<SolsticeTeamInfo | null> {
    const res = await del<SolsticeTeamInfo>(`team/${teamId}/users/${userID}`);
    if(res.success == false){
        console.log(`error while leaving team : ${JSON.stringify(res.error)}`)
    }
    return res.success ? res.result : null;
}

export async function getAllTeams() {
    return await get<SolsticeTeamInfo[]>(`team/`)
}
export async function getAllMembers(eventID:string) {
    return await get<SolsticeTeamContent>(`event/${eventID}/teams/users`)
}

export async function getUsersInTeam(teamId: string): Promise<SolsticeUser[] | null> {
    const res = await get<SolsticeUser[]>(`team/${teamId}/users`);
    return res.success ? res.result : null;
}

export async function updateTeam(teamName: string, hostId: string): Promise<SolsticeTeamInfo | null> {
    const res = await patch<SolsticeTeamInfo>(`team/`, { name: teamName, host_id: hostId });
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

export async function disbandTeam(teamID: string) {
    const parts = await getUsersInTeam(teamID);
    if (parts != null) {
        for (const usr of parts) {
            await removeUserFromTeam(teamID, usr.id);
        }
    }
    return await deleteTeam(teamID);
}