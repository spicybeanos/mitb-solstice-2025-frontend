<script lang='ts'>

    import type { FalakPass } from '$lib/components/FalakPass.js';
    import { onMount } from 'svelte';


    let {data} = $props();
    let passes:FalakPass[] = $state([]);

    onMount(() => {
        passes = data.passes;
    });

</script>


<style>

</style>