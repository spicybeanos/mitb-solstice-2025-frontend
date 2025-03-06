<script lang="ts">
    import SimpleCard from "./SimpleCard.svelte";
    let {children} = $props();
</script>

<SimpleCard>
    <div> 
        <img src='/icons/info.svg' alt='info icon'/>
        {@render children()}
    </div>
</SimpleCard>