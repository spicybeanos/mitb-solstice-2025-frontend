import { verifyAndGetUser } from '$lib/server/Backend';
import { eventsRegistrationOn, getEventID, getEventInfo, getEventPasses, getEvents, getHost_sTeamInfo, getTeams, getUserIDsInEvent, getUser_s_TeamIDInEvent } from '$lib/server/BackendAgentEvent';
import { checkEventAccessibleByPass } from '$lib/server/BackendAgentPass';
import { addUserToTeam, createTeamAndAttach, disbandTeam, getAllTeams, getTeamDetails, getUsersInTeam, removeUserFromTeam } from '$lib/server/BackendAgentTeam';
import type { SolsticeUser } from '$lib/server/BackendTypes.js';
import { generateChecksum } from '$lib/server/CacheMaster.js';
import { getEventMedia, getMaxTeams, isEventRegistrationEnabled } from '$lib/server/WebsiteMaster';
import { error, fail, json, redirect } from '@sveltejs/kit';

export const load = async ({ params, cookies }) => {
    try {
        const eventID = params.slug;

        const media = await getEventMedia(eventID);


        if (eventID == null) redirect(300, '/events');
        const eventInfo = await getEventInfo(eventID);

        if (eventInfo == null) {
            error(404, 'Event not found');
        }
        const token = cookies.get('authToken');
        const userJson = cookies.get('userInfo');
        const checksum = cookies.get('userChecksum');
        const user = await verifyAndGetUser(token, userJson, checksum);

        if (user.success == false) {
            return {
                slug: eventID,
                event: eventInfo,
                media: media,
            }
        }

        //this should NEVER happen
        if (user.result == null) {
            return {
                slug: eventID,
                event: eventInfo,
                media: media,
            };
        }
        const canAccess = await checkEventAccessibleByPass(eventID, user.result.pass_id);
        const regEnabled = await isEventRegistrationEnabled();

        return {
            slug: eventID,
            event: eventInfo,
            media: media,
        }
    } catch (err) {
        error(503, 'Cannot fetch event details')
    }


}
