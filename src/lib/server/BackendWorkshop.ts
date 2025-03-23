import type { Result } from "./Backend";
import type { Workshop } from "./BackendTypes";
import { supabaseAdmin } from "./supabaseServer";

/**
 * Fetch a single workshop by ID.
 */
export async function getWorkshop(id: string): Promise<Result<Workshop>> {
    if (!id.trim()) {
        return { success: false, result: null, error: "Invalid workshop ID" };
    }

    const { data, error } = await supabaseAdmin
        .from("workshop")
        .select("id, name, description, venue, club, date_from, date_to, image_url")
        .eq("id", id.trim())
        .single();

    if (error || !data) {
        return { success: false, result: null, error: error?.message || "Workshop not found" };
    }

    return { success: true, result: data, error: null };
}

/**
 * Fetch all workshops.
 */
export async function getAllWorkshops(): Promise<Result<Workshop[]>> {
    const { data, error } = await supabaseAdmin
        .from("workshop")
        .select("id, name, description, venue, club, date_from, date_to, image_url");

    if (error || !data) {
        return { success: false, result: null, error: error?.message || "No workshops found" };
    }

    return { success: true, result: data, error: null };
}

/**
 * Insert a new workshop.
 */
export async function addWorkshop(workshop: Workshop): Promise<Result<null>> {
    const { error } = await supabaseAdmin.from("workshop").insert([workshop]);

    if (error) {
        return { success: false, result: null, error: error.message };
    }

    return { success: true, result: null, error: null };
}

/**
 * Update a workshop by ID.
 */
export async function updateWorkshop(id: string, updates: Partial<Workshop>): Promise<Result<null>> {
    if (!id.trim()) {
        return { success: false, result: null, error: "Invalid workshop ID" };
    }

    const { error } = await supabaseAdmin
        .from("workshop")
        .update(updates)
        .eq("id", id.trim());

    if (error) {
        return { success: false, result: null, error: error.message };
    }

    return { success: true, result: null, error: null };
}

/**
 * Delete a workshop by ID.
 */
export async function deleteWorkshop(id: string): Promise<Result<null>> {
    if (!id.trim()) {
        return { success: false, result: null, error: "Invalid workshop ID" };
    }

    const { error } = await supabaseAdmin
        .from("workshop")
        .delete()
        .eq("id", id.trim());

    if (error) {
        return { success: false, result: null, error: error.message };
    }

    return { success: true, result: null, error: null };
}