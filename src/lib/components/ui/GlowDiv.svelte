<script>
    let {children} = $props()
</script>

<div
    class="flex justify-center bg-black inset-shadow-sm  inset-shadow-cyan-500/50 rounded-xl p-2 m-1 shadow-sm shadow-cyan-500/50 "
>
    <div >{@render children()}</div>
</div>