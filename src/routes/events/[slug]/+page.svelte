<script lang="ts">
    import type { FalakEvent } from "$lib/components/Events.js";
    import { onMount } from "svelte";
    import {events} from "$lib/components/Events.js";
    import Card from "$lib/components/Card.svelte";
    import { CardBody, CardContainer, CardItem } from "$lib/components/ui/ThreeDCardEffect/index.js";


    let teamLeader = $state("");
    let teamMember2 = $state("");
    let teamMember3 = $state("");
    let team = $state(false);
    let isMouseEntered = false;
    let { data } = $props();
    let event: FalakEvent = $state({
        img_alt:"picture of the event",
        name: "",
        id: "",
        title: "",
        description: "",
        date: "",
        time: "",
        duration: 0,
        teamSize: 1,
        pictureURL: '',
    });

    function toggleTeam() {
    team = !team; 
    }
    function register() {
    console.log("Registering:", { teamLeader, teamMember2, teamMember3 });
    }

    onMount(() => {
        const eventID = data.slug;
        
        events.forEach(element => {
            if(element.id === eventID){
                event = element;
            }
        });
    });
    
</script>
<div class="centre main">
    <CardContainer bind:isMouseEntered className="inter-var my-16 ">
        <CardBody className=" bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[60rem] h-auto rounded-xl p-6 border">
            <CardItem {isMouseEntered} translateZ="100" className="w-full  mb-4 flex justify-center ">
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
                <pre>Team size: {` ${event.teamSize} ${event.teamSize === 1 ? ' person' : ' people'}`}</pre>
            </CardItem>
            <CardItem
            className="w-full flex flex-col"
            >   
                <div class="picker relative sm:px-2 flex justify-between font-light text-xs">
                    <div class={`rounded-xs w-1/2 text-center py-1 ${!team  ? `bg-white text-black`:`bg-[#1d1d1d] text-white border `}`}><button class="cursor-pointer" onclick={toggleTeam}>New Team</button></div>
                    <div class={`rounded-xs w-1/2 text-center py-1 ${team ? `bg-white text-black`: `bg-[#1d1d1d] text-white border `}`}><button class="cursor-pointer" onclick={toggleTeam}>Existing Team</button></div>
                </div>
                {#if !team}
                <div class="bg-black text-white w-full pt-2 sm:pt-8">
                    <div class="mb-8">
                      <label class="block mb-1">Team leader</label>
                      <input placeholder="Enter Name" class="w-full p-2 border text-white bg-[#1d1d1d]" bind:value={teamLeader} />
                    </div>
                  
                    <div class="mb-4 sm:mb-8">
                      <label class="block mb-1">Team member 2</label>
                      <input placeholder="Enter Name" class="w-full p-2 border text-white bg-[#1d1d1d]" bind:value={teamMember2} />
                    </div>
                  
                    <div class="mb-4 sm:mb-8">
                      <label class="block mb-1">Team number 3</label>
                      <input placeholder="Enter Name" class="w-full p-2 border text-white bg-[#1d1d1d]" bind:value={teamMember3} />
                    </div>
                  
                    <button class="w-full text-center bg-white text-black hover:bg-black hover:text-white transition-all duration-200 p-2 rounded-sm" onclick={register}>Register</button>
                  </div>
                {/if}
            </CardItem>
        </CardBody>
    </CardContainer>
</div>
<style>
    img{
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
