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
        border-radius: 10px;
    }
    button:disabled{
        cursor: not-allowed;
        margin: 5px;
        border: solid;
        background-color: var(--btn-disable-light);
    }
</style>
