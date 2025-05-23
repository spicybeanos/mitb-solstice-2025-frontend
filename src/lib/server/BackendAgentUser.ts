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

export async function getuserIdFromRegNo(regNo:string) {
    return await get<string>(`user/id-registration?mahe_registration_number=${encodeURIComponent(regNo)}`);
}

export async function getUserInfo(userId: string): Promise<SolsticeUser | null> {
    const res = await get<SolsticeUser>(`user/${userId}`);
    return res.success ? res.result : null;
}

export async function getUserPassInfo(userId: string): Promise<SolsticePassInfo | null> {
    
    const res = await get<SolsticePassInfo>(`user/${userId}/pass`);
    return res.success ? res.result : null;
}

export async function updateUserInfo(userId: string, info: SolsticeUser): Promise<boolean> {
    const res = await patch<boolean>(`user/${userId}`, info);
    return res.success;
}
