import RetroGrid from "$lib/components/ui/RetroGrid.svelte";
import { getStayGForm } from "$lib/server/WebsiteMaster";


export async function load() {
    const gurl = await getStayGForm();
    return {form:gurl.result}
}