<script lang="ts">
    let {placeholder='',name='',type='',required=false,value=$bindable(),multiline=false} = $props();
</script>

{#if multiline == false}
<input
    class="border-none outline-none focus:ring-0 focus:border-transparent"
    {required}
    {type}
    {name}
    {placeholder}
    bind:value={value}
/>
{:else}
<textarea
    class="border-none outline-none focus:ring-0 focus:border-transparent"
    {required}
    {name}
    {placeholder}
    bind:value={value}
></textarea>
{/if}

<style>
    input,textarea {
        margin: 5px 5px 5px 5px;
        border: none;
        border-style: solid;
        border-width: 0px;
        border-color: lightblue;
        border-bottom-width: 1px;
        border-top-left-radius: 4px;
        border-top-right-radius: 4px;
        padding: 9px 9px 9px 9px;
        color: lightblue;
        background-color: rgb(52, 52, 52);
    }
</style>
