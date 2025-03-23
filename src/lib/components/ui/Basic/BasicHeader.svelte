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
        text-align: center;
        margin: 5px 5px 5px 5px;
        font-family: 'akira';
    }
</style>