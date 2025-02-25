import { BACKEND_URL, BEARER_TOKEN } from "$env/static/private";
import { verifyGJWT } from "../GAuth";
import { getUserId, getUserInfo } from "./BackendAgentUser";
import type { SolsticeUser } from "./BackendTypes";

export const backendURL = BACKEND_URL;
/*
    these functions are to be called in +server.ts, 
    +page.server.ts, +layout.server.ts files only

    these functions will not function and are not meant to function in
    the browser
*/

export interface Result<T> {
    success: boolean;
    result: T | null;
    error: string | null;
}

export async function verifyAndGetUser(jwt: string | null | undefined): Promise<Result<SolsticeUser>> {
    if (jwt == null) { return { success: false, error: 'jwt is null!', result: null }; }
    if (jwt == undefined) { return { success: false, error: 'jwt is undefined!', result: null }; }

    const ver = await verifyGJWT(jwt);
    if (ver.result == false) { return { success: false, error: 'jwt verification failed!', result: null }; }
    if (ver.object == null) { return { success: false, error: 'google user is null!', result: null }; }
    const userID = await getUserId(ver.object?.email);
    if (userID == null) { return { success: false, error: 'email is not registered!', result: null }; }
    const userInfo = await getUserInfo(userID);
    if (userInfo == null) { return { success: false, error: 'user does not exist on database', result: null }; }
    return { success: true, error: null, result: userInfo };
}
const headers = () => ({
    "Content-Type": "application/json",
    "Authorization": `Bearer ${BEARER_TOKEN}`
});

async function request(method: string, localURL: string, body?: any) {
    try {
        const options: RequestInit = {
            method,
            headers: headers(),
            ...(body ? { body: JSON.stringify(body) } : {})
        };
        const response = await fetch(`${backendURL}/${localURL}`, options);

        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }

        return response;
    } catch (error) {
        console.error(`Request failed: ${method} ${localURL}`, error);
        throw error;
    }
}

export const get = (localURL: string) => request("GET", localURL);
export const del = (localURL: string) => request("DELETE", localURL);
export const post = (localURL: string, body?: any) => request("POST", localURL, body);
export const patch = (localURL: string, body?: any) => request("PATCH", localURL, body);
