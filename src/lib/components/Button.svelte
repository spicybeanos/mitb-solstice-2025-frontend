<script lang="ts">
    let {
        OnClicked = (event: MouseEvent & { currentTarget: EventTarget & HTMLButtonElement; }) => {},
        active = false,
        children,
        danger = false,
        padding = 18,
        disable=false
    } = $props();
</script>

<button
    disabled={disable}
    onclick={OnClicked}
    style={active
        ? "background-color:lightgreen"
        : danger
          ? "background-color:red"
          : ""}
          style:padding="{padding}px"
>
    {@render children()}
</button>

<style>
    button:not(:disabled) {
        margin: 5px;
        cursor: pointer;
        border: solid;
        border-width: 2px;
        border-color: black;
        border-radius: 10px;
        transform: translate(0, -4px);
        transition: all 0.1s;
        box-shadow: 0px 4px black;
    }
    button:disabled{
        cursor: not-allowed;
        margin: 5px;
        border: solid;
        background-color: pink;
        border-width: 2px;
        border-color: black;
        border-radius: 10px;
        transform: translate(0, -4px);
        transition: all 0.1s;
    }

    button:not(:disabled):hover {
        transform: translate(0, -6px);
        box-shadow: 0px 6px black;
    }

    button:not(:disabled):active {
        transform: translate(0, 0px);
        box-shadow: 0px 0px black;
    }
</style>
