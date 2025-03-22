import { supabaseAdmin } from "./supabaseServer"; // Ensure correct import

/** Generic Result Type for API Responses */
export interface Result<T> {
    success: boolean;
    result: T | null;
    error: string | null;
}

/** Structure of EventMedia Table */
export interface EventMedia {
    eventID: string;
    thumbnail: string;
    background: string;
    rulebook: string;
    max_teams: number;
}

/** Default event media values */
export const defaultEvent: Omit<EventMedia, 'eventID'> = {
    thumbnail: 'https://i.imgur.com/fLZJH60.jpg',
    background: 'https://i.imgur.com/fLZJH60.jpg',
    rulebook: 'https://drive.google.com/file/d/12D-FxdrX6WiWRpa1zu22EJRzwxJLNd3J/view?usp=drive_link',
    max_teams: 1000
};

/**
 * Fetch event media details for a given eventID.
 */
export async function getEventMedia(eventID: string): Promise<Result<EventMedia>> {
    if (!eventID.trim()) {
        return { success: false, result: null, error: "Invalid eventID" };
    }

    const { data, error } = await supabaseAdmin
        .from('EventMedia')
        .select('eventID, thumbnail, background, rulebook, max_teams')
        .eq('eventID', eventID.trim())
        .single();

    if (error || !data) {
        console.warn(`Event ${eventID} not found, using default values. Error: ${error?.message}`);
        return { success: false, result: { eventID, ...defaultEvent }, error: error?.message || "Event not found" };
    }

    return { success: true, result: data, error: null };
}
/**
 * Fetch event media details for multiple eventIDs.
 */
export async function getMultipleEventMedia(eventIDs: string[]): Promise<Result<EventMedia[]>> {
    if (!Array.isArray(eventIDs) || eventIDs.length === 0) {
        return { success: false, result: null, error: "Invalid eventIDs array" };
    }

    const { data, error } = await supabaseAdmin
        .from('EventMedia')
        .select('eventID, thumbnail, background, rulebook,max_teams')
        .in('eventID', eventIDs.map(id => id.trim())); // Use .in() for multiple IDs

    if (error) {
        console.warn(`Error fetching event media for multiple eventIDs: ${error.message}`);
        return { success: false, result: [], error: error.message };
    }

    // Fill missing eventIDs with default data
    const eventDataMap = new Map(data.map((event) => [event.eventID, event]));
    const completeData = eventIDs.map(id => eventDataMap.get(id) || { eventID: id, ...defaultEvent });

    return { success: true, result: completeData, error: null };
}
/**
 * Update event media details for a given eventID.
 */
export async function changeEventMedia(eventID: string, media: Partial<EventMedia>): Promise<Result<null>> {
    if (!eventID.trim()) {
        return { success: false, result: null, error: 'eventID is required' };
    }

    const { error } = await supabaseAdmin
        .from('EventMedia')
        .update({
            thumbnail: media.thumbnail ?? defaultEvent.thumbnail,
            background: media.background ?? defaultEvent.background,
            rulebook: media.rulebook ?? defaultEvent.rulebook,
            max_teams:media.max_teams ?? defaultEvent.max_teams
        })
        .eq('eventID', eventID.trim());

    if (error) {
        return { success: false, result: null, error: error.message };
    }

    return { success: true, result: null, error: null };
}

/**
 * Add a new event media entry.
 */
export async function addEventMedia(eventID: string, media: Partial<EventMedia>): Promise<Result<null>> {
    if (!eventID.trim()) {
        return { success: false, result: null, error: 'eventID is required' };
    }

    const { error } = await supabaseAdmin
        .from('EventMedia')
        .insert([{
            eventID: eventID.trim(),
            thumbnail: media.thumbnail || defaultEvent.thumbnail,
            background: media.background || defaultEvent.background,
            rulebook: media.rulebook || defaultEvent.rulebook,
            max_teams:media.max_teams || defaultEvent.max_teams
        }]);

    if (error) {
        return { success: false, result: null, error: error.message };
    }

    return { success: true, result: null, error: null };
}

/**
 * Delete an event media entry.
 */
export async function deleteEventMedia(eventID: string): Promise<Result<null>> {
    if (!eventID.trim()) {
        return { success: false, result: null, error: 'eventID is required' };
    }

    const { error } = await supabaseAdmin
        .from('EventMedia')
        .delete()
        .eq('eventID', eventID.trim());

    if (error) {
        return { success: false, result: null, error: error.message };
    }

    return { success: true, result: null, error: null };
}


export async function isEventRegistrationEnabled(): Promise<Result<boolean>> {
    const { data, error } = await supabaseAdmin
        .from('website_properties')
        .select('value')
        .eq('name', 'enable_event_registration')
        .single();

    if (error || !data) {
        console.warn(`Error fetching enable_event_registration: ${error?.message || "Property not found"}`);
        return { success: false, result: false, error: error?.message || "Property not found" };
    }

    return { success: true, result: data.value === 'true', error: null };
}

/**
 * Update the enable_event_registration property.
 * @param enabled - Boolean indicating whether event registration should be enabled or disabled.
 */
export async function setEventRegistrationEnabled(enabled: boolean): Promise<Result<null>> {
    const updateData = { name: 'enable_event_registration', value: enabled ? 'true' : 'false' };

    const { error } = await supabaseAdmin
        .from('website_properties')
        .upsert([updateData], { onConflict: 'name' }); // <-- Fixed: Pass 'name' as a string, not an array

    if (error) {
        console.error(`Error updating enable_event_registration: ${error.message}`);
        return { success: false, result: null, error: error.message };
    }

    return { success: true, result: null, error: null };
}

/**
 * Fetch the max_teams value for a given eventID.
 * @param eventID - The ID of the event.
 * @returns A Result object containing the max_teams value or an error.
 */
export async function getMaxTeams(eventID: string): Promise<Result<number>> {
    if (!eventID.trim()) {
        return { success: false, result: null, error: "Invalid eventID" };
    }

    const { data, error } = await supabaseAdmin
        .from('EventMedia')
        .select('max_teams')
        .eq('eventID', eventID.trim())
        .single();

    if (error || !data) {
        console.error(`Error fetching max_teams for eventID ${eventID}: ${error?.message || "Event not found"}`);
        return { success: false, result: null, error: error?.message || "Event not found" };
    }

    return { success: true, result: data.max_teams, error: null };
}
/**
 * Update the max_teams value for a given eventID.
 * @param eventID - The ID of the event.
 * @param maxTeams - The new max_teams value.
 * @returns A Result object indicating success or failure.
 */
export async function updateMaxTeams(eventID: string, maxTeams: number): Promise<Result<null>> {
    if (!eventID.trim()) {
        return { success: false, result: null, error: "Invalid eventID" };
    }

    if (!Number.isInteger(maxTeams) || maxTeams < 1) {
        return { success: false, result: null, error: "maxTeams must be a positive integer" };
    }

    const { error } = await supabaseAdmin
        .from('EventMedia')
        .update({ max_teams: maxTeams })
        .eq('eventID', eventID.trim());

    if (error) {
        console.error(`Error updating max_teams for eventID ${eventID}: ${error.message}`);
        return { success: false, result: null, error: error.message };
    }

    return { success: true, result: null, error: null };
}
