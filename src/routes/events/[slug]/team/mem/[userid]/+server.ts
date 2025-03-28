import { getAllMembers, getTeamDetails } from '$lib/server/BackendAgentTeam.js';
import type { SolsticeUser } from '$lib/server/BackendTypes';
import { json } from '@sveltejs/kit';


export async function GET({ params }) {
    try {
        const eventID = params.slug;
        const userID = params.userid;

        //check if userID is in event's teams' users
        const teams = await getAllMembers(eventID);
        if (teams.success != true) {
            return json({ error: "Could not fetch teams:" + teams.error }, { status: 404 })
        }
        if (teams.result == null) {
            return json({ inTeam: false, teamID: null }, { status: 200 })
        }
        let inTeam = false;
        let teamID = null;
        for (const key of Object.keys(teams.result)) {
            console.log(`Category: ${key}`);
            for (const person of teams.result[key]) {
                if (person.id == userID) {
                    inTeam = true;
                    teamID = key;
                    break;
                }
            }
        }
        let team = null;
        let members = [] as SolsticeUser[];
        if (teamID != null) {
            team = await getTeamDetails(teamID);
            members = teams.result[teamID]
        }

        const ret_data = { inTeam: inTeam, teamID: teamID, team: team, members: members };
        return json(ret_data, { status: 200 })
    } catch (exc) {

    }
}