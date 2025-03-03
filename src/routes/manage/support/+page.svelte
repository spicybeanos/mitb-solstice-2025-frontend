<script lang="ts">
    import BasicHeader from "$lib/components/ui/Basic/BasicHeader.svelte";

    let { data } = $props();
</script>

<div class="flex justify-center">
    <div class="p-[30px]">
        <BasicHeader>Support Tickets</BasicHeader>
        <div class="flex flex-wrap">
            {#if data?.err}
                <div class="text-red-400">{data?.err}</div>
            {/if}
            {#each data.tickets as tick} 
                <div
                    class="border border-gray-300 rounded-lg p-2.5 flex flex-col m-[5px]"
                >
                    <b style:color={tick.solved ? 'lightgreen' : 'red'}>Category : {tick.category}</b>
                    {#if tick.category == 'Other'}
                    <div>Problem: {tick.problem}</div>
                    {/if}
                    <div>{tick.name} {tick.phone} {tick.email}</div>
                    <div>{tick.description}</div>
                    <a class="text-blue-400 " href={`/manage/support/${tick.ticketID}`}>Visit</a>
                </div>
            {/each}
        </div>
    </div>
</div>

<style>
    div {
        color: white;
    }
</style>
