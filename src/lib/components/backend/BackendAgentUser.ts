import { get, post, patch } from "./Backend.ts";
import { getDefaultPass } from "./BackendAgentPass.ts";
import type { SolsticeUser, SolsticePassInfo } from "./BackendTypes.ts";

export async function registerUser(user: SolsticeUser): Promise<SolsticeUser | null> {
    const defaultPassID = await getDefaultPass();
    user.pass_id = null;
    
    const res = await post("user", user);
    if (res.status === 200) {
        return (await res.json()) as SolsticeUser;
    }
    return null;
}

export async function getUserId(email: string): Promise<string | null> {
    const res = await get(`user/id?email_address=${encodeURIComponent(email)}`);
    if (res.status === 200) {
        return (await res.json()) as string;
    }
    return null;
}

export async function getUserInfo(userId: string): Promise<SolsticeUser | null> {
    const res = await get(`user/${userId}`);
    if (res.status === 200) {
        return (await res.json()) as SolsticeUser;
    }
    return null;
}

export async function getUserPassInfo(userId: string): Promise<SolsticePassInfo | null> {
    const res = await get(`user/${userId}/pass`);
    if (res.status === 200) {
        return (await res.json()) as SolsticePassInfo;
    }
    return null;
}

export async function updateUserInfo(userId: string, info: SolsticeUser): Promise<boolean> {
    const res = await patch(`user/${userId}`, info);
    return res.status === 200;
}
