import { BACKEND_URL, BEARER_TOKEN } from "$env/static/private";
import { get, type Result } from "./Backend.ts";
import type { SolsticeEventInfo, SolsticePassInfo, } from "./BackendTypes.ts";
import { supabaseAdmin } from "./supabaseServer.ts";

const DEFAULT_PASS_NAME = "default-pass";

export async function getAllPasses(): Promise<SolsticePassInfo[] | null> {
    const p_ = await getAllCachedPasses();
    return p_.success ? p_.result : null;
    // const res = await get("pass/");
    // if (res.success) {
    //     return (await res.result) as SolsticePassInfo[];
    // }
    // return null;
}

export async function getSolsticePassInfo(passID: string | null): Promise<SolsticePassInfo | null> {
    if (passID == null) {
        return null;
    }

    const p = await getCachedPass(passID);
    return p.success ? p.result : null;
}

export async function getPass(passId: string): Promise<SolsticePassInfo | null> {
    return await getSolsticePassInfo(passId);
}

export async function getEventsAccessibleByPass(passID: string): Promise<SolsticeEventInfo[] | null> {
    const res = await get(`pass/${passID}/events`);

    if (res.success) {
        return (await res.result) as SolsticeEventInfo[];
    }
    return null;
}

export async function checkEventAccessibleByPass(eventID: string, passID: string | null) {
    const res = await get(`event/${eventID}/passes`);
    if (res.success == false) { return { success: false, passes: null }; }
    const passes = res.result as SolsticePassInfo[];
    if (passes.length == 0) { return { success: true, passes: passes }; }
    for (const pass of passes) {
        if (passID == pass.id) { return { success: true, passes: passes }; }
    }
    return { success: false, passes: passes };
}

export async function getAllEventsInPass(passId: string) {
    return await getEventsAccessibleByPass(passId);
}

/**
 * Fetch all passes from pass_info_cache.
 */
export async function getAllCachedPasses(): Promise<Result<SolsticePassInfo[]>> {
    const { data, error } = await supabaseAdmin
        .from("pass_info_cache")
        .select("*"); // Select all columns

    if (error) {
        return { success: false, result: null, error: error.message };
    }

    return { success: true, result: data, error: null };
}

/**
 * Fetch a pass by ID from pass_info_cache.
 */
export async function getCachedPass(passID: string): Promise<Result<SolsticePassInfo>> {
    if (!passID.trim()) {
        return { success: false, result: null, error: "Invalid pass ID" };
    }

    const { data, error } = await supabaseAdmin
        .from("pass_info_cache")
        .select("*")
        .eq("id", passID.trim())
        .single();

    if (error || !data) {
        return { success: false, result: null, error: error?.message || "Pass not found" };
    }

    return { success: true, result: data, error: null };
}

/**
 * Delete a pass by ID from pass_info_cache.
 */
export async function deleteCachedPass(passID: string): Promise<Result<null>> {
    if (!passID.trim()) {
        return { success: false, result: null, error: "Invalid pass ID" };
    }

    const { error } = await supabaseAdmin
        .from("pass_info_cache")
        .delete()
        .eq("id", passID.trim());

    if (error) {
        return { success: false, result: null, error: error.message };
    }

    return { success: true, result: null, error: null };
}

/**
 * Upsert (update if exists, insert if not) a pass entry in pass_info_cache.
 */
export async function upsertCachedPass(pass: SolsticePassInfo): Promise<Result<null>> {
    if (!pass.id.trim()) {
        return { success: false, result: null, error: "Invalid pass ID" };
    }

    const { error } = await supabaseAdmin
        .from("pass_info_cache")
        .upsert([pass], { onConflict: "id" });

    if (error) {
        return { success: false, result: null, error: error.message };
    }

    return { success: true, result: null, error: null };
}

export async function synchEventPassMap() {
    const passes = await getAllPasses();
    if (passes == null) { return; }
    for (const p of passes) {
        
    }
}