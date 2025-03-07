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
    $inspect(data.events);

    let search = $state("");
    let loading = $state(true);

    function searchEvent(e: SolsticeEvent) {
        if (e.description.toUpperCase().includes(search.toUpperCase())) {
            return true;
        }
        if (e.name.toUpperCase().includes(search.toUpperCase())) {
            return true;
        }
        if (e.id.toUpperCase().includes(search.toUpperCase())) {
            return true;
        }
        if (e.title.toUpperCase().includes(search.toUpperCase())) {
            return true;
        }

        return false;
    }

    onMount(() => {
        events = data.events;
        loading = false;
    });
</script>

<div class="centre">
    <div class="hotbar">
        <TextInput placeholder="Search event" bind:text={search} />
    </div>

    <div class="eventCont">
        <div class="e-centre" in:fade={{ duration: 300, delay: 150 }}>
            {#if loading == true}
                <div class="flex flex-col justify-center">
                    <div class="flex justify-center">
                        <Loader2></Loader2>
                    </div>
                </div>
            {:else if events.length == 0}
                <div>No Events So Far, ComeBack sometime Else</div>
            {/if}

            {#each events as event, i}
                {#if search.length > 0}
                    {#if searchEvent(event)}
                        {#if event.id != undefined}
                            <EventCard
                                {event}
                                i
                                thumbnail={`/thumbnail/${event.id}.jpg`}
                            />
                        {/if}
                    {/if}
                {:else}
                <a href={`/events/${event.id}/`}>
                    <div
                        class="e-margin"
                        in:slide={{
                            delay: i * 200,
                            duration: 1000,
                            easing: quintOut,
                            axis: "y",
                        }}
                        out:fade|global={{
                            duration: 300,
                        }}
                    >
                        <div
                            in:scale|global={{
                                delay: i * 200,
                                duration: 800,
                                start: 0.95,
                                opacity: 0,
                            }}
                        >
                            <div class=" relative hidden md:block ">
                                <CardContainer
                                    bind:isMouseEntered
                                    className="inter-var"
                                >
                                    <CardBody
                                        className="bg-gray-50 flex flex-col justify-between relative group/card h-[26rem] dark:hover:shadow-2xl dark:hover:shadow-[#C7AE93]/90 dark:bg-black/80 dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[24rem] rounded-xl border m-6 hover:translate-z-8 card-glow transition-all duration-500 ease-out"
                                    >
                                        <CardItem
                                            {isMouseEntered}
                                            translateZ="100"
                                            className="w-full h-full hover:translate-z-6 relative group transition-transform duration-500 ease-out"
                                        >
                                            <img 
                                                src={event.pictureURL}
                                                height="1600"
                                                width="1000"
                                                class="h-full w-full rounded-xl object-cover transition-all duration-300 group-hover:scale-105"
                                                alt="thumbnail"
                                            />
                                                <div class="absolute bottom-0 w-full h-[22%] bg-black/70 rounded-b-xl p-4 transition-all duration-200 ease-out group-hover:-translate-y-full group-hover:opacity-0">
                                                    <h3 class="text-[#C7AE93] font-bold text-xl md:text-2xl">
                                                        {event.name}
                                                    </h3>
                                                </div>

                                                <div class="absolute w-full hover:translate-z-13 inset-0 bg-black/20 opacity-0 group-hover:opacity-400 transition-all duration-200 ease-out rounded-xl backdrop-blur-sm backdrop-brightness-75">
                                                    <div class="absolute inset-0 p-6 flex flex-col justify-center">
                                                        <div class="overflow-hidden">
                                                            <h3 class="text-[#C7AE93] font-bold text-xl md:text-2xl transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300 ease-out">
                                                                {event.name}
                                                            </h3>
                                                        </div>
                                                        
                                                        <!-- Hide description on mobile/tablet -->
                                                        <div class="hidden md:block overflow-hidden">
                                                            <p class="text-[#C7AE93]/90 text-sm mt-4 line-clamp-3 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300 delay-75 ease-out">
                                                                {event.description}
                                                            </p>
                                                        </div>
                                                        
                                                        <div class="overflow-hidden">
                                                            <p class="text-[#C7AE93]/80 text-xs mt-4 transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300 delay-100">
                                                                {#if event.teamSize != null}
                                                                    Team size: {event.teamSize} {event.teamSize === 1 ? "person" : "people"}
                                                                {:else}
                                                                    No teams for this event
                                                                {/if}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                        </CardItem>
                                    </CardBody>
                                </CardContainer>
                            </div>
                            <div class="block md:hidden">
                                <CardContainer
                                            bind:isMouseEntered
                                            className="inter-var "
                                        >
                                            <CardBody
                                                className="bg-gray-50 flex flex-col justify-between relative group/card  dark:shadow-2xl dark:shadow-[#C7AE93]/30  dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto  sm:w-[24rem] h-[35rem] sm:[37rem] rounded-xl p-6 border"
                                            >
                                                <CardItem
                                                    {isMouseEntered}
                                                    translateZ="100"
                                                    className="w-full mb-4 hover:translate-z-8"
                                                >
                                                    <img
                                                        src={event.pictureURL}
                                                        height="1000"
                                                        width="1000"
                                                        class="h-60 w-full rounded-xl object-cover group-hover/card:shadow-xl"
                                                        alt="thumbnail"
                                                    />
                                                </CardItem>
                                                <CardItem
                                                    {isMouseEntered}
                                                    translateZ="50"
                                                    className="text-xl w-full text-[#C7AE93] flex mt-8 justify-between"
                                                >
                                                    <div class="text font-bold">
                                                        {event.name}
                                                    </div>
                                                </CardItem>
                                                <CardItem
                                                    {isMouseEntered}
                                                    translateZ="60"
                                                    className="text-[#C7AE93] text-sm max-w-sm mt-2 "
                                                >
                                                    {event.description}
                                                </CardItem>
                                                <CardItem
                                                    {isMouseEntered}
                                                    translateZ="60"
                                                    className="text-[#C7AE93] text-sm max-w-sm mt-2 mb-4"
                                                >
                                                    {#if event.teamSize != null}
                                                        <pre>Team size: {` ${event.teamSize} ${event.teamSize === 1 ? " person" : " people"}`}</pre>
                                                    {:else}
                                                        <pre>No teams for this event.</pre>
                                                    {/if}
                                                </CardItem>
                                                
                                    </CardBody>
                                </CardContainer>
                            </div>
                        </div>
                    </div>
                </a>
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
    :global(.card-glow) {
        position: relative;
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    :global(.card-glow::before) {
        content: "";
        position: absolute;
        inset: -2px;
        background: linear-gradient(
            45deg,
            transparent,
            rgba(199, 174, 147, 0.1) 40%,
            rgba(199, 174, 147, 0.2) 60%,
            transparent
        );
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
            45deg,
            transparent,
            rgba(199, 174, 147, 0.15),
            transparent
        );
        border-radius: 0.75rem;
        z-index: -1;
        opacity: 0;
        transition: all 0.5s ease;
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
</style>
