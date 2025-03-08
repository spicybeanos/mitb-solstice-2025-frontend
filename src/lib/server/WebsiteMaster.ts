import { supabase } from "./supabseClient";

export interface EventMedia {
    thumbnail: string,
    background: string,
    rulebook: string
}

export async function getEventMedia(eventID: string): Promise<EventMedia> {
    const { data, error } = await supabase
        .from('EventMedia') // Table name
        .select('thumbnail, background, rulebook')
        .eq('eventID', eventID.trim())
        .single(); // Fetch a single row since eventID is unique

    // Default values
    const defaultEvent = {
        thumbnail: 'https://i.imgur.com/fLZJH60.jpg',
        background: 'https://i.imgur.com/fLZJH60.jpg',
        rulebook: 'https://drive.google.com/file/d/12D-FxdrX6WiWRpa1zu22EJRzwxJLNd3J/view?usp=drive_link'
    };

    if (error || !data) {
        console.warn(`Event ${eventID} not found, using default values. error: ${JSON.stringify(error)}`);
        return defaultEvent
    }

    return data
}

export async function changeEventMedia(eventID: string, media: EventMedia) {
    if (!eventID) {
        return { succuss: false, error: 'eventID is required' };
    }

    const { error } = await supabase
        .from('EventMedia')
        .update({
            thumbnail: media.thumbnail || 'https://i.imgur.com/fLZJH60.jpg',
            background: media.background || 'https://i.imgur.com/fLZJH60.jpg',
            rulebook: media.rulebook || 'https://drive.google.com/file/d/12D-FxdrX6WiWRpa1zu22EJRzwxJLNd3J/view?usp=drive_link'
        })
        .eq('eventID', eventID);

    if (error) {
        return { succuss: false, error: error.message };
    }

    return { success: true };
}