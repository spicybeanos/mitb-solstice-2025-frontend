<script>
    let {children,className='bg-black'} = $props()
</script>

<div
    class={`${className} flex justify-center text-white backdrop-blur-sm inset-shadow-xs  inset-shadow-cyan-500/50 rounded-xl p-2 m-1 hover:shadow-sm hover:inset-shadow-sm shadow-cyan-500/50 transition-all duration-500`}
>
    <div >{@render children()}</div>
</div>