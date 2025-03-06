import { getEvents } from "$lib/server/BackendAgentEvent";
import type { SolsticeEventInfo } from "$lib/server/BackendTypes";
const feature: string[] = ['SparkTank (Ideathon)','E-Sports','Robo Wars','Line Follower','Robo Race','Code-a-thon 24']
export async function load() {
    try {
        const events = await getEvents();
        if (events == null) { return {feature:[]}; }
        let feat: SolsticeEventInfo[] = [];
        for (const eve of events) {
            for (const n of feature) {
                if (eve.name.trim() == n.trim()) {
                    feat.push(eve)
                }
            }

        }

        return {feature:feat};
    } catch (e) {
        return {feature:[]};
    }
}