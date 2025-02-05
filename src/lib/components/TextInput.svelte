<script>
    let {text = $bindable(),type='text',placeholder='',name='',required=false,maxLength=40} = $props();
</script>
{#if type !== 'textarea'}
<input type={type} bind:value={text} placeholder={placeholder} name={name} required={required} maxlength={maxLength}/>
{:else}
<textarea bind:value={text} placeholder={placeholder} name={name} required={required} maxlength={maxLength}></textarea>
{/if}
<style>
    input,textarea{
        margin: 10px;
        padding: 7px;
        border: none;
        border-radius: 6px;
        border-style: solid;
        border-width: 1px;
        border-color: black;
        box-shadow:  4px 4px black;
        transition: all 0.1s;
        width:95%;
    }

    input:focus,textarea:focus{
        outline: none;
        box-shadow:  8px 8px black;
    }
</style>