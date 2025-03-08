import { BACKEND_URL, BEARER_TOKEN } from "$env/static/private";
import { ID_VALIDITY_KEY } from "$env/static/private";
import { verifyGJWT } from "./GAuth";
import { getUserId, getUserInfo } from "./BackendAgentUser";
import type { SolsticeUser } from "./BackendTypes";
import { verifyUserInfoCookie } from "./CacheMaster";

const headers = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${BEARER_TOKEN}`
});

export interface Result<T> {
    success: boolean;
    result: T | null;
    error: string | null;
}
function toNumber(str: string) {
    return parseInt(str, 36);
}
export async function isUserIdInvalid(userID: string) {
    let key = parseInt(ID_VALIDITY_KEY);
    return toNumber(userID) % key === 0;
}
function reportAction() {

}
export async function verifyAndGetUser(jwt: string | null | undefined, userInfoCookieJson: string | null | undefined, userChecksum: string | null | undefined): Promise<Result<SolsticeUser>> {
    if (jwt == null) { return { success: false, error: 'jwt is null!', result: null }; }
    if (jwt == undefined) { return { success: false, error: 'jwt is undefined!', result: null }; }

    const ver = await verifyGJWT(jwt);
    if (ver.result == false) { return { success: false, error: 'jwt verification failed!', result: null }; }
    if (ver.object == null) { return { success: false, error: 'google user is null!', result: null }; }

    const res_cache = verifyUserInfoCookie(userInfoCookieJson, userChecksum);
    if (res_cache.success == true) {
        if (res_cache.result?.email_address.trim() == ver.object.email.trim()) {
            return res_cache;
        }
    }

    const userID = await getUserId(ver.object?.email);
    if (userID == null) { return { success: false, error: 'email is not registered!', result: null }; }
    const userInfo = await getUserInfo(userID);
    if (userInfo == null) { return { success: false, error: 'user does not exist on database', result: null }; }
    return { success: true, error: 'no cookie', result: userInfo };
}
async function request<T>(method: string, url: string, body?: any): Promise<Result<T>> {
    try {
        const options: RequestInit = {
            method,
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${BEARER_TOKEN}`
            },
            body: body ? JSON.stringify(body) : undefined,
        };

        const res = await fetch(`${BACKEND_URL}/${url}`, options);
        const contentType = res.headers.get("content-type");

        let responseBody: any = null;
        if (contentType && contentType.includes("application/json")) {
            responseBody = await res.json();
        } else {
            responseBody = await res.text();
        }

        const _res_ = {
            success: res.ok, // True for 2xx responses
            result: res.ok ? (responseBody as T) : null,
            error: res.ok ? null : responseBody || `Err_${res.status}`,
        };
        return _res_;
    } catch (error) {
        return {
            success: false,
            result: null,
            error: error instanceof Error ? error.message : "Unknown error occurred",
        };
    }
}

// Corrected function calls with method parameters
export const get = <T>(localURL: string) => request<T>("GET", localURL);
export const del = <T>(localURL: string) => request<T>("DELETE", localURL);
export const post = <T>(localURL: string, body?: any) => request<T>("POST", localURL, body);
export const patch = <T>(localURL: string, body?: any) => request<T>("PATCH", localURL, body);
