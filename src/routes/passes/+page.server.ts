
import { getAllEventsInPass, getAllPasses } from "$lib/components/backend/BackendAgentPass.ts";
import { getUserId, getUserPassInfo } from "$lib/components/backend/BackendAgentUser.ts";
import type { SolsticePassInfo } from "$lib/components/backend/BackendTypes.ts";
import { UserProfileData } from "../GoogleLogin.svelte.ts";

export interface EventInAllPasses{
    pass:string,
    name:string,
    description:string,
    type:string,
    team_members:number,
    start:string,
    venue:string,
    id: string,
}

export async function load(){
    const SolsticeAllPassInfo: SolsticePassInfo[] | null = await getAllPasses();
    let EventsInAllPasses: EventInAllPasses[] = [];

    if (SolsticeAllPassInfo !== null) {
        // Wait for all async operations to complete
        await Promise.all(
            // Fxn to retieve them Events For each pass and store em in a master array(better opt then 2d array) with a new lil structure
            SolsticeAllPassInfo.map(async (pass) => {
                const EventsInPass = await getAllEventsInPass(pass.id);
                if (EventsInPass) {
                    EventsInPass.forEach((ev) => {
                        EventsInAllPasses.push({
                            pass: pass.name,
                            name: ev.name,
                            description: ev.description,
                            type: ev.type,
                            team_members: ev.team_members,
                            start: ev.start,
                            venue: ev.venue,
                            id: ev.id,
                        });
                    });
                }
            })
        );
    }

    const userId:string | null=UserProfileData.userID
    let userPassInfo:SolsticePassInfo|null;
    if (userId){
        userPassInfo= await getUserPassInfo(userId)
    }
    else{
        userPassInfo=null
    }

    return ({
        SolsticeAllPassInfo : SolsticeAllPassInfo,
        EventsInAllPasses : EventsInAllPasses,
        userPassInfo: userPassInfo
    });
}