<script lang="ts">
    let eventID = $state("");
    let { data } = $props();
</script>

<div class="flex flex-col m-15">
    <h1>Enter event ID to view or edit event</h1>
    <div>Make sure you are the event head of that event!</div>
    <label for="eventID"
        >Event ID
        <input
            required
            name="eventID"
            bind:value={eventID}
            placeholder="Enter event ID"
        />
    </label>
    <div>
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
        border-color: lightcoral;
        padding: 5px 5px 5px 5px;
        color: lightcoral;
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
