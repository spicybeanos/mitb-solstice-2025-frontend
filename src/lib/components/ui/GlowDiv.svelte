<script>
    let {children} = $props()
</script>

<div
    class={`flex justify-center text-white bg-black backdrop-blur-sm inset-shadow-xs  inset-shadow-cyan-500/50 rounded-xl p-2 m-1 hover:shadow-sm hover:inset-shadow-sm shadow-cyan-500/50 transition-all duration-500`}
>
    <div >{@render children()}</div>
</div>