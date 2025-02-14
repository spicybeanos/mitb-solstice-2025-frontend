import { backendURL } from "./Backend";

export interface SolsticePassInfo{
    name: string;
    description: string;
    cost: string;
    id: string;
}

export interface EventInPass{
    name: string,
    description: string,
    type: string,
    team_members: number,
    start: string,
    venue: string,
    id: string
}

export async function getPass(passId: string) {
    const res = await fetch(`${backendURL}/pass/${passId}`, {
        method: 'GET'
    });

    if (res.status === 200) {
        return (await res.json()) as SolsticePassInfo;
    }
    return null;
}

export async function getAllPasses(){
    const res= await fetch(`${backendURL}/pass/`,{
        method:'GET'
    });

    if (res.status!==200){
        return null
    }
    return (await res.json()) as SolsticePassInfo[]
}

export async function getAllEventsInPass(passId:string) {
    const res= await fetch(`${backendURL}/pass/${passId}/events`,{
        method:'GET'
    });

    if (res.status!==200){
        return null
    }
    return (await res.json()) as EventInPass[]
}