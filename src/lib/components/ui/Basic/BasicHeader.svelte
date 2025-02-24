<script lang="ts">
    let {children} = $props();
</script>
<h1>
    {@render children()}
</h1>

<style>
    h1{
        color: white;
        font-size: xx-large;
    }
</style>