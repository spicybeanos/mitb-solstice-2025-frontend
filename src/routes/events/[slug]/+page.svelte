<script lang="ts">
    import type { FalakEvent } from "$lib/components/Events.js";
    import { onMount } from "svelte";
    import {events} from "$lib/components/Events.js";
    import Card from "$lib/components/Card.svelte";
    import { CardBody, CardContainer, CardItem } from "$lib/components/ui/ThreeDCardEffect/index.js";

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
    <CardContainer bind:isMouseEntered className="inter-var ">
        <CardBody className="bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto   h-auto rounded-xl p-6 border">
            <CardItem {isMouseEntered} translateZ="100" className="w-full mb-4">
                <img
                    src={event.pictureURL}
                    height="1000"
                    width="1000"
                    class="h-60 w-full rounded-xl object-fill group-hover/card:shadow-xl"
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
