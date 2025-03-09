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
}

/** Default event media values */
const defaultEvent: Omit<EventMedia, 'eventID'> = {
    thumbnail: 'https://i.imgur.com/fLZJH60.jpg',
    background: 'https://i.imgur.com/fLZJH60.jpg',
    rulebook: 'https://drive.google.com/file/d/12D-FxdrX6WiWRpa1zu22EJRzwxJLNd3J/view?usp=drive_link'
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
        .select('eventID, thumbnail, background, rulebook')
        .eq('eventID', eventID.trim())
        .single();

    if (error || !data) {
        console.warn(`Event ${eventID} not found, using default values. Error: ${error?.message}`);
        return { success: false, result: { eventID, ...defaultEvent }, error: error?.message || "Event not found" };
    }

    return { success: true, result: data, error: null };
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
            rulebook: media.rulebook ?? defaultEvent.rulebook
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
            rulebook: media.rulebook || defaultEvent.rulebook
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
