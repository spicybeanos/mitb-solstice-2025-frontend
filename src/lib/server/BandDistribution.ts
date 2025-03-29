import type { Result } from "./Backend";
import { supabaseAdmin } from "./supabaseServer";

/**
 * Structure for Proshow Bands Table
 */
export interface ProshowBandRow {
    user_id: string;
    time: string; // Using string to store timestampz
    given_by: string;
}

/**
 * Add a new proshow band entry.
 */
export async function addProshowBand(band: ProshowBandRow): Promise<Result<void>> {
    if (!band.user_id.trim()) {
        return { success: false, result: null, error: "Invalid user ID" };
    }

    const { error } = await supabaseAdmin
        .from("proshow_bands")
        .insert([band]);

    if (error) {
        return { success: false, result: null, error: error.message };
    }

    return { success: true, result: null, error: null };
}

/**
 * Check if a proshow band entry exists for a given user_id and return full details.
 */
export async function getProshowBand(userID: string): Promise<Result<ProshowBandRow | null>> {
    if (!userID.trim()) {
        return { success: false, result: null, error: "Invalid user ID" };
    }

    const { data, error } = await supabaseAdmin
        .from("proshow_bands")
        .select("*")
        .eq("user_id", userID.trim())
        .maybeSingle();

    if (error) {
        return { success: false, result: null, error: error.message };
    }

    if (data) {
        return { 
            success: true, 
            result: { 
                ...data, 
                time: new Date(data.time).toISOString() // ✅ Ensure it's in a proper Date format
            }, 
            error: null 
        };
    }

    return { success: true, result: null, error: null };
}
