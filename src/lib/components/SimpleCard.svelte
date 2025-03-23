<script lang="ts">
    let {children} = $props();
</script>

<div>
{@render children()}
</div>

<style>
    div{
        background: rgba(194, 194, 194, 0.15);
        backdrop-filter: blur(15px) saturate(120%);
        -webkit-backdrop-filter: blur(15px) saturate(120%);
        border-radius: 15px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        padding: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        transition: all 0.3s ease-in-out;
        margin: 10px;
    }

    div:hover{
        background: rgba(255, 255, 255, 0.075);
        backdrop-filter: blur(20px);
    }
</style>