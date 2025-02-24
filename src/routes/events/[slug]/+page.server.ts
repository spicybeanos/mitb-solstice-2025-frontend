import { verifyAndGetUser } from '$lib/components/backend/Backend.js';
import { getEventID, getEventInfo, getEvents, getTeams, getUserIDsInEvent, getUserTeamIDInEvent } from '$lib/components/backend/BackendAgentEvent.js';
import { checkEventAccesableByPass } from '$lib/components/backend/BackendAgentPass.js';
import { addUserToTeam, createTeamAndAttach, getTeamDetails, getUsersInTeam } from '$lib/components/backend/BackendAgentTeam.js';
import { getUserId, getUserInfo } from '$lib/components/backend/BackendAgentUser.js';
import { getUserObjectFromJWT, verifyGJWT } from '$lib/components/GAuth.js';
import { fail, json, redirect } from '@sveltejs/kit';

export const load = async ({ params, cookies }) => {

    const eventID = params.slug;
    if (eventID == null) redirect(300, '/events');
    const token = cookies.get('authToken');

    const user = await verifyAndGetUser(token);

    if(user.success == false){redirect(300, '/profile');}
    //this should NEVER happen
    if(user.result == null){redirect(300, '/profile');}

    const canAccess = await checkEventAccesableByPass(eventID, user.result.pass_id);
    console.log(`Access attempt for ${eventID} : ${canAccess}`)

    const teamID = await getUserTeamIDInEvent(user.result.id, eventID);
    let is_in_team = teamID == null;
    let team = teamID != null ? await getTeamDetails(teamID) : null;
    const events = await getEvents();
    if (events == null) { redirect(300, '/') }
    return {
        slug: eventID,
        in_team: is_in_team,
        team: team,
        events: events,
        canAccess: canAccess
    }
}

export const actions = {
    newTeam: async ({ cookies, request, params }) => {
        const form = await request.formData();
        const g_jwt = cookies.get('authToken');
        const teamName = form.get('team_name');

        if (teamName == undefined) return fail(400, { msg: 'team name not provided' });
        if (teamName == null) return fail(400, { msg: 'team name not provided' });

        if (g_jwt == undefined) return fail(401, { msg: 'google auth failed! log in again!' });
        if (g_jwt == null) return fail(401, { msg: 'google auth failed! log in again!' });
        const jwt = g_jwt as string;

        const ver = await verifyAndGetUser(jwt);
        if (ver.success == false) return fail(401, { msg: ver.error });
        const eventId = params.slug;
        const hostID = ver.result?.id;

        if (eventId == null) return fail(400, { msg: 'event id is null!' });
        if (hostID == null) return fail(400, { msg: 'host id is null!' });

        const teams = await getTeams(eventId);
        if (teams != null) {
            teams.forEach(t => {
                if (t.host_id == hostID) { return fail(409, { msg: "You're already in a team!" }); }
            });
        }

        const users = await getUserIDsInEvent(eventId);
        if (users != null) {
            users.forEach(us => {
                if (us == hostID) { return fail(409, { msg: "You're already in a team!" }); }
            });
        }

        const teamMade = await createTeamAndAttach(teamName as string, hostID, eventId);
        if (teamMade == null) { return fail(403, { msg: "Failed to make a team!" }); }
        console.log(`team made! ${teamMade.id}: ${teamMade.name} by ${teamMade.host_id}`)
        return { team: teamMade };
    },
    joinTeam: async ({ cookies, request, params }) => {
        const form = await request.formData();
        const g_jwt = cookies.get('authToken');
        const teamID = form.get('team_id') as string | null | undefined;

        if (teamID == undefined) return fail(400, { msg: 'team name not provided' });
        if (teamID == null) return fail(400, { msg: 'team name not provided' });

        const ver = await verifyAndGetUser(g_jwt);
        if (ver.success == false) return fail(401, { msg: ver.error });
        
        const userID = ver.result?.id;
        
        const eventId = params.slug;
        if (eventId == null) return fail(400, { msg: 'event id is null!' });
        if (userID == null) return fail(400, { msg: 'host id is null!' });

        const teams = await getTeams(eventId);
        if (teams != null) {
            teams.forEach(t => {
                if (t.host_id == userID) { return fail(409, { msg: "You're already in a team!" }); }
            });
        }

        const users = await getUserIDsInEvent(eventId);
        if (users != null) {
            users.forEach(us => {
                if (us == userID) { return fail(409, { msg: "You're already in a team!" }); }
            });
        }

        const eventDetails = await getEventInfo(eventId);
        if (eventDetails == null) { return fail(404, { msg: 'That event does not exist' }); }
        const teamDetails = await getTeamDetails(teamID as string);
        if (teamDetails == null) { return fail(404, { msg: 'That team does not exist' }); }

        const usersInTeam = await getUsersInTeam(teamID);
        if (usersInTeam != null) {
            if (eventDetails.team_members != null) {
                if (usersInTeam.length >= eventDetails.team_members) {
                    return fail(403, { msg: 'Team is full!' });
                }
            } else {
                return fail(403, { msg: 'This event has no events!' });
            }
        }

        const added = await addUserToTeam(teamID, userID);
        if (added == null) { return fail(403, { msg: 'Failed to add user to team!' }); }
        return { teamJoined: added };
    }
}