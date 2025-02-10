<script lang="ts">
    import type { FalakEvent } from "$lib/components/Events.js";
    import { onMount } from "svelte";
    import {events} from "$lib/components/Events.js";
    import Card from "$lib/components/Card.svelte";

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
    })
</script>
<div class="centre main">
<Card title={`@${event.id}`}>
    <div class="mid">
        <div style="font-size: xx-large;font-weight: 900;">{event.title}</div>
        <img src={event.pictureURL} alt={event.img_alt}/>
        <div style="text-align: center;">{event.description}</div>
        <div> See you at {event.date} at {event.time} hrs!</div>
        <div>The event is {event.duration} {event.duration === 1? 'hour':'hours'}</div>
        <div>{#if event.teamSize <= 1}
            This event is a solo event
            {:else}
            The max team size is {event.teamSize}
            {/if}
        </div>
    </div>
</Card>
</div>
<style>
    img{
        width: 60vw;
    }
    div{
        color: var(--text-light)
    }
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