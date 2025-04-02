<script>
    let {children,className='bg-black',padding='2'} = $props()
</script>

<div
    class={`${className} p-${padding} flex justify-center text-white backdrop-blur-sm inset-shadow-xs  inset-shadow-cyan-500/50 rounded-xl m-1 hover:shadow-sm hover:inset-shadow-sm shadow-cyan-500/50 transition-all duration-500`}
>
    <div >{@render children()}</div>
</div>