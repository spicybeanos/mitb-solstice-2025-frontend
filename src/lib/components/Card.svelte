<script>
    let { title, children } = $props();
</script>

<div>
    <div class="header">
        {#if title !== ""}
            <h2>{title}</h2>
        {/if}
    </div>

    <div class="cont">
        {@render children()}
    </div>
</div>

<style>
    h2 {
        float: left;
        line-height: 1.5em;
        color: white;
        margin: 0;
    }
    .header {
        box-sizing: border-box;
        width: 100%;
        height: 1.5em;
        padding: 0 0.4em;
    }
    div {
        background-color: #343434;
        border-radius: 6px;
        width: fit-content;
        color: rgb(204, 203, 203);
    }
    .cont {
        background-color: #222;
        border-radius: 6px;
        padding: 12px;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
    }
</style>
