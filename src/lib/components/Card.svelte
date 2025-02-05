<script>
    let { title, children } = $props();
</script>

<div>
    <div class="header">
        {#if title !== ""}
            <h2>{title}</h2>
        {/if}
        <div class="controls">
            <div class="btn close"></div>
            <div class="btn min"></div>
            <div class="btn max"></div>
        </div>
    </div>

    <div class="cont">
        {@render children()}
    </div>
</div>

<style>
    h2 {
        float: left;
        line-height: 1.5em;
        color: black;
        margin: 0;
    }
    .controls {
        float: right;
    }
    .header {
        box-sizing: border-box;
        width: 100%;
        height: 1.5em;
        padding: 0 0.4em;
    }
    .btn {
        display: inline-block;
        width: 0.6em;
        height: 0.6em;
        margin-left: 0.4em;
        border-radius: 50%;
        background-color: #777;
    }
    .btn.close {
        background-color: #e33;
    }
    .btn.min {
        background-color: #ee0;
    }

    .btn.max {
        background-color: #0b0;
    }

    div {
        background-color: #cacaca;
        border-radius: 6px;
        width: fit-content;
    }
    .cont {
        background-color: #efefef;
        border-radius: 6px;
        padding: 12px;
        border-top-left-radius: 0;
        border-top-right-radius: 0;
    }
</style>
