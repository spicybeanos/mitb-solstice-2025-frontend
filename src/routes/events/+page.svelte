<script>
    import Button from "$lib/components/Button.svelte";
    import Card from "$lib/components/Card.svelte";
    import TextInput from "$lib/components/TextInput.svelte";
    import EventCard from "$lib/components/EventCard.svelte";

    let { data } = $props();
    let events = [1];
</script>

<div class="centre">
    <div class="hotbar">
        <TextInput placeholder="Event name or @event ID" />
        <Button active>Search</Button>
    </div>

    <div class="eventCont">
        <EventCard/>
    </div>
</div>

<style>
    img {
        z-index: 0;
        height: 100%;
        overflow: hidden;
    }
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
</style>
