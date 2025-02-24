import { BEARER_TOKEN } from "$env/static/private";
import { backendURL } from "./Backend";
import { getDefaultPass } from "./BackendAgentPass";
import type { SolsticeUser, SolsticePassInfo } from "./BackendTypes.ts";


export async function registerUser(user: SolsticeUser): Promise<SolsticeUser | null> {
    const defaultPassID = await getDefaultPass();
    user.pass_id = null;
    const res = await fetch(`${backendURL}/user`, {
        method: 'POST',
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${BEARER_TOKEN}`
        },
        body: JSON.stringify(user)
    });

    if (res.status === 200) {
        return (await res.json()) as SolsticeUser;
    }
    return null;
}
export async function getUserId(email: string): Promise<string | null> {
    const res = await fetch(`${backendURL}/user/id?email_address=${encodeURIComponent(email)}`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${BEARER_TOKEN}`
        }
    });

    if (res.status === 200) {
        return (await res.json()) as string;
    }
    return null;
}
export async function getUserInfo(userId: string): Promise<SolsticeUser | null> {
    const res = await fetch(`${backendURL}/user/${userId}`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${BEARER_TOKEN}`
        }
    });

    if (res.status === 200) {
        return (await res.json()) as SolsticeUser;
    }
    return null;
}
export async function getUserPassInfo(userId: string): Promise<SolsticePassInfo | null> {
    const res = await fetch(`${backendURL}/user/${userId}/pass`, {
        method: 'GET',
        headers: {
            "Authorization": `Bearer ${BEARER_TOKEN}`
        }
    });

    if (res.status === 200) {
        return (await res.json()) as SolsticePassInfo;
    }
    return null;
}
export async function updateUserInfo(userId: string, info: SolsticeUser): Promise<boolean> {
    const res = await fetch(`${backendURL}/user/${userId}`, {
        method: 'PATCH',
        headers: {
            "Content-type": "application/json",
            "Authorization": `Bearer ${BEARER_TOKEN}`
        },
        body: JSON.stringify(info)
    });

    if (res.status === 200) {
        return true;
    }
    return false;
}