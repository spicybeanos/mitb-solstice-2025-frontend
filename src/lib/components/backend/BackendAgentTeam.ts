import { backendURL } from "./Backend";

interface FalakTeamInfo{
    name:string;
    host_id:string;
    id:string;
}

export async function createTeam(teamName:string,hostId:string) : Promise<FalakTeamInfo|null> {
    const res = await fetch(`${backendURL}/team`, {
        method: 'POST',
        body: JSON.stringify({
            name:teamName,
            host_id:hostId
        })
    });

    if (res.status === 200) {
        return (await res.json()) as FalakTeamInfo;
    }
    return null;
}
export async function updateTeam(teamName:string,hostId:string) : Promise<FalakTeamInfo|null> {
    const res = await fetch(`${backendURL}/team`, {
        method: 'PATCH',
        body: JSON.stringify({
            name:teamName,
            host_id:hostId
        })
    });

    if (res.status === 200) {
        return (await res.json()) as FalakTeamInfo;
    }
    return null;
}
export async function getTeamDetails(teamId:string) : Promise<FalakTeamInfo|null> {
    const res = await fetch(`${backendURL}/team/${teamId}`, {
        method: 'GET'
    });

    if (res.status === 200) {
        return (await res.json()) as FalakTeamInfo;
    }

    return null;
}