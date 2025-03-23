<script lang="ts">
    import SimpleCard from "$lib/components/SimpleCard.svelte";
    import WorkshopCard from "$lib/components/WorkshopCard.svelte";
    import { fade } from "svelte/transition";
    let { data } = $props();
</script>

<div class="flex justify-center flex-row">
    <div
        in:fade={{ duration: 300, delay: 150 }}
        class="flex justify-center flex-row"
    >
        {#if data.workshops.success && data.workshops.result != null}
            {#each data.workshops.result as ws, i}
                <WorkshopCard
                    image_url={ws.image_url ??
                        "https://static.vinwonders.com/production/workshop-ve-tranh-ha-noi-banner.jpg"}
                    club={ws.club}
                    id={ws.id}
                    index={i}
                    name={ws.name}
                    venue={ws.venue}
                    date_from={ws.date_from}
                />
            {/each}
        {:else}
            <SimpleCard>No workshops yet</SimpleCard>
        {/if}
    </div>
</div>
