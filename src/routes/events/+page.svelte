<script lang="ts">
    import type { FalakEvent } from "$lib/components/Events.ts";
    // import Button from "$lib/components/Button.svelte";
    // import Card from "$lib/components/Card.svelte";
    import TextInput from "../../lib/components/TextInput.svelte";
    // import EventCard from "$lib/components/EventCard.svelte";
    //import { events } from "$lib/components/Events.ts";
    let isMouseEntered = false;
    // import AButton from "$lib/components/AButton.svelte";
    import { onMount } from "svelte";
  import { CardBody, CardContainer, CardItem } from "$lib/components/ui/ThreeDCardEffect/index.js";
  import { UserProfileData } from "../GoogleLogin.svelte.ts";

    let events:FalakEvent[] = $state([]);
    // TO BE REMOVED, ONLY HERE TO POPULATE WITH CONTENT TILL BACKEND IS CONNECTED

    let { data } = $props();
    $inspect(data.events);

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
                                <CardContainer bind:isMouseEntered className="inter-var ">
                                    <CardBody className="bg-gray-50 flex flex-col justify-between relative group/card  dark:hover:shadow-2xl dark:hover:shadow-purple-500/[0.1]  dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto  sm:w-[24rem] h-[37rem] rounded-xl p-6 border">
                                        <CardItem {isMouseEntered} translateZ="100" className="w-full mb-4 hover:translate-z-8">
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
                                            <pre>Team size: {` ${event.teamSize} ${event.teamSize === 1 ? ' person' : ' people'}`}</pre>
                                        </CardItem>
                                        <div class=" w-full bg-[#D9D9D9] rounded-lg flex justify-center p-2 cursor-pointer">
                                            <a href={`/events/${event.id}/`}>
                                            <CardItem
                                                
                                                {isMouseEntered}
                                                translateZ={20}
                                                className="px-4 py-2 text-[#1d1d1d] text-xs font-bold cursor-pointer "
                                            >
                                               Register
                                            </CardItem>
                                        </a>
                                        </div>
                                    </CardBody>
                                </CardContainer>
                            </div>
                        {/if}
                    {/if}
                {:else}
                    <div class="e-margin">
                        <CardContainer bind:isMouseEntered className="inter-var">
                            <CardBody className="bg-gray-50 flex flex-col justify-between relative group/card h-[37rem] dark:hover:shadow-2xl dark:hover:shadow-purple-500/[0.1]  dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto  sm:w-[24rem] rounded-xl p-6 border">
                                <CardItem {isMouseEntered} translateZ="100" className="w-full mb-4 hover:translate-z-8">
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
                                    <pre>Team size: {` ${event.teamSize} ${event.teamSize === 1 ? ' person' : ' people'}`}</pre>
                                </CardItem>
                                <div class=" w-full bg-[#D9D9D9] rounded-lg flex justify-center p-2 cursor-pointer">
                                    <a href={UserProfileData.loggedIn?`/events/${event.id}/`:`/profile`}>
                                    <CardItem
                                        
                                        {isMouseEntered}
                                        translateZ={20}
                                        className="px-4 py-2 text-[#1d1d1d] text-xs font-bold cursor-pointer "
                                    >
                                        Register
                                    </CardItem>
                                </a>
                                </div>
                            </CardBody>
                        </CardContainer>
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
</style>
