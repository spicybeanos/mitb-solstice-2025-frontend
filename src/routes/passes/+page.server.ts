
import { getAllEventsInPass, getAllPasses } from "$lib/server/BackendAgentPass.ts";
import { getUserId, getUserPassInfo } from "$lib/server/BackendAgentUser.ts";
import type { SolsticePassInfo, UserID } from "$lib/server/BackendTypes.ts";
import { error } from "@sveltejs/kit";
import { UserProfileData } from "../GoogleLogin.svelte.ts";

export interface EventInAllPasses {
    pass: string,
    passId: string,
    name: string,
    description: string | null,
    type: string,
    team_members: number | null,
    start: string | null,
    venue: string | null,
    id: string,
    organizer_id: UserID | null
}

export async function load() {
    try {
        const SolsticeAllPassInfo: SolsticePassInfo[] | null = await getAllPasses();


        const userId: string | null = UserProfileData.userID
        let userPassInfo: SolsticePassInfo | null;
        if (userId) {
            userPassInfo = await getUserPassInfo(userId)
        }
        else {
            userPassInfo = null
        }

        return ({
            SolsticeAllPassInfo: SolsticeAllPassInfo,
            userPassInfo: userPassInfo
        });
    } catch (err) {
        error(500, 'Failed to load pass information')
    }

}