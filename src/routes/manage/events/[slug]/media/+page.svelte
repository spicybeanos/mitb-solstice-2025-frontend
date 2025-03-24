<script lang="ts">
    import BasicInput from "$lib/components/ui/Basic/BasicInput.svelte";
    import BasicButtonFilled from "$lib/components/ui/Basic/BasicButtonFilled.svelte";
    import BasicHeader from "$lib/components/ui/Basic/BasicHeader.svelte";
    import SimpleCard from "$lib/components/SimpleCard.svelte";
    import { onMount } from "svelte";
    import type { EventMedia } from "$lib/server/WebsiteMaster.js";
    let { data, form } = $props();
    let media: EventMedia = $state({
        background: "",
        eventID: "",
        rulebook: "",
        thumbnail: "",
        max_teams: 0,
        prize_pool:null
    } as EventMedia);
    onMount(() => {
        if (data.media.success == true && data.media.result != null) {
            media = data.media.result;
        }
    });
</script>

<div class="flex justify-center">
    <SimpleCard>
        <div class="p-[30px] m-[10px] rounded-xl">
            <BasicHeader>Edit event media</BasicHeader>
            {#if form?.error}
                <div class="text-white">Encountered an error: {form.error}</div>
            {/if}
            {#if form?.success == true}
                <div class="text-white">Success!</div>
            {/if}
            <div class="text-white">Event id: <code>{media.eventID}</code></div>
            <form action="?/updateMedia" method="POST" class="flex flex-col">
                <label class="text-white" for="name"
                    >Thumbnail image link:</label
                >
                <BasicInput
                    required
                    name="thumb"
                    placeholder="thumbnail link"
                    bind:value={media.thumbnail}
                />
                <label class="text-white" for="desc"
                    >Background image link:</label
                >
                <BasicInput
                    required
                    name="backg"
                    placeholder="background link"
                    bind:value={media.background}
                />
                <div>
                    <label class="text-white" for="rule">Rulebook link:</label>
                    <BasicInput
                        required
                        name="rule"
                        placeholder="rulebook link"
                        bind:value={media.rulebook}
                    />
                </div>
                <div>
                    <label class="text-white" for="max_teams">Max teams:</label>
                    <BasicInput
                        required
                        name="max_teams"
                        placeholder="Max number of teams"
                        bind:value={media.max_teams}
                        type="number"
                    />
                    <label class="text-white" for="prize_pool">Prize pool:</label>
                    <BasicInput
                        name="prize_pool"
                        placeholder="Prize pool"
                        bind:value={media.prize_pool}
                    />
                </div>

                <BasicButtonFilled>Submit</BasicButtonFilled>
            </form>
        </div>
    </SimpleCard>
</div>
