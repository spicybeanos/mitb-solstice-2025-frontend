<script lang="ts">
    import type { FalakEvent } from "$lib/components/Events.ts";
    import Button from "$lib/components/Button.svelte";
    import Card from "$lib/components/Card.svelte";
    import TextInput from "$lib/components/TextInput.svelte";
    import EventCard from "$lib/components/EventCard.svelte";
    //import { events } from "$lib/components/Events.ts";
    import AButton from "$lib/components/AButton.svelte";
    import { onMount } from "svelte";

    let events:FalakEvent[] = $state([]);
    let { data } = $props();

    let search = $state("");

    function searchEvent(e:FalakEvent)
    {
        if(e.description.toUpperCase().includes(search.toUpperCase())){
            return true;
        }
        if(e.name.toUpperCase().includes(search.toUpperCase())){
            return true;
        }
        if(e.id.toUpperCase().includes(search.toUpperCase())){
            return true;
        }
        if(e.title.toUpperCase().includes(search.toUpperCase())){
            return true;
        }

        return false;
    }

    onMount(() => {
        events = data.events;
    });
</script>

<div class="centre">
    <div class="hotbar">
        <TextInput placeholder="Search event" bind:text={search} />
    </div>

    <div class="eventCont">
        <div class="e-centre">
            {#each events as event}
                {#if search.length > 0}
                    {#if searchEvent(event)}
                        {#if event.id != undefined}
                            <div class="e-margin">
                                <Card title={`@${event.id}`}>
                                    <div class="e-aspect">
                                        <!-- svelte-ignore a11y_img_redundant_alt -->
                                        <img
                                            class="e-img"
                                            src={event.pictureURL}
                                            alt="picture for the event"
                                        />
                                        <h1>{event.name}</h1>
                                        <div class="e-nowrap">
                                            {event.description}
                                        </div>
                                        <AButton href={`/events/${event.id}/`}
                                            >Learn more!</AButton
                                        >
                                    </div>
                                </Card>
                            </div>
                        {/if}
                    {/if}
                {:else}
                    <div class="e-margin">
                        <Card title={`@${event.id}`}>
                            <div class="e-aspect">
                                <!-- svelte-ignore a11y_img_redundant_alt -->
                                <img
                                    class="e-img"
                                    src={event.pictureURL}
                                    alt="picture for the event"
                                />
                                <h1>{event.name}</h1>
                                <div class="e-nowrap">
                                    {event.description}
                                </div>
                                <AButton href={`/events/${event.id}/`}
                                    >Learn more!</AButton
                                >
                            </div>
                        </Card>
                    </div>
                {/if}
            {/each}
        </div>
    </div>
</div>

<style>
    .eventCont {
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        align-items: center;
        justify-items: center;
        width: 100%;
        padding: 60px;
    }
    .mid {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: fit-content;
    }
    .centre {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
    }
    .hotbar {
        display: flex;
        flex-wrap: wrap;
        flex-direction: row;
        align-items: center;
    }
    .e-img {
        border-radius: 0.5em;
        width: min(80vw, 360px);
    }
    .e-margin {
        margin: 10px;
    }
    .e-aspect {
        aspect-ratio: 1.423 / 1.8;
        width: min(80vw, 15em);
    }
    .e-nowrap {
        height: 5em;
        overflow: auto;
    }
    .e-mid {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: fit-content;
        flex-wrap: wrap;
    }
    .e-centre {
        width: fit-content;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
    }
</style>
