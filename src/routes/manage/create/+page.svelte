<script lang="ts">
    import SimpleCard from "$lib/components/SimpleCard.svelte";

    let { data } = $props();
</script>

<div class="flex justify-center">
    <div class="p-[30px]">
        <SimpleCard>
            <div>Hello world</div>
        </SimpleCard>
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
        border-radius: 10px;
        border-color: lightcoral;
        padding: 10px 10px 10px 10px;
        color: lightcoral;
        margin: 15px 15px 15px 15px;
        margin-top: 30px;

        background: rgba(0, 0, 0, 0.15);
        backdrop-filter: blur(15px) saturate(120%);
        -webkit-backdrop-filter: blur(15px) saturate(120%);
        border-radius: 15px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        padding: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        transition: all 0.3s ease-in-out;
    }
    a:hover {
        background: rgba(255, 255, 255, 0.075);
        backdrop-filter: blur(20px);
    }
</style>
