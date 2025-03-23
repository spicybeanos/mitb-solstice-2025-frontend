<script lang="ts">
    import type { SolsticeEvent } from "$lib/components/Events.ts";
    // import Button from "$lib/components/Button.svelte";
    // import Card from "$lib/components/Card.svelte";
    import TextInput from "$lib/components/TextInput.svelte";
    // import EventCard from "$lib/components/EventCard.svelte";
    //import { events } from "$lib/components/Events.ts";
    import { fade, slide, scale } from "svelte/transition";
    import { cubicOut, quintOut } from "svelte/easing";
    let isMouseEntered = $state(false);
    // import AButton from "$lib/components/AButton.svelte";
    import { onMount } from "svelte";
    import {
        CardBody,
        CardContainer,
        CardItem,
    } from "$lib/components/ui/ThreeDCardEffect/index.js";
    import { UserProfileData } from "../GoogleLogin.svelte.ts";
    import { Loader2 } from "lucide-svelte";
    import EventCard from "$lib/components/EventCard.svelte";

    let events: SolsticeEvent[] = $state([]);
    // TO BE REMOVED, ONLY HERE TO POPULATE WITH CONTENT TILL BACKEND IS CONNECTED

    let { data } = $props();
    // $inspect(data.events);

    let search = $state("");
    let loading = $state(true);

    let eventTypes = $state([] as string[]);

    function searchEvent(e: SolsticeEvent) {
        // if (e.description.toUpperCase().includes(search.toUpperCase())) {
        //     return true;
        // }
        if (e.name.toUpperCase().includes(search.toUpperCase())) {
            return true;
        }
        // if (e.id.toUpperCase().includes(search.toUpperCase())) {
        //     return true;
        // }
        // if (e.title.toUpperCase().includes(search.toUpperCase())) {
        //     return true;
        // }

        return false;
    }

    onMount(() => {
        events = data.events;
        loading = false;
        for (const ev of events) {
            if(!eventTypes.includes(ev.category)){
                eventTypes.push(ev.category);
            }
        }
    });
</script>

<div class="centre">
    <div class="hotbar">
        <TextInput placeholder="Search event" bind:text={search} />
    </div>

    <div class="eventCont">
        <div in:fade={{ duration: 300, delay: 150 }}>
            {#if loading == true}
                <div class="flex flex-col justify-center">
                    <div class="flex justify-center">
                        <Loader2></Loader2>
                    </div>
                </div>
            {:else if events.length == 0}
                <div>No Events So Far, ComeBack sometime Else</div>
            {/if}

            {#if search.length > 0}
                <div class="e-centre">
                    {#each events as event, i}
                        {#if searchEvent(event)}
                            {#if event.id != undefined}
                                <EventCard
                                    {event}
                                    i
                                    thumbnail={data.medias?.result != null
                                        ? data.medias?.result[i].thumbnail
                                        : event.pictureURL}
                                /><!--!!!NOTE!!! :- Need to put `/thumbnail/${event.id}.jpg` here, rn for placholder , its there-->
                            {/if}
                        {/if}
                    {/each}
                </div>
            {:else}
                {#each eventTypes as cat}
                    <div class="border-y-solid border-y-2 border-sky-500">
                        <div class="m-5 text-3xl font-akira text-white text-center">
                            {cat.replace("_", " ").toUpperCase()}
                        </div>
                        <div class="e-centre">
                            {#each events as event, i}
                                {#if event.category == cat}
                                    <EventCard
                                        {event}
                                        i
                                        thumbnail={data.medias?.result != null
                                            ? data.medias?.result[i].thumbnail
                                            : event.pictureURL}
                                    />
                                {/if}
                            {/each}
                        </div>
                    </div>
                {/each}
            {/if}
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
    .e-margin {
        margin: 10px;
    }
    .e-centre {
        width: fit-content;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
    }
    :global(.line-clamp-3) {
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
    }

    @media (max-width: 768px) {
        :global(.group:hover) img {
            blur: 1px !important;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        :global(.transition-all),
        :global(.transition-transform) {
            transition: none !important;
        }
        :global(.group *) {
            transition: none !important;
            transform: none !important;
        }
    }

    :global(.card-glow::before) {
        content: "";
        position: absolute;
        inset: -2px;
        background: linear-gradient(
            180deg,
            rgba(171, 131, 254, 0.1),
            rgba(171, 131, 254, 0.5)
        );
        background-size: 200% 200%;
        border-radius: 0.75rem;
        z-index: -1;
        transition: all 0.5s ease;
        opacity: 0;
        filter: blur(8px);
    }

    :global(.card-glow::after) {
        content: "";
        position: absolute;
        inset: -1px;
        background: linear-gradient(
            180deg,
            rgba(171, 131, 254, 0.05),
            rgba(171, 131, 254, 0.4)
        );
        background-size: 200% 200%;
        border-radius: 0.75rem;
        z-index: -1;
        opacity: 0;
        transition: all 0.5s ease;
    }

    :global(.card-glow) {
        position: relative;
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    :global(.card-glow:hover::before),
    :global(.card-glow:hover::after) {
        opacity: 1;
    }

    :global(.card-glow:hover::before) {
        animation: glowRotate 5s linear infinite;
    }

    @keyframes glowRotate {
        0% {
            background-position: 0% 50%;
        }
        50% {
            background-position: 100% 50%;
        }
        100% {
            background-position: 0% 50%;
        }
    }

    /* Mobile optimization */
    @media (max-width: 768px) {
        :global(.card-glow::before),
        :global(.card-glow::after) {
            display: none;
        }
        :global(.group .h-\[70\%\]) {
            height: 75%;
        }

        :global(.group .h-\[30\%\]) {
            height: 25%;
        }
    }

    /* Respect user preferences */
    @media (prefers-reduced-motion: reduce) {
        :global(.card-glow::before) {
            animation: none;
        }
        :global(.card-glow),
        :global(.card-glow::before),
        :global(.card-glow::after) {
            transition: none;
        }
    }

    :global(.group) {
        transform-style: preserve-3d;
    }

    :global(.group > *) {
        backface-visibility: hidden;
    }

    @media (max-width: 768px) {
        .eventCont {
            padding: 20px;
        }

        :global(.line-clamp-3) {
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
        }

        :global(.card-glow) {
            margin-bottom: 1rem;
        }

        :global(.truncate) {
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }
</style>
