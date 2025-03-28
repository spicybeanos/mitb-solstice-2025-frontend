import { verifyAndGetUser } from "$lib/server/Backend";
import { eventsRegistrationOn, getEventInfo, getEventPasses, getHost_sTeamInfo, getTeams, getUser_s_TeamIDInEvent, getUserIDsInEvent } from "$lib/server/BackendAgentEvent";
import { checkEventAccessibleByPass } from "$lib/server/BackendAgentPass";
import { addUserToTeam, createTeamAndAttach, disbandTeam, getAllMembers, getAllTeams, getTeamDetails, getUsersInTeam, removeUserFromTeam } from "$lib/server/BackendAgentTeam";
import type { SolsticePassInfo } from "$lib/server/BackendTypes";
import { generateChecksum } from "$lib/server/CacheMaster";
import { getMaxTeams, isEventRegistrationEnabled } from "$lib/server/WebsiteMaster";
import { fail, redirect } from "@sveltejs/kit";

export async function load({ cookies, params }) {
    try {
        let registrationEnabled = false;
        let canAccessEvent = false;
        let eventPasses = [] as SolsticePassInfo[];
        let isRegistered = false;

        const eventInfo = await getEventInfo(params.slug);
        if (eventInfo == null) { redirect(308, '/events'); }

        const userInfo = await verifyAndGetUser(cookies.get('authToken'), null, null);
        if (!userInfo.success) {
            isRegistered = false;
        } else {
            isRegistered = true;
        }
        const regisEnabl = await isEventRegistrationEnabled();
        if (regisEnabl.success == false || regisEnabl.result == null) {
            redirect(308, '/events')
        }
        registrationEnabled = regisEnabl.result;

        const evps = await getEventPasses(params.slug);
        if (evps.success == false) {
            redirect(308, '/events');
        }
        if (evps.result == null) {
            canAccessEvent = true;
            eventPasses = [];
        } else {
            eventPasses = evps.result;
            for (const ev of evps.result) {
                if (userInfo.result?.pass_id == ev.id) {
                    canAccessEvent = true;
                    break;
                }
            }
        }

        console.log(JSON.stringify({
            canAccessEvent: canAccessEvent,
            registrationEnabled: registrationEnabled,
            eventPasses: eventPasses,
            isRegistered: isRegistered
        }))

        return {
            canAccessEvent: eventPasses.length > 0 ? canAccessEvent : true,
            registrationEnabled: registrationEnabled,
            eventPasses: eventPasses,
            isRegistered: isRegistered,
            eventID: params.slug,
            userID: userInfo.result?.id
        }

    } catch (exc) {

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

            const userJson = cookies.get('userInfo');
            const checksum = cookies.get('userChecksum');
            const ver = await verifyAndGetUser(jwt, userJson, checksum);


            if (ver.success == false) return fail(401, { msg: ver.error });
            if (ver.result == null) { return fail(401, { msg: 'null user' }); }

            if (userJson == null || checksum == null) {
                cookies.set('userInfo', JSON.stringify(ver.result), {
                    httpOnly: false, // Accessible by frontend
                    secure: true,
                    sameSite: "strict",
                    path: "/",
                    maxAge: 3600
                });
                cookies.set('userChecksum', generateChecksum(ver.result), {
                    httpOnly: false, // Accessible by frontend
                    secure: true,
                    sameSite: "strict",
                    path: "/",
                    maxAge: 3600
                })
            }

            const eventId = params.slug;
            const hostID = ver.result?.id;

            if (eventId == null) return fail(400, { msg: 'event does not exist!' });
            if (hostID == null) return fail(400, { msg: 'host does not exist!' });

            const teams = await getTeams(eventId);
            const allMem = await getAllMembers(eventId);
            // const allteams = await getAllTeams();
            if (teams != null) {
                for (const t of teams) {
                    if (t.host_id == hostID) { return fail(409, { msg: "You're already in a team!" }); }
                }

            }

            const max_teams = await getMaxTeams(params.slug);
            if (max_teams.success == false || max_teams.result == null) {
                return fail(503, { msg: 'Teams service is unavailaible! Submit a ticket or contact the admins! error:' + max_teams.error })
            }

            if (allMem.success == false) { return fail(503, { msg: 'Teams service is unavailaible! Submit a ticket or contact the admins! error:' + allMem.error }) }
            if (allMem.result != null) {
                if (Object.keys(allMem.result).length >= max_teams.result) {
                    return fail(409, { msg: "Event full!" });
                }
                for (const key of Object.keys(allMem.result)) {
                    if(teamName == key){
                        return fail(409, { msg: "A team with that name already exists!" });
                    }
                }
            }

            const users = await getUserIDsInEvent(eventId);
            if (users != null) {
                for (const us of users) {
                    if (us == hostID) { return fail(409, { msg: "You're already in a team!" }); }
                }

            }

            const regEnabled = await isEventRegistrationEnabled();
            if (regEnabled.success == false || regEnabled.result == false) {
                return fail(400, { msg: 'registrations for this event arent open yet!' })
            }

            const res_team = await createTeamAndAttach(teamName as string, hostID, eventId);
            if (res_team.success == false) { return fail(403, { msg: "Failed to make a team!" + res_team.error }); }
            const teamMade = res_team.result;
            if (teamMade == null) { return fail(403, { msg: "Failed to make a team! is null!" }); }
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

            const userJson = cookies.get('userInfo');
            const checksum = cookies.get('userChecksum');
            const ver = await verifyAndGetUser(g_jwt, userJson, checksum);
            

            if (ver.success == false) return fail(401, { msg: ver.error });
            if (ver.result == null) return fail(401, { msg: 'null user' });

            const userID = ver.result?.id;

            // if (userJson == null || checksum == null) {
            //     cookies.set('userInfo', JSON.stringify(ver.result), {
            //         httpOnly: false, // Accessible by frontend
            //         secure: true,
            //         sameSite: "strict",
            //         path: "/"
            //     });
            //     cookies.set('userChecksum', generateChecksum(ver.result), {
            //         httpOnly: false, // Accessible by frontend
            //         secure: true,
            //         sameSite: "strict",
            //         path: "/",
            //         maxAge: 3600
            //     })
            // }

            const eventId = params.slug;
            if (eventId == null) return fail(400, { msg: 'event id is null!' });
            if (userID == null) return fail(400, { msg: 'host id is null!' });

            // const teams = await getTeams(eventId);

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

            const regEnabled = await isEventRegistrationEnabled();
            if (regEnabled.success == false || regEnabled.result == false) {
                return fail(400, { msg: 'registrations for this event arent open yet!' })
            }
            if (ver.result.mahe_registration_number == null) {
                const added = await addUserToTeam(teamID, userID);
                if (added == null) { return fail(403, { msg: 'Failed to add user to team!' }); }
                return { teamJoined: added };
            } else {
                const canAccess = await checkEventAccessibleByPass(eventDetails.id, ver.result.pass_id);
                if (canAccess) {
                    const added = await addUserToTeam(teamID, userID);
                    if (added == null) { return fail(403, { msg: 'Failed to add user to team!' }); }
                    return { teamJoined: added };
                } else {
                    return fail(403, { msg: 'You must have a pass to join a team in this event!' });
                }
            }
        } catch (err) {
            return fail(500, { msg: `Could not join team : ${err}` });

        }

    },
    disbandTeam: async ({ cookies, params }) => {
        try {
            const g_jwt = cookies.get('authToken');
            const userJson = cookies.get('userInfo');
            const checksum = cookies.get('userChecksum');
            const ver = await verifyAndGetUser(g_jwt, userJson, checksum);
            if (userJson == null || checksum == null) {
                const user = await verifyAndGetUser(cookies.get('authToken'), userJson, checksum);
                if (user.result != null) {
                    cookies.set('userInfo', JSON.stringify(user.result), {
                        httpOnly: false, // Accessible by frontend
                        secure: true,
                        sameSite: "strict",
                        path: "/",
                        maxAge: 3600
                    });
                    cookies.set('userChecksum', generateChecksum(user.result), {
                        httpOnly: false, // Accessible by frontend
                        secure: true,
                        sameSite: "strict",
                        path: "/",
                        maxAge: 3600
                    });
                }
            }
            if (ver.success == false) return fail(403, { msg: ver.error });
            if (ver.result == null) return fail(403, { msg: 'user is null' });
            const userID = ver.result?.id;

            if (userJson == null || checksum == null) {
                cookies.set('userInfo', JSON.stringify(ver.result), {
                    httpOnly: false, // Accessible by frontend
                    secure: true,
                    sameSite: "strict",
                    path: "/",
                    maxAge: 3600
                });
                cookies.set('userChecksum', generateChecksum(ver.result), {
                    httpOnly: false, // Accessible by frontend
                    secure: true,
                    sameSite: "strict",
                    path: "/",
                    maxAge: 3600
                })
            }

            const eventId = params.slug;
            if (eventId == null) return fail(400, { msg: 'event id is null!' });
            if (userID == null) return fail(400, { msg: 'host id is null!' });

            const team = await getHost_sTeamInfo(userID, eventId);
            if (team == null) return fail(400, { msg: 'You are not a host of any team in this event!' });
            const res = await disbandTeam(team.id);


        } catch (err) {
            return fail(500, { msg: `Could not disband team : ${err}` });
        }
    },
    leaveTeam: async ({ cookies, params }) => {
        try {
            const g_jwt = cookies.get('authToken');
            const userJson = cookies.get('userInfo');
            const checksum = cookies.get('userChecksum');
            const ver = await verifyAndGetUser(g_jwt, userJson, checksum);
            if (ver.success == false) return fail(403, { msg: ver.error });
            if (ver.result == null) return fail(403, { msg: 'null user' });

            if (userJson == null || checksum == null) {
                cookies.set('userInfo', JSON.stringify(ver.result), {
                    httpOnly: false, // Accessible by frontend
                    secure: true,
                    sameSite: "strict",
                    path: "/",
                    maxAge: 3600
                });
                cookies.set('userChecksum', generateChecksum(ver.result), {
                    httpOnly: false, // Accessible by frontend
                    secure: true,
                    sameSite: "strict",
                    path: "/",
                    maxAge: 3600
                })
            }
            const userID = ver.result?.id;
            if (userID == null) { return fail(400, { msg: 'user does not exist!' }); }
            const eventId = params.slug;
            if (eventId == null) return fail(400, { msg: 'event id is null!' });
            const teamID = await getUser_s_TeamIDInEvent(userID, eventId);
            if (teamID == null) { return fail(400, { msg: 'user is not in any team!' }); }

            const res = await removeUserFromTeam(teamID, userID);
            if (res == null) { return fail(501, { msg: 'failed to leave team!' }); }

            console.log('Left team!')
        } catch (err) {
            return fail(503, { msg: `service failure: ${err}` });
        }

    }
}