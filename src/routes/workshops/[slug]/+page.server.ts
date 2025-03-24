import { getWorkshop } from '$lib/server/BackendWorkshop';


export async function load({params}) {
    const workshop = await getWorkshop(params.slug);
    return workshop;
}