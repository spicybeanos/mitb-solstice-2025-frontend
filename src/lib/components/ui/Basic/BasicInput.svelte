<script lang="ts">
    let {placeholder='',name='',type='',required=false,value=$bindable()} = $props();
</script>

<input
    class="border-none outline-none focus:ring-0 focus:border-transparent"
    {required}
    {type}
    {name}
    {placeholder}
    bind:value={value}
/>

<style>
    input {
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
