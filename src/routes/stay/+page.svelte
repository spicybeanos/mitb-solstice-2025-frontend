<script lang="ts">
    import Card from "$lib/components/Card.svelte";
    import AButton from "$lib/components/AButton.svelte";

    let {data} = $props()
</script>

<div class="mid">
    <div class="m-[5px]">
        <Card title='For more information, contact:'>
            <div class=" w-[280px]">Atharv Maikhuri</div>
            <div class="text-white">+91 79069 52055</div>
            <code class="text-white">atharvamaik200@gmail.com</code>
            <br>
            <AButton href={data.form}>Accomodation google form</AButton>
        </Card>
    </div>
</div>

<style>
    .mid {
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
        color: white;
    }
</style>
