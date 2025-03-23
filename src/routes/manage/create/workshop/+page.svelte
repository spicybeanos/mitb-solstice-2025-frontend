<script lang="ts">
    import SimpleCard from "$lib/components/SimpleCard.svelte";
    import BasicHeader from "$lib/components/ui/Basic/BasicHeader.svelte";
    import BasicInput from "$lib/components/ui/Basic/BasicInput.svelte";
    import BasicButtonFilled from "$lib/components/ui/Basic/BasicButtonFilled.svelte";

    const { form } = $props();
</script>

<div class="flex justify-center">
    <div class="p-[30px]">
        <SimpleCard>
            <BasicHeader>Create a new Workshop</BasicHeader>
            {#if form?.success == true}
                <div>workshop created successfully!</div>
            {:else if form?.success == false}
                <div>Could not create workshop: {form?.error}</div>
            {/if}
            <form action="?/createWorkshop" method="POST" class="flex flex-col">
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
                    <label class="text-white" for="venue">Club:</label>
                    <BasicInput
                        required
                        name="club"
                        placeholder="Venue of the event"
                    />
                </div>
                <div>
                    <label class="text-white" for="start">Date from:</label>
                    <BasicInput required type="datetime-local" name="dfrom" />
                    <label class="text-white" for="start">Date to:</label>
                    <BasicInput required type="datetime-local" name="dto" />
                </div>
                <label class="text-white" for="start">Image url:</label>
                <BasicInput
                    placeholder="image url"
                    name="image_url"
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