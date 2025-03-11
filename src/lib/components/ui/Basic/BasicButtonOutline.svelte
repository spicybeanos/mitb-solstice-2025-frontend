<script lang="ts">
    let {
        OnClick = (
            event: MouseEvent & {
                currentTarget: EventTarget & HTMLButtonElement;
            },
        ) => {},
        children,
        disable = false,
        color = "#5C5C78",
    } = $props();
</script>

<button
    disabled={disable}
    onclick={OnClick}
    style:background='transparent'
    style:color={color}
    style:border-color={color}
    >{@render children()}</button
>

<style>
    button {
        border-style: solid;
        border-width: 2px;
        border-radius: 0.5em;
        padding: 9px 9px 9px 9px;
        padding-left: 20px;
        padding-right: 20px;
        margin: 10px 5px 5px 5px;
        background-color: lightblue;
    }
    button:hover{
        cursor: pointer;
    }
</style>
