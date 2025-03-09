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
    } as EventMedia);
    onMount(() => {
        media = data.media.result;
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
                    <label class="text-white" for="venue">Rulebook link:</label>
                    <BasicInput
                        required
                        name="rule"
                        placeholder="rulebook link"
                        bind:value={media.rulebook}
                    />
                </div>

                <BasicButtonFilled>Submit</BasicButtonFilled>
            </form>
        </div>
    </SimpleCard>
</div>
