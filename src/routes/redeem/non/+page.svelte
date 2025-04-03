<script lang="ts">
    import AButton from "$lib/components/AButton.svelte";
    import SimpleCard from "$lib/components/SimpleCard.svelte";
    import TextInput from "$lib/components/TextInput.svelte";
    import BasicButtonFilled from "$lib/components/ui/Basic/BasicButtonFilled.svelte";
    import BasicHeader from "$lib/components/ui/Basic/BasicHeader.svelte";
    import type { SolsticePassInfo } from "$lib/server/BackendTypes.js";
    import { onMount } from "svelte";

    let { data, form } = $props();
    let passSelected = $state("");
    let passesList = $state([] as SolsticePassInfo[]);

    onMount(() => {
        if (data.allPasses != null) {
            for (const p of data.allPasses) {
                passesList.push(p);
            }
        }
    });
</script>

<div class="flex flex-center justify-center flex-col">
    <SimpleCard>
        {#if data.is_logged_in}
            {#if data.pass == null}
                {#if form?.msg}
                    <div class="text-white">{form.msg}</div>
                {/if}
                <div class="text-lg text-white">Make sure you put in correct information!</div>
                <div class="flex flex-col flex-center justify-center w-fit">
                    <form
                        method="post"
                        class="flex flex-col flex-center justify-center w-fit"
                    >
                        <label class="text-white" for="reg1">User ID</label>
                        <TextInput required name="user" placeholder="User ID" />
                        <label class="text-white" for="bil_ph"
                            >Phone number of person who bought the pass</label
                        >
                        <TextInput
                            required
                            name="bil_ph"
                            placeholder="Phone number of who bought the pass"
                        />
                        <label class="text-white" for='pass'>The pass you bought</label>
                        <select name="pass" class="bg-white p-3 rounded-md">
                            {#each passesList as p}
                                <option value={p.id}>{p.name}</option>
                            {/each}
                        </select>
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
