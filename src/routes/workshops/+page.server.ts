import { getAllWorkshops } from "$lib/server/BackendWorkshop";


export async function load(){
    const workshops = await getAllWorkshops();
    return {workshops:workshops}
}