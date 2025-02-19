import { backendURL } from "./Backend";

interface SolsticePassInfo{
    name: string;
    description: string | null;
    cost: string;
    id: string;
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
export async function getUserPass(userID:string) {
    
}