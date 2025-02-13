<script lang="ts">
    let {children} = $props();
</script>

<div>
{@render children()}
</div>

<style>
    div{
        border-radius: 10px;
        padding: 20px 20px 20px 20px;
        background-color: black;
    }
</style>