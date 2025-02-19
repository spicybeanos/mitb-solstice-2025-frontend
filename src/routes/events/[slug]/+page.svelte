<script lang="ts">
    import type { SolsticeEvent } from "$lib/components/Events.js";
    import { onMount } from "svelte";
    import { enhance } from '$app/forms';
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
    import type { SolsticeTeamInfo } from "$lib/components/backend/BackendAgentTeam.js";

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
    let myTeam:SolsticeTeamInfo|null = $state(null)

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
        pictureURL: "",
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
        
        if(isInTeam){
            myTeam = data.team;
        }

        data.events.forEach((element) => {
            if (element.id === eventID) {
                event = toSolsticeEvent(element);
                teamSize = event.teamSize;
                teamMembers = Array(teamSize - 1).fill("");
            }
        });
    });

    async function handleNewTeam(){
        
    }

    let loading = $state(false);
    let error = $state("");
    let successMessage = $state("");
</script>

<div class="centre main">
    <CardContainer bind:isMouseEntered className="inter-var my-16 ">
        <CardBody
            className=" bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[60rem] h-auto rounded-xl p-6 border"
        >
            <CardItem
                {isMouseEntered}
                translateZ="100"
                className="w-full  mb-4 flex justify-center "
            >
                <img
                    src={event.pictureURL}
                    height="1000"
                    width="1000"
                    class="h-80 w-full rounded-xl object-cover group-hover/card:shadow-xl"
                    alt="thumbnail"
                />
            </CardItem>
            <CardItem
                {isMouseEntered}
                translateZ="50"
                className="text-xl w-full  text-[#C7AE93] flex mt-8 justify-between"
            >
                <div class="text font-extrabold">
                    {event.name}
                </div>
                <div class="text font-medium">
                    {`@${event.id}`}
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
                    <pre>No teams for this event!</pre>
                {/if}
            </CardItem>
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
                        <div style="color: white;">team info:
                            <pre>Team name : {form.team.name}</pre>
                            <pre>Team ID : {form.team.id}</pre>
                            <pre>Host ID : {form.team.host_id}</pre>
                        </div>
                    {/if}
                    <form action="?/newTeam" method="POST" use:enhance={handleNewTeam}>
                        <div class="bg-black text-white w-full pt-2 sm:pt-8">
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
                    <div class="bg-black text-white w-full pt-6 sm:pt-8">
                        <div class="mb-6 sm:mb-8">
                            <label for="team-ID" class="block mb-1"
                                >Team ID</label
                            >
                            <input
                                placeholder="Enter team name"
                                class="w-full p-2 border text-white bg-[#1d1d1d]"
                                bind:value={existing_team_ID}
                            />
                        </div>

                        <div class="mb-6 sm:mb-8">
                            <label for="member-name" class="block mb-1"
                                >Member Name</label
                            >
                            <input
                                placeholder="Enter your name"
                                class="w-full p-2 border text-white bg-[#1d1d1d]"
                                bind:value={new_member}
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
                            onclick={addMember}
                            disabled={loading}
                        >
                            {loading ? "Joining..." : "Join"}
                        </button>
                    </div>
                {:else}
                    <div class="bg-black text-white w-full pt-2 sm:pt-8 mt-6">
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
        </CardBody>
    </CardContainer>
</div>

<style>
    img {
        width: 60vw;
    }
    /* div{
        color: var(--text-light)
    } */
    .margin {
        margin: 10px;
    }
    .aspect {
        aspect-ratio: 1.423 / 1.8;
        width: 15em;
    }
    .nowrap {
        height: 5em;
        overflow: auto;
    }
    .mid {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 70vw;
        flex-wrap: wrap;
    }
    .centre {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
    }
</style>
