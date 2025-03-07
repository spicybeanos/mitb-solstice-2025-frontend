<script lang="ts">
    import BasicInput from "$lib/components/ui/Basic/BasicInput.svelte";
    import BasicButtonFilled from "$lib/components/ui/Basic/BasicButtonFilled.svelte";
    import BasicHeader from "$lib/components/ui/Basic/BasicHeader.svelte";
    import SimpleCard from "$lib/components/SimpleCard.svelte";
    import {
        type EventType,
        type SolsticeEventInfo,
    } from "$lib/server/backend/BackendTypes.js";
    import { onMount } from "svelte";
    let { data, form } = $props();
    let event: SolsticeEventInfo = $state({
        description: null,
        id: "none",
        name: "",
        organizer_id: null,
        start: null,
        team_members: null,
        type: "cultural" as EventType,
        venue: null,
    } as SolsticeEventInfo);
    onMount(() => {
        event = data.event;
    });

    const eventCategories: string[] = [
        "cultural",
        "e_sports",
        "experiences",
        "finance",
        "hackathon",
        "other",
        "pro_show",
        "robotics",
        "sports",
        "technical",
    ];
</script>

<div class="flex justify-center">
    <SimpleCard>
        <div class="p-[30px] m-[10px] rounded-xl">
            <BasicHeader>Edit event details</BasicHeader>
            {#if form?.error}
                <div class="text-white">Encountered an error: {form.error}</div>
            {/if}
            {#if form?.success == true}
                <div class="text-white">Success!</div>
            {/if}
            <div class="text-white">Event id: <code>{event.id}</code></div>
            <form action="?/updateEvent" method="POST" class="flex flex-col">
                <label class="text-white" for="name">Name:</label>
                <BasicInput
                    required
                    name="name"
                    placeholder="Event name"
                    bind:value={event.name}
                />
                <label class="text-white" for="desc">Description:</label>
                <BasicInput
                    required
                    name="desc"
                    placeholder="Event description"
                    bind:value={event.description}
                />
                <div>
                    <label class="text-white" for="venue">Venue:</label>
                    <BasicInput
                        required
                        name="venue"
                        placeholder="Venue of the event"
                        bind:value={event.venue}
                    />
                    <label class="text-white" for="team_mem">Members: </label>
                    <BasicInput
                        required
                        name="team_mem"
                        placeholder="Number of members in a team"
                        type="number"
                        bind:value={event.team_members}
                    />
                </div>
                <div>
                    <label class="text-white" for="type"> Type: </label>
                    <select
                        bind:value={event.type}
                        required
                        name="type"
                        class="border p-[8px] rounded-md bg-white"
                    >
                        {#each eventCategories as cat}
                            <option value={cat}>
                                {cat}
                            </option>
                        {/each}
                    </select>
                    <label class="text-white" for="start">Start:</label>
                    <BasicInput
                        required
                        type="datetime-local"
                        name="start"
                        bind:value={event.start}
                    />
                    {#if data?.isAdmin == true}
                        <label class="text-white"
                            >Organizer email (change):
                            <BasicInput
                                type="email"
                                placeholder="organizer email"
                                name="org"
                            /></label
                        >
                    {/if}
                </div>

                <BasicButtonFilled>Submit</BasicButtonFilled>
            </form>
        </div>
    </SimpleCard>
</div>
