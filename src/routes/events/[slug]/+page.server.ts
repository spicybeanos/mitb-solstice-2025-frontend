import { getEventID, getEventInfo, getEvents, getTeams, getUsersInEvent, getUserTeamIDInEvent } from '$lib/components/backend/BackendAgentEvent.js';
import { createTeamAndAttach, getTeamDetails } from '$lib/components/backend/BackendAgentTeam.js';
import { getUserId, getUserInfo } from '$lib/components/backend/BackendAgentUser.js';
import { getUserObjectFromJWT, verifyGJWT } from '$lib/components/GAuth.js';
import { fail, json, redirect } from '@sveltejs/kit';

export const load = async ({ params, cookies }) => {

    const eventID = params.slug;
    if (eventID == null) redirect(300, '/events');
    const token = cookies.get('authToken');
    if (token == null) redirect(300, '/profile');
    const guser = getUserObjectFromJWT(token);
    const userID = await getUserId(guser.email);
    if (userID == null) { redirect(300, '/profile'); }

    const userData = await getUserInfo(userID);
    if(userData == null) {redirect(300, '/profile'); }
       


    const teamID = await getUserTeamIDInEvent(userID, eventID);
    let is_in_team = teamID == null;
    let team = teamID != null ? await getTeamDetails(teamID) : null;
    const events = await getEvents();
    if (events == null) { redirect(300, '/') }
    return {
        slug: eventID,
        in_team: is_in_team, 
        team: team,
        events: events
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

        const ver = await verifyGJWT(jwt);
        if (ver.result == false) return fail(401, { msg: 'google auth failed! log in again!' });
        const eventId = params.slug;
        const hostID = await getUserId(ver.object?.email as string);

        if (eventId == null) return fail(400, { msg: 'event id is null!' });
        if (hostID == null) return fail(400, { msg: 'host id is null!' });

        const teams = await getTeams(eventId);
        if (teams != null) {
            teams.forEach(t => {
                if (t.host_id == hostID) { return fail(409,{msg:"You're already in a team!"}); }
            });
        }

        const users = await getUsersInEvent(eventId);
        if (users != null) {
            users.forEach(us => {
                if (us == hostID) { return fail(409,{msg:"You're already in a team!"}); }
            });
        }

        const teamMade = await createTeamAndAttach(teamName as string, hostID, eventId);
        if (teamMade == null) { return fail(500,{msg:"Failed to make a team!"}); }
        console.log(`team made! ${teamMade.id}: ${teamMade.name} by ${teamMade.host_id}`)
        return { team: teamMade };
    }
}