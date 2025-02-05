<script>
    import Button from "$lib/components/Button.svelte";
    import Card from "$lib/components/Card.svelte";
    import TextInput from "$lib/components/TextInput.svelte";
    import { events } from "$lib/components/Events.ts";
    import AButton from "./AButton.svelte";
</script>

<div class="centre">
    {#each events as event}
        <div class="margin">
            <Card title={`@${event.id}`}>
                <div class="aspect" >
                    <!-- svelte-ignore a11y_img_redundant_alt -->
                    <img
                        src={event.pictureURL}
                        alt="picture for the event"
                    />
                    <h1>{event.name}</h1>
                    <div class="nowrap">{event.description}</div>
                    <AButton href={`/events/${event.id}/`}>Learn more!</AButton>
                </div>
            </Card>
        </div>
    {/each}
</div>

<style>
    img{
        border-radius: 0.5em;
        width: min(80vw,360px);
    }
    .margin {
        margin: 10px;
    }
    .aspect {
        aspect-ratio: 1.423 / 1.8;
        width: min(80vw,15em);
    }
    .nowrap {
        height: 5em;
        overflow: auto;
    }
    .mid {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: fit-content;
        flex-wrap: wrap;
    }
    .centre {
        width: fit-content;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
    }
</style>
