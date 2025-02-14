import { backendURL } from "./Backend";
import type { SolsticeUser } from "./BackendAgentUser";

export interface SolsticeTeamInfo{
    name:string;
    host_id:string;
    id:string;
}

export async function createTeam(teamName:string,hostId:string) : Promise<SolsticeTeamInfo|null> {
    const res = await fetch(`${backendURL}/team`, {
        method: 'POST',
        headers:{
            "Content-type":"application/json"
        },
        body: JSON.stringify({
            name:teamName,
            host_id:hostId
        })
    });

    if (res.status === 200) {
        return (await res.json()) as SolsticeTeamInfo;
    }
    return null;
}
export async function addUserToTeam(teamId:string,userID:string) : Promise<SolsticeTeamInfo|null> {
    const res = await fetch(`${backendURL}/team/${teamId}/user/${userID}`, {
        method: 'POST',
        headers:{
            "Content-type":"application/json"
        }
    });

    if (res.status === 200) {
        return (await res.json()) as SolsticeTeamInfo;
    }
    return null;
}
export async function removeUserFromTeam(teamId:string,userID:string) : Promise<SolsticeTeamInfo|null> {
    const res = await fetch(`${backendURL}/team/${teamId}/user/${userID}`, {
        method: 'DELETE',
        headers:{
            "Content-type":"application/json"
        }
    });

    if (res.status === 200) {
        return (await res.json()) as SolsticeTeamInfo;
    }
    return null;
}
export async function getUsersInTeam(teamId:string) {
    const res = await fetch(`${backendURL}/team/${teamId}/user`, {
        method: 'GET'
    });

    if (res.status === 200) {
        return (await res.json()) as SolsticeUser[];
    }
    return null;
}
export async function updateTeam(teamName:string,hostId:string) : Promise<SolsticeTeamInfo|null> {
    const res = await fetch(`${backendURL}/team`, {
        method: 'PATCH',
        headers:{
            "Content-type":"application/json"
        },
        body: JSON.stringify({
            name:teamName,
            host_id:hostId
        })
    });

    if (res.status === 200) {
        return (await res.json()) as SolsticeTeamInfo;
    }
    return null;
}
export async function getTeamDetails(teamId:string) : Promise<SolsticeTeamInfo|null> {
    const res = await fetch(`${backendURL}/team/${teamId}`, {
        method: 'GET'
    });

    if (res.status === 200) {
        return (await res.json()) as SolsticeTeamInfo;
    }

    return null;
}
export async function deleteTeam(teamId:string) : Promise<SolsticeTeamInfo|null> {
    const res = await fetch(`${backendURL}/team/${teamId}`, {
        method: 'DELETE'
    });

    if (res.status === 200) {
        return (await res.json()) as SolsticeTeamInfo;
    }

    return null;

}
