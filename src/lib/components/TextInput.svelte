<script>
    let {text = $bindable(),type='text',placeholder='',name='',required=false,maxLength=40} = $props();
</script>
{#if type !== 'textarea'}
<input class="w-full p-2 border text-white bg-[#1d1d1d] m-[5px]" type={type} bind:value={text} placeholder={placeholder} name={name} required={required} maxlength={maxLength}/>
{:else}
<textarea class="rounded-lg w-full p-2 border text-white bg-[#1d1d1d] m-[5px]" bind:value={text} placeholder={placeholder} name={name} required={required} maxlength={maxLength}></textarea>
{/if}
<style>
    input,textarea{
        outline: none;
    }
</style> 