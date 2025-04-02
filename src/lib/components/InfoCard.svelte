<script lang="ts">
    import SimpleCard from "./SimpleCard.svelte";
    let { children,classInfo="" } = $props();
</script>

<div
    class="flex justify-start bg-black/40 backdrop-blur-sm rounded-xl p-3 border border-gray-800/50 hover:border-[#AB83FE]/50 transition-all duration-500 m-2"
>
    <img src="/icons/info.svg" alt="info icon" class="w-10" />
    <div class={`mt-3 text-white ${classInfo}`}>{@render children()}</div>
</div>
