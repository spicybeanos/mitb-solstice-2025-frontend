<script lang="ts">
    import AButton from "$lib/components/AButton.svelte";
    import SimpleCard from "$lib/components/SimpleCard.svelte";
    import BasicHeader from "$lib/components/ui/Basic/BasicHeader.svelte";

    let { data } = $props();
</script>

<div class="flex flex-center justify-center flex-col">
    <SimpleCard>
        {#if data.is_logged_in}
            <div class="flex flex-col flex-center justify-center">
                <AButton href="/redeem/mahe">
                    <div class="text-white">I'm a MAHE student</div></AButton
                >
                <AButton href="/support?sel=passes">
                    <div class="text-white">
                        I'm NOT a MAHE student
                    </div></AButton
                >
            </div>
        {:else}
            <div class="flex flex-col flex-center justify-center">
                <BasicHeader
                    >You need to log in and complete registeration</BasicHeader
                >
                <AButton href="/profile"
                    ><div class="text-white">Log in and register</div></AButton
                >
            </div>
        {/if}
    </SimpleCard>
</div>
