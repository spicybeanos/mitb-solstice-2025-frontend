import { getAllPasses } from "$lib/components/backend/BackendAgentPass";



export async function load(){
    const passes = await getAllPasses();
    if(passes == null) {return ({passes:[]});}
    return ({passes:passes});
}
