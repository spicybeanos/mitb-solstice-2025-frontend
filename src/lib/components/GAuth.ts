import { json } from '@sveltejs/kit';
import { OAuth2Client } from 'google-auth-library';
import { isSigningOut } from '../../routes/GoogleLogin.svelte.ts';
import { G_CLIENT_AUD } from '$env/static/private';

const gclient = new OAuth2Client();

export interface UserProfile {
    name: string;
    email: string;
    picture: string;
    sub: string;
    email_verified: boolean;
}
export interface VerificationResult {
    result: boolean;
    object?: UserProfile;
    userid?: string;
}
export async function verifyGJWT(token: string): Promise<VerificationResult> {
    try {
        const ticket = await gclient.verifyIdToken({
            idToken: token,
            audience: G_CLIENT_AUD,  // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
        });
        const payload = ticket.getPayload();
        if (payload == undefined) {
            return { result: false } as VerificationResult;
        }
        const userid = payload['sub'];
        return { result: true, object: getUserObjectFromJWT(token), userid: userid } as VerificationResult
        // If the request specified a Google Workspace domain:
        // const domain = payload['hd'];
    }
    catch {
        return { result: false } as VerificationResult;
    }

}

export function getUserObjectFromJWT(jwt: string) {
    const base64Url = jwt.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
        atob(base64)
            .split("")
            .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
            .join(""),
    );
    const obj = JSON.parse(jsonPayload) as UserProfile
    let pf: UserProfile = {
        name: obj.name,
        email: obj.email,
        email_verified: obj.email_verified,
        sub: obj.sub,
        picture: obj.picture
    }
    return pf;
}
