import { verifyGJWT } from "../GAuth";
import { getUserId, getUserInfo, type SolsticeUser } from "./BackendAgentUser";

export const backendURL = "http://127.0.0.1:8000";
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