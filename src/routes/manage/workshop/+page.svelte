<script lang="ts">
    import BasicHeader from "$lib/components/ui/Basic/BasicHeader.svelte";
    import BasicInput from "$lib/components/ui/Basic/BasicInput.svelte";
    import { onMount } from "svelte";

    let workshopID = $state("");
    let { data } = $props();

    let workshops: { name: string; workshopID: string }[] = $state([]);

    onMount(() => {
        workshops = [];
        if (data.workshops.result != undefined) {
            for (const ws of data.workshops.result) {
                workshops.push({
                    name: ws.name,
                    workshopID: ws.id,
                });
            }
            workshopID = workshops[0].workshopID;
        }
    });
</script>

<div class="flex justify-center">
    <div class="p-[30px]">
        <h1>Enter workshop ID to view or edit workshop</h1>
        <div>Make sure you are the workshop head of that workshop!</div>

        <BasicInput
            required
            name="workshopID"
            bind:value={workshopID}
            placeholder="Enter workshop ID"
        />
        <select
            bind:value={workshopID}
            class="border p-[8px] rounded-md bg-black text-white"
        >
            {#each workshops as workshop}
                <option value={workshop.workshopID}>
                    {workshop.name}
                </option>
            {/each}
        </select>

        <a href={`/manage/workshop/${workshopID.trim()}/edit`}>Edit workshop</a>
    </div>
</div>

<style>
    h1,
    div {
        color: white;
    }
    h1 {
        font-size: xx-large;
    }
    a {
        border-style: solid;
        border-width: 1px;
        border-radius: 10px;
        border-color: lightcoral;
        padding: 10px 10px 10px 10px;
        color: lightcoral;
        margin: 15px 15px 15px 15px;
        margin-top: 30px;

        background: rgba(0, 0, 0, 0.15);
        backdrop-filter: blur(15px) saturate(120%);
        -webkit-backdrop-filter: blur(15px) saturate(120%);
        border-radius: 15px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        padding: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        transition: all 0.3s ease-in-out;
    }
    a:hover {
        background: rgba(255, 255, 255, 0.075);
        backdrop-filter: blur(20px);
    }
</style>
