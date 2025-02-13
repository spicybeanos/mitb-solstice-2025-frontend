import { backendURL } from "./Backend";

interface SolsticeTeamInfo{
    name:string;
    host_id:string;
    id:string;
}

export async function createTeam(teamName:string,hostId:string) : Promise<SolsticeTeamInfo|null> {
    const res = await fetch(`${backendURL}/team`, {
        method: 'POST',
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
export async function updateTeam(teamName:string,hostId:string) : Promise<SolsticeTeamInfo|null> {
    const res = await fetch(`${backendURL}/team`, {
        method: 'PATCH',
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