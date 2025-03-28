import { error } from "@sveltejs/kit";
import { get, post, patch, del, type Result } from "./Backend.ts";
import { getUsersInTeam } from "./BackendAgentTeam.ts";
import type { EventImages, SolsticeEventInfo, SolsticeEventRegRow, SolsticePassInfo, SolsticeTeamInfo, SolsticeUser, UpdateEvent, UserID } from "./BackendTypes.ts";
import { supabaseAdmin } from "./supabaseServer.ts";

let serverEvents: SolsticeEventInfo[] = [];
export const eventsRegistrationOn = false;

export async function getEventRegisTable(eventID: string): Promise<SolsticeEventRegRow[] | null> {
    const teams = await getTeams(eventID);
    if (!teams) return null;


    let rows: SolsticeEventRegRow[] = [];

    for (const t of teams) {
        const usrs = await getUsersInTeam(t.id);
        if (usrs) {
            for (const u of usrs) {
                console.log(`User : ${u.first_name} ${u.last_name}`);
                rows.push({
                    player_email: u.email_address,
                    player_name: `${u.first_name} ${u.last_name}`,
                    player_phno: u.phone_number ?? "none",
                    team_name: t.name,
                    player_reg: u.mahe_registration_number !== null ? `${u.mahe_registration_number}` : "none",
                    is_captain: u.id == t.host_id
                });
            }
        }
    }

    return rows;
}

export async function getEvents(): Promise<SolsticeEventInfo[] | null> {
    const res = await getAllCachedEvents();
    return res.success ? res.result : null;
    // const res = await get<SolsticeEventInfo[]>("event/");
    // if (res.success) {
    //     serverEvents = res.result as SolsticeEventInfo[];
    //     return serverEvents;
    // }
    // return null;

}

export async function synchronizeSupabaseEvents() {
    const apiEvents = await getEvents();
    let erros = []
    if (apiEvents != null) {
        for (const e of apiEvents) {
            const res = await upsertCachedEvent(e);
            if (res.error != null) {
                erros.push(res.error)
            }
        }
    }

    return erros;
}

/**
 * Fetch a single cached event by ID.
 */
export async function getCachedEvent(id: string): Promise<Result<SolsticeEventInfo>> {
    if (!id.trim()) {
        return { success: false, result: null, error: "Invalid event ID" };
    }

    const { data, error } = await supabaseAdmin
        .from("events_info_cache")
        .select("id, name, description, type, team_members, start, venue, organizer_id")
        .eq("id", id.trim())
        .single();

    if (error || !data) {
        return { success: false, result: null, error: error?.message || "Event not found" };
    }

    return { success: true, result: data, error: null };
}

/**
 * Fetch all cached events.
 */
export async function getAllCachedEvents(): Promise<Result<SolsticeEventInfo[]>> {
    const { data, error } = await supabaseAdmin
        .from("events_info_cache")
        .select("id, name, description, type, team_members, start, venue, organizer_id");

    if (error || !data) {
        return { success: false, result: null, error: error?.message || "No events found" };
    }

    return { success: true, result: data, error: null };
}

/**
 * Insert a new cached event.
 */
export async function addCachedEvent(event: SolsticeEventInfo): Promise<Result<null>> {
    const { error } = await supabaseAdmin.from("events_info_cache").insert([event]);

    if (error) {
        return { success: false, result: null, error: error.message };
    }

    return { success: true, result: null, error: null };
}

/**
 * Upsert (update if exists, insert if not) a cached event.
 */
export async function upsertCachedEvent(event: SolsticeEventInfo): Promise<Result<null>> {
    if (!event.id.trim()) {
        return { success: false, result: null, error: "Invalid event ID" };
    }

    const { error } = await supabaseAdmin
        .from("events_info_cache")
        .upsert([event], { onConflict: "id" }); // Ensure unique id constraint

    if (error) {
        return { success: false, result: null, error: error.message };
    }

    return { success: true, result: null, error: null };
}

/**
 * Delete a cached event by ID.
 */
export async function deleteCachedEvent(id: string): Promise<Result<null>> {
    if (!id.trim()) {
        return { success: false, result: null, error: "Invalid event ID" };
    }

    const { error } = await supabaseAdmin
        .from("events_info_cache")
        .delete()
        .eq("id", id.trim());

    if (error) {
        return { success: false, result: null, error: error.message };
    }

    return { success: true, result: null, error: null };
}

export async function getEventID(eventName: string): Promise<string | null> {

    if (!serverEvents.length) await getEvents();
    return serverEvents.find(ev => ev.name === eventName)?.id ?? null;
}

export async function getUserIDsInEvent(eventId: string): Promise<UserID[] | null> {
    const teams = await getTeams(eventId);
    if (!teams) return null;

    let users: UserID[] = [];

    for (const t of teams) {
        users.push(t.host_id);
        const usrs = await getUsersInTeam(t.id);
        if (usrs) {
            users.push(...usrs.map(u => u.id));
        }
    }

    return users;
}

export async function getUserInfosInEvent(eventId: string): Promise<SolsticeUser[] | null> {
    const teams = await getTeams(eventId);
    if (!teams) return null;

    let users: SolsticeUser[] = [];

    for (const t of teams) {
        const usrs = await getUsersInTeam(t.id);
        if (usrs) {
            users.push(...usrs);
        }
    }

    return users;
}

export async function updateEventDetails(eventID: string, info: UpdateEvent) {
    const res = await patch(`event/${eventID}`, info);
    for (let i = 0; i < serverEvents.length; i++) {
        if (serverEvents[i].id == eventID) {
            serverEvents[i] = { ...info, id: eventID };
        }
    }
    const body = await res.error
    const c = await upsertCachedEvent({ id: eventID, ...info })
    if (c.error != null) {
        return { success: false, error: c.error, result: null }
    } else {
        if (res.success) return { success: true };
    }
    return { success: false, error: body, code: 500 };
}

export async function createEvent(info: UpdateEvent) {
    const res = await post<SolsticeEventInfo>(`event/`, info);

    if (res.success) {
        if (res.result != null) { serverEvents.push(res.result); addCachedEvent(res.result); }

        return { success: true, result: res.result };
    }
    const body = await res.error
    return { success: false, error: body, code: 500 };
}

export async function getUser_s_TeamIDInEvent(userID: string, eventID: string): Promise<string | null> {
    const teams = await getTeams(eventID);
    if (!teams) return null;

    for (const t of teams) {
        const usrs = await getUsersInTeam(t.id);
        if (usrs && usrs.some(u => u.id === userID)) {
            return t.id;
        }
    }

    return null;
}
export async function getEventPasses(eventID: string) {
    return await get<SolsticePassInfo[]>(`event/${eventID}/passes`);
}
export async function addEventPass(eventID: string, passID: string) {
    return await post<string>(`event/${eventID}/passes/${passID}`);
}
export async function delEventPass(eventID: string, passID: string) {
    return await del<string>(`event/${eventID}/passes/${passID}`);
}

export async function getHost_sTeamInfo(hostID: string, eventID: string): Promise<SolsticeTeamInfo | null> {
    const teams = await getTeams(eventID);
    if (!teams) return null;

    for (const team of teams) {
        if (team.host_id == hostID) {
            return team;
        }
    }

    return null;
}

export async function getEventInfo(eventId: string): Promise<SolsticeEventInfo | null> {
    const res = await getCachedEvent(eventId);
    return res.success ? res.result : null;
    // const res = await get(`event/${eventId}`);
    // return res.success ? (await res.result) as SolsticeEventInfo : null;
}
export async function deleteEvent(eventId: string): Promise<SolsticeEventInfo | null> {
    const res = await del(`event/${eventId}`);
    deleteCachedEvent(eventId)
    return res.success ? (await res.result) as SolsticeEventInfo : null;
}

export async function getEventImages(eventID: string): Promise<EventImages> {
    if (!eventID) throw new Error('eventID is required');

    const { data, error } = await supabaseAdmin
        .from('EventImages')
        .select('thumbnail, background')
        .eq('eventID', eventID)
        .single(); // Expecting only one row

    if (error) {
        console.error('Error fetching event images:', error);
        throw new Error(error.message);
    }

    if (!data) {
        throw new Error('Event not found');
    }

    return data;
}

export async function getTeams(eventId: string): Promise<SolsticeTeamInfo[] | null> {
    const res = await get(`event/${eventId}/teams`);
    return res.success ? (await res.result) as SolsticeTeamInfo[] : null;
}

export async function addTeamToEvent(eventId: string, teamId: string): Promise<string | null> {
    const res = await post(`event/${eventId}/teams/${teamId}`);
    if (res.success == false) {
        console.log(`Could not attach to event: ${res.error}`)
    }
    return res.success ? (await res.result) as string : null;
}

export async function removeTeamFromEvent(eventId: string, teamId: string): Promise<string | null> {
    const res = await del(`event/${eventId}/teams/${teamId}/]`);
    return res.success ? (await res.result) as string : null;
}
