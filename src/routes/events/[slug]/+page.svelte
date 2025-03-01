<script lang="ts">
    import type { SolsticeEvent } from "$lib/components/Events.js";
    import { onMount } from "svelte";
    import { enhance } from "$app/forms";
    import {
        placeholderEvents,
        toSolsticeEvent,
        toSolsticeEvents,
    } from "$lib/components/Events.js";
    // import Card from "$lib/components/Card.svelte";
    import {
        CardBody,
        CardContainer,
        CardItem,
    } from "$lib/components/ui/ThreeDCardEffect/index.js";
    import type { SolsticeTeamInfo } from "$lib/server/BackendTypes.ts";
    import CopyToClipboard from "$lib/components/CopyToClipboard.svelte";

    let isLoaded = $state(false);

    let teamId: string;
    let teamName = $state("");
    let teamID = $state();
    let hostID: string | null;

    let teamSize: number;
    let teamMembers: string[] = $state([]);
    let teamLeader = $state("");
    let teamMember2 = $state("");
    let teamMember3 = $state("");
    let existing_team_ID = $state("");
    let new_member = $state("");
    let team = $state("existing");
    let isMouseEntered = $state(false);
    let { data, form } = $props();

    let isInTeam = $state(false);
    let myTeam: SolsticeTeamInfo | null = $state(null);

    let event: SolsticeEvent = $state({
        img_alt: "picture of the event",
        name: "",
        id: "",
        title: "",
        description: "",
        date: "",
        time: "",
        duration: 0,
        teamSize: 1,
        pictureURL:
            "https://i2.wp.com/img1.wsimg.com/isteam/ip/863482dd-338f-4fde-80d0-f2ee62329385/Wikimania_hackathon_2.JPG/:/rs=w:1240,h:620,cg:true,m/cr=w:1240,h:620",
        venue: "",
        category: "",
    });

    function showTeams() {
        console.log("Showing teams");
    }
    function tab_existingTeam() {
        team = "existing";
    }
    function tab_newTeam() {
        team = "new";
    }

    function addMember() {}
    function delTeam() {}

    onMount(() => {
        const eventID = data.slug;
        isInTeam = data.in_team;

        if (isInTeam) {
            myTeam = data.team;
        }

        data.events.forEach((element) => {
            if (element.id === eventID) {
                event = toSolsticeEvent(element);
                teamSize = event.teamSize;
                teamMembers = Array(teamSize - 1).fill("");
            }
        });
        setTimeout(() => {
            isLoaded = true;
        }, 5000);
    });

    async function handleNewTeam() {}

    let loading = $state(false);
    let error = $state("");
    let successMessage = $state("");
</script>

<div class="centre main">
    <CardContainer
        bind:isMouseEntered
        className={`inter-var my-16 fade-in ${isLoaded ? "show" : ""}`}
    >
        <CardBody
            className=" bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-[95%] max-w-[60rem] h-auto rounded-xl p-4 sm:p-6 border mx-auto"
        >
            <CardItem
                {isMouseEntered}
                translateZ="100"
                className="w-full mb-4 flex justify-center overflow-hidden rounded-xl"
            >
                <div
                    class={`image-container w-full h-80 overflow-hidden rounded-xl ${isLoaded ? "loaded" : ""}`}
                >
                    <img
                        src={event.pictureURL}
                        height="1000"
                        width="1000"
                        loading="lazy"
                        onload={() => (isLoaded = true)}
                        class="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                        alt={event.img_alt || "Event thumbnail"}
                    />
                </div>
            </CardItem>
            <CardItem
                {isMouseEntered}
                translateZ="50"
                className="text-xl w-full  text-[#C7AE93]  mt-8 flex flex-col sm:flex-row justify-between space-y-4 md:space-y-0"
            >
                <CardItem
                    {isMouseEntered}
                    translateZ="60"
                    className="text-[#C7AE93] space-y-6 "
                >
                    <div class="text font-extrabold text-4xl">
                        {event.name}
                    </div>
                    <div class="text-sm max-w-sm mt-2">{event.description}</div>
                </CardItem>
                <div
                    class="flex flex-col-reverse sm:flex-col justify-center space-y-3"
                >
                    <div
                        class="text font-medium items-start sm:items-center text-base"
                    >
                        <CopyToClipboard text={`${event.id}`}></CopyToClipboard>
                    </div>
                    <CardItem
                        {isMouseEntered}
                        translateZ="50"
                        className="event-details-card flex flex-col text-sm max-w-sm text-[#C7AE93] bg-gray-900/90 backdrop-blur space-y-2 px-8 py-4 items-start ml-14 md:ml-8 mb-4 rounded-xl border border-gray-800/50 transition-all duration-300 hover:border-[#C7AE93]/30 "
                    >
                        <div class="w-full space-y-3">
                            <div class="event-detail-item">
                                <svg
                                    class="w-4 h-4 inline-block mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                    />
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                </svg>
                                <span>{event.venue}</span>
                            </div>
                            <div class="event-detail-item">
                                <svg
                                    class="w-4 h-4 inline-block mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <span>{event.time}</span>
                            </div>
                            <div class="event-detail-item">
                                <svg
                                    class="w-4 h-4 inline-block mr-2"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        stroke-linecap="round"
                                        stroke-linejoin="round"
                                        stroke-width="2"
                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                </svg>
                                <span>{event.duration} hours</span>
                            </div>
                            <CardItem
                                {isMouseEntered}
                                translateZ="60"
                                className="team-size-info w-full mt-3 pt-3 border-t border-gray-800/50"
                            >
                                {#if event.teamSize != null}
                                    <div class="flex items-center">
                                        <svg
                                            class="w-4 h-4 inline-block mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                            />
                                        </svg>
                                        <span
                                            >Team size: {event.teamSize}
                                            {event.teamSize === 1
                                                ? "person"
                                                : "people"}</span
                                        >
                                    </div>
                                {:else}
                                    <div
                                        class="flex items-center text-yellow-400"
                                    >
                                        <svg
                                            class="w-4 h-4 inline-block mr-2"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                stroke-linecap="round"
                                                stroke-linejoin="round"
                                                stroke-width="2"
                                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                            />
                                        </svg>
                                        <span>No teams for this event!</span>
                                    </div>
                                {/if}
                            </CardItem>
                        </div>
                    </CardItem>
                </div>
            </CardItem>

            {#if data.canAccess}
                <CardItem className="w-full flex flex-col">
                    <div
                        class="picker relative sm:px-2 flex justify-between font-light text-xs"
                    >
                        <div
                            class={`rounded-xs w-1/2 text-center py-1 ${team === "new" ? `bg-white text-black` : `bg-[#1d1d1d] text-white border `}`}
                        >
                            <button class="cursor-pointer" onclick={tab_newTeam}
                                >Existing Team</button
                            >
                        </div>
                        <div
                            class={`rounded-xs w-1/2 text-center py-1 ${team === "existing" ? `bg-white text-black` : `bg-[#1d1d1d] text-white border `}`}
                        >
                            <button
                                class="cursor-pointer"
                                onclick={tab_existingTeam}>New Team</button
                            >
                        </div>
                    </div>
                    {#if team === "existing"}
                        {#if form?.msg}
                            <div style="color: pink;">Error! {form.msg}</div>
                        {/if}
                        {#if form?.team}
                            <div style="color: white;">
                                team info:
                                <pre>Team name : {form.team.name}</pre>
                                <pre>Team ID : {form.team.id}</pre>
                                <pre>Host ID : {form.team.host_id}</pre>
                            </div>
                        {/if}
                        <form
                            action="?/newTeam"
                            method="POST"
                            use:enhance={handleNewTeam}
                        >
                            <div
                                class="bg-black text-white w-full pt-2 sm:pt-8"
                            >
                                <div class="mb-6 sm:mb-8">
                                    <label for="team_name" class="block mb-1"
                                        >Team Name</label
                                    >
                                    <input
                                        required
                                        placeholder="Enter team name"
                                        class="w-full p-2 border text-white bg-[#1d1d1d]"
                                        bind:value={teamName}
                                        name="team_name"
                                    />
                                </div>
                                <button
                                    class="w-full text-center bg-white text-black hover:bg-black hover:text-white transition-all duration-200 p-2 rounded-sm max-sm:mt-3"
                                    >Register</button
                                >
                                <!-- {#if } FUNCTIONALITY TO CHECK IF USER IS HR TO BE IMPLEMENTED -->

                                <!-- {/if} -->
                            </div>
                        </form>
                        <button
                            class="w-full text-center bg-white text-black hover:bg-black hover:text-white transition-all duration-200 p-2 rounded-sm mt-3 sm:mt-6"
                            onclick={showTeams}>Show teams</button
                        >
                    {:else if team === "new"}
                        <form action="?/joinTeam" method="post">
                            <div
                                class="bg-black text-white w-full pt-6 sm:pt-8"
                            >
                                <div class="mb-6 sm:mb-8">
                                    <label for="team-ID" class="block mb-1"
                                        >Team ID</label
                                    >
                                    <input
                                        placeholder="Enter team ID"
                                        class="w-full p-2 border text-white bg-[#1d1d1d]"
                                        bind:value={existing_team_ID}
                                        name="team_id"
                                    />
                                </div>

                                {#if error}
                                    <div class="text-red-500 mt-2">{error}</div>
                                {/if}
                                {#if successMessage}
                                    <div class="text-green-500 mt-2">
                                        {successMessage}
                                    </div>
                                {/if}
                                <button
                                    class="w-full text-center bg-white text-black hover:bg-black hover:text-white transition-all duration-200 p-2 rounded-sm mt-4"
                                    disabled={loading}
                                >
                                    {loading ? "Joining..." : "Join"}
                                </button>
                            </div>
                        </form>
                    {:else}
                        <div
                            class="bg-black text-white w-full pt-2 sm:pt-8 mt-6"
                        >
                            <div class="mb-8 mt-6">
                                <p>Your Team ID : {teamID}</p>
                                <button
                                    class="w-full text-center mt-6 bg-white text-black hover:bg-black hover:text-white transition-all duration-200 p-2 rounded-sm max-sm:mt-3"
                                    onclick={delTeam}>Delete Team</button
                                >
                            </div>
                        </div>
                    {/if}
                </CardItem>
            {:else}
                {#if data.isRegistered == false}
                    <div style="color: white;">
                        You're not logged in!
                    </div>
                {/if}
                <div style="color: white;">
                    You do not have the pass to register for this event!
                </div>
            {/if}
        </CardBody>
    </CardContainer>
</div>

<style>
    img {
        width: 100%;
        max-width: 60rem;
        height: auto;
    }
    /* div{
        color: var(--text-light)
    } */
    .margin {
        margin: 10px;
    }
    .aspect {
        aspect-ratio: 1.423 / 1.8;
        width: 100%;
        max-width: 15em;
    }
    .nowrap {
        height: auto;
        max-height: 5em;
        overflow-y: auto;
        overflow-x: hidden;
    }
    .mid {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 70vw;
        flex-wrap: wrap;
        padding: 1rem;
    }
    .centre {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        min-height: 100vh;
        padding: 1rem;
    }

    @media screen and (max-width: 1024px) {
        .mid {
            max-width: 85vw;
        }
    }

    @media screen and (max-width: 768px) {
        .mid {
            max-width: 95vw;
        }

        :global(.text-4xl) {
            font-size: 1.75rem !important;
        }
    }

    @media screen and (max-width: 480px) {
        .mid {
            padding: 0.5rem;
        }

        :global(.text-4xl) {
            font-size: 1.5rem !important;
        }

        :global(.space-y-4) {
            gap: 0.75rem !important;
        }

        :global(.p-6) {
            padding: 1rem !important;
        }

        :global(.mt-8) {
            margin-top: 1.5rem !important;
        }
    }

    /* Add smooth scrolling */
    :global(html) {
        scroll-behavior: smooth;
    }

    /* Improve form responsiveness */
    :global(input),
    :global(button) {
        width: 100%;
        max-width: 100%;
        box-sizing: border-box;
    }

    :global(.picker) {
        flex-direction: row;
        gap: 0.5rem;
        margin: 1rem 0;
    }

    @media screen and (max-width: 480px) {
        :global(.picker) {
            flex-direction: column;
        }

        :global(.picker > div) {
            width: 100%;
            margin-bottom: 0.5rem;
        }
    }

    /* Add card animations */
    :global(.card-body) {
        transition: transform 0.3s ease;
    }

    :global(.card-body:hover) {
        transform: translateY(-5px);
    }

    /* Improve form layout on small screens */
    @media screen and (max-width: 640px) {
        :global(form) {
            padding: 1rem;
        }

        :global(label) {
            font-size: 0.875rem;
        }

        :global(input) {
            padding: 0.5rem;
            font-size: 0.875rem;
        }

        :global(button) {
            padding: 0.5rem;
            font-size: 0.875rem;
        }
    }

    .event-details-card {
        box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06),
            0 0 0 1px rgba(255, 255, 255, 0.05);
        transform-style: preserve-3d;
        backface-visibility: hidden;
    }

    .event-details-card:hover {
        box-shadow:
            0 8px 12px -1px rgba(0, 0, 0, 0.2),
            0 4px 8px -1px rgba(0, 0, 0, 0.1),
            0 0 0 1px rgba(199, 174, 147, 0.2);
        transform: translateY(-2px);
    }

    .event-detail-item {
        display: flex;
        align-items: center;
        padding: 0.5rem;
        border-radius: 0.5rem;
        background-color: rgba(255, 255, 255, 0.05);
        transition: all 0.2s ease;
    }

    .event-detail-item:hover {
        background-color: rgba(255, 255, 255, 0.1);
        transform: translateX(4px);
    }

    .team-size-info {
        font-weight: 500;
        letter-spacing: 0.025em;
    }

    @media (max-width: 640px) {
        .event-details-card {
            margin-left: 0;
            margin-right: 0;
            padding: 1rem;
        }

        .event-detail-item {
            padding: 0.375rem;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .event-details-card,
        .event-detail-item {
            transition: none;
        }
    }

    .image-wrapper {
        position: relative;
        overflow: hidden;
        transform-style: preserve-3d;
        will-change: transform;
    }

    .image-container {
        aspect-ratio: 20/5;
        transform-origin: center;
        will-change: transform;
    }

    .image-container img {
        transform-origin: center;
        height: 100%;
        width: 100%;
        object-fit: cover;
    }

    .image-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(
            180deg,
            transparent 0%,
            rgba(0, 0, 0, 0) 0%,
            rgba(0, 0, 0, 0.1) 100%
        );
        opacity: 0;
        transition: opacity 0.3s ease;
    }

   

    @media (hover: hover) and (min-width: 768px) {
        .image-container img:hover {
            scale: 1.05;
        }
    }

    @media (max-width: 940px) {
        .image-container {
            aspect-ratio: 4/3;
        }
    }

    @media (max-width: 768px) {
        .image-container {
            aspect-ratio: 5/3;
        }

        .image-container img {
            transform: none;
        }
    }

    @media (max-width: 480px) {
        .image-container {
            aspect-ratio: 1/1;
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .image-container img,
        .image-overlay {
            transition: none;
        }
    }

    .fade-in {
        opacity: 0;
        transform: translateY(30px) scale(0.98);
        transition:
            opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1),
            transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        will-change: opacity, transform;
    }

    .fade-in.show {
        opacity: 1;
        transform: translateY(0) scale(1);
    }

    /* Enhanced loading skeleton animation */
    @keyframes shimmer {
        0% {
            background-position: -200% 0;
            opacity: 0.5;
        }
        50% {
            opacity: 0.8;
        }
        100% {
            background-position: 200% 0;
            opacity: 0.5;
        }
    }

    .image-container {
        position: relative;
        overflow: hidden;
    }

    .image-container::before {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(
            90deg,
            rgba(199, 174, 147, 0.01) 25%,
            rgba(199, 174, 147, 0.15) 37%,
            rgba(199, 174, 147, 0.01) 63%
        );
        background-size: 200% 100%;
        animation: shimmer 2s;
        z-index: 1;
        opacity: 1;
        transition: opacity 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    .image-container.loaded::before {
        opacity: 0;
    }

    .image-container img {
        transform: scale(1.02);
        filter: blur(5px);
        transition:
            transform 0.8s cubic-bezier(0.16, 1, 0.3, 1),
            filter 0.8s cubic-bezier(0.16, 1, 0.3, 1);
    }

    .image-container.loaded img {
        transform: scale(1);
        filter: blur(0);
    }

    .event-details-card {
        opacity: 0;
        transform: translateY(20px);
        animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        animation-delay: 0.3s;
    }

    @keyframes slideUp {
        0% {
            opacity: 0;
            transform: translateY(20px);
        }
        100% {
            opacity: 1;
            transform: translateY(0);
        }
    }

    /* Stagger animation for event details */
    .event-detail-item {
        opacity: 0;
        transform: translateX(-10px);
        animation: slideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }

    .event-detail-item:nth-child(1) {
        animation-delay: 0.4s;
    }
    .event-detail-item:nth-child(2) {
        animation-delay: 0.5s;
    }
    .event-detail-item:nth-child(3) {
        animation-delay: 0.6s;
    }

    @keyframes slideIn {
        0% {
            opacity: 0;
            transform: translateX(-10px);
        }
        100% {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .fade-in,
        .image-container img,
        .event-details-card,
        .event-detail-item {
            transition: none;
            animation: none;
            transform: none;
        }

        .image-container::before {
            animation: none;
        }
    }
</style>
