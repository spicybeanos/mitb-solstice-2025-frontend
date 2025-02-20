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
        ? "background-color:var(--btn-active-dark)"
        : danger
          ? "background-color:var(--btn-danger-dark)"
          : ""}
          style:padding="{padding}px"
>
    {@render children()}
</button>

<style>
    button:not(:disabled) {
        color: white;
        margin: 5px;
        cursor: pointer;
        border: solid;
        border-color: var(--border-dark-mode);
        transition: all 0.1s;
        box-shadow: 0px 4px white;
    }
    button:disabled{
        cursor: not-allowed;
        margin: 5px;
        border: solid;
        background-color: var(--btn-disable-light);
        border-width: 2px;
        border-color: var(--border-light-mode);
        border-radius: 10px;
        transform: translate(0, -4px);
        transition: all 0.1s;
    }

    button:not(:disabled):hover {
        transform: translate(0, -6px);
        box-shadow: 0px 6px white;
    }

    button:not(:disabled):active {
        transform: translate(0, 0px);
        box-shadow: 0px 0px white;
    }
</style>
