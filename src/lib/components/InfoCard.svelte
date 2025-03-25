<script lang="ts">
    import SimpleCard from "./SimpleCard.svelte";
    let { children } = $props();
</script>

<div
    class="flex justify-start bg-black/40 backdrop-blur-sm rounded-xl p-3 border border-gray-800/50 hover:border-[#AB83FE]/50 transition-all duration-500 m-2"
>
    <img src="/icons/info.svg" alt="info icon" />
    <div class="mt-3">{@render children()}</div>
</div>
