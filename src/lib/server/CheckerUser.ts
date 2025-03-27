import type { Result } from "./Backend";
import { supabaseAdmin } from "./supabaseServer";
import { sha224 } from 'js-sha256';
import { CACHE_MASTER_SALT } from "$env/static/private";
import { error } from "@sveltejs/kit";
import { createHash } from "crypto";

export interface CheckerUserLogin {
    user: string;
    pass: string;
}

function hashPasswrod(checker: CheckerUserLogin) {
    return createHash("sha256").update(checker.pass + CACHE_MASTER_SALT + checker.user).digest("base64");
}

async function createToken(username: string) {
    const timeOfCreation = new Date().getTime();
    const token = createHash("sha256").update(username + CACHE_MASTER_SALT + timeOfCreation).digest("base64");

    // Set expiry time (24 hours)
    const expiresAt = new Date(timeOfCreation + 24 * 60 * 60 * 1000).toISOString();

    // Store token in Supabase (overwrite if user already has a token)
    await supabaseAdmin
        .from("AuthorizedPassValidators")
        .update({ token, expires_at: expiresAt })
        .eq("username", username);

    return token;
}

export async function validateToken(token: string) {
    // Fetch token from Supabase
    const { data, error } = await supabaseAdmin
        .from("AuthorizedPassValidators")
        .select("expires_at")
        .eq("token", token)
        .single();

    if (error || !data) return false; // Token not found

    // Check if token is expired
    return new Date(data.expires_at) > new Date();
}

export async function logout(token: string) {
    await supabaseAdmin.from("AuthorizedPassValidators")
        .update({ token: null, expires_at: null })
        .eq("token", token);
}


export async function authenticateCreds(checkerLogIn: CheckerUserLogin): Promise<Result<boolean>> {

    const { data, error } = await supabaseAdmin
        .from('AuthorizedPassValidators')
        .select('passhash')
        .eq('username', checkerLogIn.user.trim())
        .single();

    if (error || !data) {
        console.error(`Error fetching passhash for user ${checkerLogIn.user}: ${error?.message || "User not found"}`);
        return { success: false, result: false, error: error?.message || "User not found" };
    }

    const phash = hashPasswrod(checkerLogIn);
    return { success: true, result: phash == data.passhash, error: null }
}

export async function logIn(checkerLogin: CheckerUserLogin): Promise<Result<string>> {

    const auth = await authenticateCreds(checkerLogin);

    if (auth.success == false) { return { success: false, error: auth.error, result: null }; }
    if (auth.result == false) { return { success: false, error: 'Unauthorized! Username or password incorrect!', result: null }; }

    const token = await createToken(checkerLogin.user);

    return { success: true, result: token, error: null }
}

export async function signUp(checkerLogin: CheckerUserLogin): Promise<Result<string>> {
    // Hash the password using the custom function
    const passhash = hashPasswrod(checkerLogin);

    // Insert user into Supabase
    const username = checkerLogin.user;

    const { error } = await supabaseAdmin
        .from("AuthorizedPassValidators")
        .insert([{ username, passhash }]);

    if (error) {
        return { success: false, error: error.message, result: null };
    }

    return { success: true, result: checkerLogin.user, error: null };
}
