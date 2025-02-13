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
        color: var(--text-dark);
        margin: 10px;
        padding: 7px;
        border: none;
        border-radius: 0px;
        border-style: solid;
        border-width: 1px;
        border-color: var(--border-dark-mode);
        box-shadow:  0px 0px var(--border-dark-mode);
        transition: all 0.1s;
        width:95%;
    }

    input:focus,textarea:focus{
        outline: none;
        box-shadow:  0px 4px var(--border-dark-mode);
    }
</style>