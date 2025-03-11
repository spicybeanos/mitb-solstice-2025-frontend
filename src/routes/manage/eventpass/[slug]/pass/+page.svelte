<script lang="ts">
    import SimpleCard from "$lib/components/SimpleCard.svelte";
    import BasicHeader from "$lib/components/ui/Basic/BasicHeader.svelte";
    import BasicButtonFilled from "$lib/components/ui/Basic/BasicButtonFilled.svelte";
    import BasicInput from "$lib/components/ui/Basic/BasicInput.svelte";
    import BasicButtonOutline from "$lib/components/ui/Basic/BasicButtonOutline.svelte";

    let { data,form } = $props();
    let selectedAdd = $state(data.otherPasses[0].id);
    let toBeAdded = $state("");

    let selectedRemove = $state("");
    let toBeRemoved = $state("");

    function addPass() {
        if (toBeAdded == "") {
            toBeAdded = selectedAdd;
        } else {
            toBeAdded = toBeAdded + " & " + selectedAdd;
        }
    }
    function addRemPass() {
        if (toBeRemoved == "") {
            toBeRemoved = selectedRemove;
        } else {
            toBeRemoved = toBeRemoved + " & " + selectedRemove;
        }
    }
</script>

<div class="flex justify-center">
    <div class="p-[30px] flex flex-col">
        <SimpleCard>
            <BasicHeader>Assign or unassign passes to an event</BasicHeader>
            {#if form?.msg}
            <div class="text-white">{form.msg}</div>
            {/if}
            {#if form?.err}
            <div class="text-white">Error : {form.err}</div>
            {/if}
            <form action="?/modifyPasses" method="post" class="flex flex-col">
                <BasicInput
                    placeholder="passes to be assigned"
                    bind:value={toBeAdded}
                    name='assign'
                />
                <BasicInput
                    placeholder="passes to be unassigned"
                    bind:value={toBeRemoved}
                    name='remove'
                />
                <BasicButtonFilled>SUBMIT</BasicButtonFilled>
            </form>
            <div>
                <select class="text-white" bind:value={selectedAdd}>
                    {#each data.otherPasses as p}
                        <option value={p.id}>{p.name}</option>
                    {/each}
                </select>
                <BasicButtonOutline color="white" OnClick={addPass}
                    >ASSIGN</BasicButtonOutline
                >
            </div>
            <div>
                <select class="text-white" bind:value={selectedRemove}>
                    {#each data.eventPasses as p}
                        <option value={p.id}>{p.name}</option>
                    {/each}
                </select>
                <BasicButtonOutline color="red" OnClick={addRemPass}
                    >REMOVE</BasicButtonOutline
                >
            </div>
        </SimpleCard>
    </div>
</div>
