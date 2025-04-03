<script lang="ts">
    import AButton from "$lib/components/AButton.svelte";
    import SimpleCard from "$lib/components/SimpleCard.svelte";
    import TextInput from "$lib/components/TextInput.svelte";
    import BasicButtonFilled from "$lib/components/ui/Basic/BasicButtonFilled.svelte";
    import BasicHeader from "$lib/components/ui/Basic/BasicHeader.svelte";

    let { data, form } = $props();
</script>

<div class="flex flex-center justify-center flex-col">
    <SimpleCard>
        {#if data.is_logged_in}
            {#if data.pass == null}
                {#if form?.msg}
                    <div class="text-white">{form.msg}</div>
                {/if}
                <div class="flex flex-col flex-center justify-center w-fit">
                    <form
                        method="post"
                        class="flex flex-col flex-center justify-center w-fit"
                    >
                        <label class="text-white" for="reg1"
                            >Registeration of person 1</label
                        >
                        <TextInput required name="reg1" placeholder="Reg No1" />
                        <label class="text-white" for="reg2"
                            >Registeration of person 2</label
                        >
                        <TextInput required name="reg2" placeholder="Reg No2" />
                        <label class="text-white" for="bil_ph"
                            >Phone number of person who bought the pass</label
                        >
                        <TextInput
                            required
                            name="bil_ph"
                            placeholder="Phone number of who bought the pass"
                        />
                        <BasicButtonFilled>REDEEM</BasicButtonFilled>
                    </form>
                </div>
            {:else}
                <div class="flex flex-col flex-center justify-center w-fit">
                    <BasicHeader>You already own a pass</BasicHeader>
                </div>
            {/if}
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
