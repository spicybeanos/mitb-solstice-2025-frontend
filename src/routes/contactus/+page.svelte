<script lang="ts">
    import { information } from "$lib/components/ContactUs";
    import Card from "$lib/components/Card.svelte";
</script>

<div class="mid">
    <div class="centre">
        {#each information as info}
        <div class="m-[5px]">
            <Card title={info.position}>
                <div class=" w-[280px]">{info.name}</div>
                <div>{info.contact}</div>
            </Card>
        </div>
            
        {/each}
    </div>
</div>

<style>
   
    .mid{
        height: 60vh;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    .centre {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        flex-direction: column;
    }
</style>
