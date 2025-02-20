
import { EventInPass, getAllEventsInPass, getAllPasses, type SolsticePassInfo } from "$lib/components/backend/BackendAgentPass";
import { getUserId, getUserPassInfo } from "$lib/components/backend/BackendAgentUser";
import { events } from "$lib/components/Events";
import type { FalakPass } from "$lib/components/FalakPass";
import { UserProfileData } from "../GoogleLogin.svelte.ts";
import { getEventsAccessableByPass } from "$lib/components/backend/BackendAgentPass";

export interface EventInAllPasses{
    pass:string,
    name:string,
    description:string | null,
    type:string,
    team_members:number | null,
    start:string | null,
    venue:string | null,
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