import { verifyAndGetUser } from '$lib/server/Backend';
import { getEventID, getEventInfo, getEvents, getHost_sTeamInfo, getTeams, getUserIDsInEvent, getUser_s_TeamIDInEvent } from '$lib/server/BackendAgentEvent';
import { checkEventAccessibleByPass } from '$lib/server/BackendAgentPass';
import { addUserToTeam, createTeamAndAttach, disbandTeam, getTeamDetails, getUsersInTeam, removeUserFromTeam } from '$lib/server/BackendAgentTeam';
import type { SolsticeUser } from '$lib/server/BackendTypes.js';
import { error, fail, json, redirect } from '@sveltejs/kit';

export const load = async ({ params, cookies }) => {
    try {
        const eventID = params.slug;
        if (eventID == null) redirect(300, '/events');
        const eventInfo = await getEventInfo(eventID);
        if (eventInfo == null) {
            error(404, 'Event not found');
        }
        const token = cookies.get('authToken');

        const user = await verifyAndGetUser(token);

        const events = await getEvents();
        if (events == null) { redirect(300, '/') }
        if (user.success == false) {
            return {
                slug: eventID,
                in_team: false,
                events: events,
                team: null,
                canAccess: false,
                isRegistered: false,
                isLeader: false,
                playersInTeam: [] as SolsticeUser[]
            }
        }

        //this should NEVER happen
        if (user.result == null) {
            return {
                slug: eventID,
                in_team: false,
                events: events,
                team: null,
                canAccess: false,
                isRegistered: false,
                isLeader: false,
                playersInTeam: [] as SolsticeUser[]
            };
        }

        const canAccess = await checkEventAccessibleByPass(eventID, user.result.pass_id);
        const teamID = await getUser_s_TeamIDInEvent(user.result.id, eventID);
        let is_in_team = teamID != null;
        let team = teamID != null ? await getTeamDetails(teamID) : null;
        let plr: SolsticeUser[] = [];
        if (team?.host_id == user.result.id) {
            const pls = await getUsersInTeam(team.id);
            if (pls != null) {
                for (const p of pls) {
                    plr.push(p);
                }
            }
        }

        return {
            slug: eventID,
            in_team: is_in_team,
            team: team,
            events: events,
            canAccess: canAccess,
            isRegistered: true,
            isLeader: team?.host_id == user.result.id,
            playersInTeam: plr
        }
    } catch (err) {
        error(503, 'Cannot fetch event details')
    }


}

export const actions = {
    newTeam: async ({ cookies, request, params }) => {
        try {
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

            if (eventId == null) return fail(400, { msg: 'event does not exist!' });
            if (hostID == null) return fail(400, { msg: 'host does not exist!' });

            const teams = await getTeams(eventId);
            if (teams != null) {
                for (const t of teams) {
                    if (t.host_id == hostID) { return fail(409, { msg: "You're already in a team!" }); }
                }
            }

            const users = await getUserIDsInEvent(eventId);
            if (users != null) {
                for (const us of users) {
                    if (us == hostID) { return fail(409, { msg: "You're already in a team!" }); }
                }

            }

            const teamMade = await createTeamAndAttach(teamName as string, hostID, eventId);
            if (teamMade == null) { return fail(403, { msg: "Failed to make a team!" }); }
            console.log(`team made! ${teamMade.id}: ${teamMade.name} by ${teamMade.host_id}`)
            return { team: teamMade };
        } catch (err) {
            return fail(500, { msg: `Failed to create team : ${err}` })
        }

    },
    joinTeam: async ({ cookies, request, params }) => {

        try {
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
                for (const t of teams) {
                    if (t.host_id == userID) { return fail(409, { msg: "You're already in a team!" }); }
                }
            }

            const users = await getUserIDsInEvent(eventId);
            if (users != null) {
                for (const us of users) {
                    if (us == userID) { return fail(409, { msg: "You're already in a team!" }); }
                }
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
                    return fail(403, { msg: 'This event has no teams!' });
                }
            }

            const added = await addUserToTeam(teamID, userID);
            if (added == null) { return fail(403, { msg: 'Failed to add user to team!' }); }
            return { teamJoined: added };
        } catch (err) {
            return fail(500, { msg: `Could not join team : ${err}` });

        }

    },
    disbandTeam: async ({ cookies, params }) => {
        try {
            const g_jwt = cookies.get('authToken');
            const ver = await verifyAndGetUser(g_jwt);
            if (ver.success == false) return fail(403, { msg: ver.error });
            const userID = ver.result?.id;

            const eventId = params.slug;
            if (eventId == null) return fail(400, { msg: 'event id is null!' });
            if (userID == null) return fail(400, { msg: 'host id is null!' });

            const team = await getHost_sTeamInfo(userID, eventId);
            if (team == null) return fail(400, { msg: 'You are not a host of any team in this event!' });
            await disbandTeam(team.id);

        } catch (err) {
            return fail(500, { msg: `Could not disband team : ${err}` });
        }
    },
    leaveTeam: async ({ cookies, params }) => {
        try {
            const g_jwt = cookies.get('authToken');
            const ver = await verifyAndGetUser(g_jwt);
            if (ver.success == false) return fail(403, { msg: ver.error });
            const userID = ver.result?.id;
            if (userID == null) { return fail(400, { msg: 'user does not exist!' }); }
            const eventId = params.slug;
            if (eventId == null) return fail(400, { msg: 'event id is null!' });
            const teamID = await getUser_s_TeamIDInEvent(userID, eventId);
            if (teamID == null) { return fail(400, { msg: 'user is not in any team!' }); }

            const res = await removeUserFromTeam(teamID, userID);
            if (res == null) { return fail(501, { msg: 'failed to leave team!' }); }
        } catch (err) {
            return fail(503, { msg: `service failure: ${err}` });
        }

    }
}