import { getEvents } from "$lib/server/BackendAgentEvent";
import type { SolsticeEventInfo } from "$lib/server/BackendTypes";
import { getMultipleEventMedia } from "$lib/server/WebsiteMaster";
const feature: string[] = ['Robo Wars','Line Follower','Robo Race','Code-a-thon','Pitch Tank']
export async function load() {
    try {
        const events = await getEvents();

        if (events == null) { return {feature:[],medias:{success:true,result:[]}}; }
        let feat: SolsticeEventInfo[] = [];
        for (const eve of events) {
            for (const n of feature) {
                if (eve.name.trim() == n.trim()) {
                    feat.push(eve)
                }
            }
        }
        let ids = [];
        for (const e of feat) {
            ids.push(e.id)
        }
        const medias = await getMultipleEventMedia(ids);

        return {feature:feat,medias:medias};
    } catch (e) {
        return {feature:[],medias:{success:true,result:[]}};
    }
}