<script lang="ts">
    import BasicInput from "$lib/components/ui/Basic/BasicInput.svelte";
    import { onMount } from "svelte";

    let passID = $state("");
    let { data } = $props();

    let passes: { name: string; passID: string }[] = $state([]);

    onMount(() => {
        passes = [];
        if (data.passes != undefined && data.passes != null) {
            for (const pass of data.passes) {
                passes.push({
                    name: pass.name,
                    passID: pass.id,
                });
            }
            passID = passes[0].passID;
        }
    });
</script>

<div class="flex justify-center">
    <div class="p-[30px]">
        <h1>Enter pass ID to edit pass</h1>
        <BasicInput
            required
            name="passID"
            bind:value={passID}
            placeholder="Enter event ID"
        />
        <select
            bind:value={passID}
            class="border p-[8px] rounded-md bg-black text-white"
        >
            {#each passes as event}
                <option value={event.passID}>
                    {event.name}
                </option>
            {/each}
        </select>

        <a href={`/manage/pass/${passID.trim()}/`}>Edit</a>
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
