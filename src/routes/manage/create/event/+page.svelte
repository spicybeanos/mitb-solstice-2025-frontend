<script lang="ts">
    import SimpleCard from "$lib/components/SimpleCard.svelte";
    import BasicHeader from "$lib/components/ui/Basic/BasicHeader.svelte";
    import BasicInput from "$lib/components/ui/Basic/BasicInput.svelte";
    import BasicButtonFilled from "$lib/components/ui/Basic/BasicButtonFilled.svelte";

    export const EventCategories = [
        "cultural",
        "e_sports",
        "experiences",
        "finance",
        "hackathon",
        "other",
        "pro_show",
        "robotics",
        "sports",
        "technical",
    ];
    const { form } = $props();
</script>

<div class="flex justify-center">
    <div class="p-[30px]">
        <SimpleCard>
            <BasicHeader>Create a new Event</BasicHeader>
            {#if form?.success == true}
                <div>Event created successfully!</div>
            {:else if form?.success == false}
                <div>Could not create event: {form?.error}</div>
            {/if}
            <form action="?/createEvent" method="POST" class="flex flex-col">
                <label class="text-white" for="name">Name:</label>
                <BasicInput required name="name" placeholder="Event name" />
                <label class="text-white" for="desc">Description:</label>
                <BasicInput
                    required
                    name="desc"
                    placeholder="Event description"
                    multiline={true}
                />
                <div>
                    <label class="text-white" for="venue">Venue:</label>
                    <BasicInput
                        required
                        name="venue"
                        placeholder="Venue of the event"
                    />
                    <label class="text-white" for="team_mem">Members: </label>
                    <BasicInput
                        required
                        name="team_mem"
                        placeholder="Number of members in a team"
                        type="number"
                    />
                </div>
                <div>
                    <label class="text-white" for="type"> Type: </label>
                    <select
                        required
                        name="type"
                        class="border p-[8px] rounded-md bg-white"
                    >
                        {#each EventCategories as cat}
                            <option value={cat}>
                                {cat}
                            </option>
                        {/each}
                    </select>
                    <label class="text-white" for="start">Start:</label>
                    <BasicInput required type="datetime-local" name="start" />
                </div>
                <label class="text-white" for="start">Organizer email:</label>
                <BasicInput
                    required
                    placeholder="organizer email"
                    type="email"
                    name="org"
                />

                <BasicButtonFilled>Submit</BasicButtonFilled>
            </form>
        </SimpleCard>
    </div>
</div>


<style>
    div{
        color:white
    }
</style>