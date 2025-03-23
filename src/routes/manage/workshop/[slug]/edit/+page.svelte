<script lang="ts">
    import BasicInput from "$lib/components/ui/Basic/BasicInput.svelte";
    import BasicButtonFilled from "$lib/components/ui/Basic/BasicButtonFilled.svelte";
    import BasicHeader from "$lib/components/ui/Basic/BasicHeader.svelte";
    import SimpleCard from "$lib/components/SimpleCard.svelte";
    import {
        type WorkshopType,
        type Workshop,
    } from "$lib/server/backend/BackendTypes.js";
    import { onMount } from "svelte";
    let { data, form } = $props();
    let workshop: Workshop = $state({} as Workshop);
    onMount(() => {
        if (data.workshop?.result != null) {
            workshop = data.workshop.result;
        }
    });
</script>

<div class="flex justify-center">
    <SimpleCard>
        <div class="p-[30px] m-[10px] rounded-xl">
            <BasicHeader>Edit Workshop details</BasicHeader>
            {#if form?.error}
                <div class="text-white">Encountered an error: {form.error}</div>
            {/if}
            {#if form?.success == true}
                <div class="text-white">Success!</div>
            {/if}
            <div class="text-white">
                Workshop id: <code>{workshop.id}</code>
            </div>
            <form action="?/updateWorkshop" method="POST" class="flex flex-col">
                <label class="text-white" for="name">Name:</label>
                <BasicInput
                    required
                    name="name"
                    placeholder="Workshop name"
                    bind:value={workshop.name}
                />
                <label class="text-white" for="desc">Description:</label>
                <BasicInput
                    required
                    multiline
                    name="desc"
                    placeholder="Workshop description"
                    bind:value={workshop.description}
                />
                <div>
                    <label class="text-white" for="venue">Venue:</label>
                    <BasicInput
                        required
                        name="venue"
                        placeholder="Venue of the Workshop"
                        bind:value={workshop.venue}
                    />
                    <label class="text-white" for="team_mem">Club: </label>
                    <BasicInput
                        required
                        name="club"
                        placeholder="Club"
                        bind:value={workshop.club}
                    />
                </div>
                <div>
                    <label class="text-white" for="start">Date from:</label>
                    <BasicInput
                        required
                        type="datetime-local"
                        name="dfrom"
                        bind:value={workshop.date_from}
                    />
                    <label class="text-white" for="start">Date to:</label>
                    <BasicInput
                        required
                        type="datetime-local"
                        name="dto"
                        bind:value={workshop.date_to}
                    />
                </div>
                <label class="text-white" for="start">Image URL:</label>
                <BasicInput
                    name="image_url"
                    bind:value={workshop.image_url}
                />

                <BasicButtonFilled>SUBMIT</BasicButtonFilled>
            </form>
            <form action="?/deleteWorkshop" method="POST" class="flex flex-col">
                <BasicButtonFilled color="red">DELETE</BasicButtonFilled>
            </form>
        </div>
    </SimpleCard>
</div>
