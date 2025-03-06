<script lang="ts">
    import SimpleCard from "$lib/components/SimpleCard.svelte";
    import BasicHeader from '$lib/components/ui/Basic/BasicHeader.svelte'
    import BasicInput from '$lib/components/ui/Basic/BasicInput.svelte'
    import BasicButtonFilled from '$lib/components/ui/Basic/BasicButtonFilled.svelte'

</script>

<div class="flex justify-center">
    <div class="p-[30px]">
        <SimpleCard>
            <BasicHeader>
                Create a new Event
            </BasicHeader>
            <form action="?/updateEvent" method="POST" class="flex flex-col">
                <label class="text-white" for="name">Name:</label>
                <BasicInput
                    required
                    name="name"
                    placeholder="Event name"
                />
                <label class="text-white" for="desc">Description:</label>
                <BasicInput
                    required
                    name="desc"
                    placeholder="Event description"
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
                        {#each eventCategories as cat}
                            <option value={cat}>
                                {cat}
                            </option>
                        {/each}
                    </select>
                    <label class="text-white" for="start">Start:</label>
                    <BasicInput
                        required
                        type="datetime-local"
                        name="start"
                    />
                </div>
    
                <BasicButtonFilled>Submit</BasicButtonFilled>
            </form>
        </SimpleCard>
    </div>
</div>