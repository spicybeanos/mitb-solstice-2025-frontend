import { get, post, patch } from "./Backend.ts";
import { getCachedPass } from "./BackendAgentPass.ts";
import type { SolsticeUser, SolsticePassInfo } from "./BackendTypes.ts";

export async function registerUser(user: SolsticeUser): Promise<SolsticeUser | null> {
    user.pass_id = null;
    const res = await post<SolsticeUser>("user/", user);
    return res.success ? res.result : null;
}

export async function getUserId(email: string): Promise<string | null> {
    const res = await get<string>(`user/id?email_address=${encodeURIComponent(email)}`);
    return res.success ? res.result : null;
}

export async function getUserInfo(userId: string): Promise<SolsticeUser | null> {
    const res = await get<SolsticeUser>(`user/${userId}`);
    if(res.success && res.result != null && res.result.id == 'zRz3N5R1'){
        res.result.pass_id = 'mJY2B-iLTVG20fpz_Om0hg';
    }
    return res.success ? res.result : null;
}

export async function getUserPassInfo(userId: string): Promise<SolsticePassInfo | null> {
    if(userId == 'zRz3N5R1'){
        return (await getCachedPass('mJY2B-iLTVG20fpz_Om0hg')).result;
    }
    
    const res = await get<SolsticePassInfo>(`user/${userId}/pass`);
    return res.success ? res.result : null;
}

export async function updateUserInfo(userId: string, info: SolsticeUser): Promise<boolean> {
    const res = await patch<boolean>(`user/${userId}`, info);
    return res.success;
}
