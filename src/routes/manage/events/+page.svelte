<script lang="ts">
    import BasicInput from "$lib/components/ui/Basic/BasicInput.svelte";

    let eventID = $state("");
    let { data } = $props();
</script>

<div class="flex justify-center">
    <div class="p-[30px]">
        <h1>Enter event ID to view or edit event</h1>
        <div>Make sure you are the event head of that event!</div>

        <BasicInput
            required
            name="eventID"
            bind:value={eventID}
            placeholder="Enter event ID"
        />

        <a href={`/manage/events/${eventID.trim()}/edit`}>Edit event</a>
        <a href={`/manage/events/${eventID.trim()}/teams`}>View teams</a>
    </div>
</div>

<style>
    h1,
    div {
        color: white;
    }
    h1 {
        font-size: xx-large;
    }
    a {
        border-style: solid;
        border-width: 1px;
        border-radius: 10px;
        border-color: lightcoral;
        padding: 10px 10px 10px 10px;
        color: lightcoral;
        margin: 15px 15px 15px 15px;
        margin-top: 30px;
    }
    input {
        border-style: solid;
        border-width: 1px;
        border-color: lightblue;
        padding: 5px 5px 5px 5px;
        color: lightblue;
        margin: 1em 1em 1em 1em;
    }
    button {
        border-style: solid;
        border-width: 1px;
        border-color: lightblue;
        color: black;
        padding: 5px 5px 5px 5px;
        margin: 10px 5px 5px 5px;
        background-color: lightblue;
    }
</style>
