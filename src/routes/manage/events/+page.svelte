<script lang="ts">
    import BasicInput from "$lib/components/ui/Basic/BasicInput.svelte";
    import { onMount } from "svelte";

    let eventID = $state("");
    let { data } = $props();

    let events: { name: string; eventID: string }[] = $state([]);

    onMount(() => {
        events = [];
        if (data.events != undefined) {
            for (const event of data.events) {
                events.push({
                    name: event.name,
                    eventID: event.id,
                });
            }
            eventID = events[0].eventID;
        }
    });
</script>

<div class="flex justify-center">
    <div class="p-[30px]">
        <h1>Enter event ID to view or edit event</h1>
        <div>Make sure you are the event head of that event!</div>

        <BasicInput
            required
            name="eventID"
            bind:value={eventID}
            placeholder="Enter event ID"
        />
        <select
            bind:value={eventID}
            class="border p-[8px] rounded-md bg-black text-white"
        >
            {#each events as event}
                <option value={event.eventID}>
                    {event.name}
                </option>
            {/each}
        </select>

        <a href={`/manage/events/${eventID.trim()}/edit`}>Edit event</a>
        <a href={`/manage/events/create`}
            >Create event (Admin)</a
        >
        <a href={`/manage/events/${eventID.trim()}/teams`}>View teams</a>
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
