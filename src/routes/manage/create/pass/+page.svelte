<script lang="ts">
    import SimpleCard from "$lib/components/SimpleCard.svelte";
    import BasicButtonFilled from "$lib/components/ui/Basic/BasicButtonFilled.svelte";

    import BasicHeader from "$lib/components/ui/Basic/BasicHeader.svelte";
    import BasicInput from "$lib/components/ui/Basic/BasicInput.svelte";
    let { data, form } = $props();
</script>

<div class="flex justify-center">
    <SimpleCard>
        <div class="m-[10px] rounded-xl">
            <BasicHeader>Create a pass</BasicHeader>
            {#if form?.msg}
                <div class="text-white">Error: {form?.msg}</div>
            {/if}
            <form action="?/createPass" method="post">
                <div class="flex flex-col">
                    <label>
                        Pass name:
                        <BasicInput
                            name="name"
                            placeholder="Pass name"
                            required
                        />
                    </label>
                    <label>
                        Pass description:
                        <BasicInput
                            name="desc"
                            placeholder="Pass description"
                            required
                            multiline={true}
                        />
                    </label>
                    <label>
                        Pass cost:
                        <BasicInput
                            name="price"
                            placeholder="Pass cost"
                            required
                            type="number"
                        />
                    </label>
                    <BasicButtonFilled>Create/Edit</BasicButtonFilled>
                </div>
            </form>
        </div>
    </SimpleCard>
</div>

<style>
    label {
        color: white;
    }
</style>
