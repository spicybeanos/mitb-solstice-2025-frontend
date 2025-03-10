<script lang="ts">
    import SimpleCard from '$lib/components/SimpleCard.svelte';
    import BasicHeader from '$lib/components/ui/Basic/BasicHeader.svelte';
    import BasicButtonFilled from '$lib/components/ui/Basic/BasicButtonFilled.svelte'
    import BasicInput from '$lib/components/ui/Basic/BasicInput.svelte'

    let { data } = $props();
    let selectedAdd = $state(data.otherPasses[0].id);
    let toBeAdded = $state('');

    let selectedRemove = $state(data.eventPasses[0].id);
    let toBeRemoved = $state('');

    function addPass(){
        if(toBeAdded == ''){
            toBeAdded = selectedAdd;
        }else{
            toBeAdded = toBeAdded + "&" + selectedAdd;
        }
    }
</script>

<div class="flex justify-center">
    <div class="p-[30px]">
        <SimpleCard>
            <BasicHeader>
                Assign or unassign passes to an event
            </BasicHeader>
            <form action="?/modifyPasses" method="post">
                    <BasicInput placeholder='passes to be assign' bind:value={toBeAdded} />
            </form>
            <select class="text-white" bind:value={selectedAdd}>
                {#each data.otherPasses as p}
                    <option value={p.id}>{p.name}</option>
                {/each}
            </select>
            <BasicButtonFilled OnClick={addPass}>ASSIGN</BasicButtonFilled>
            <select class="text-white" bind:value={selectedAdd}>
                {#each data.eventPasses as p}
                    <option value={p.id}>{p.name}</option>
                {/each}
            </select>
            <BasicButtonFilled OnClick={addPass}>ASSIGN</BasicButtonFilled>
        </SimpleCard>
    </div>
</div>
