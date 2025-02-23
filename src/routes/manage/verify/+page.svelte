<script lang="ts">
    import type { SolsticePassInfo } from "$lib/components/backend/BackendTypes.ts";
    import { error, text } from "@sveltejs/kit";
    import { fade, fly } from "svelte/transition";
    import Textfield from "@smui/textfield";
    import HelperText from "@smui/textfield";
    import BasicInput from "$lib/components/ui/Basic/BasicInput.svelte";
    import BasicButtonFilled from "$lib/components/ui/Basic/BasicButtonFilled.svelte";
    import BasicButtonOutline from "$lib/components/ui/Basic/BasicButtonOutline.svelte";
    let { data } = $props();
    let email = $state("");
    let response = $state({
        error: "",
        ownsPass: false,
        pass: { name: "", description: "", cost: 0 },
    });
    let loaded = $state(false);

    async function getEmailPasses() {
        loaded = false;
        let base_url =
            window === undefined
                ? "http://localhost:5173/manage/verify"
                : (window as any).location.origin;
        const email_q = encodeURIComponent(email);
        console.log(email_q);
        let url: URL = new URL("manage/verify", base_url);
        url.searchParams.append("email", email);

        const res = await fetch(url.toString(), { method: "GET" });
        if (res.status == 200) {
            const info = await res.json();
            response.error = null;
            response.ownsPass = info.ownsPass;
            if (info.ownsPass) {
                response.pass = info.pass;
            }
        } else {
            const info = await res.json();
            response.error = info.error;
        }
        loaded = true;
    }
</script>

<div class="flex justify-center">
    <div class="p-[30px]">
        <h1>Verify passes owned by an email</h1>
        <div class="flex flex-col">
            <div>
                <BasicInput
                    required
                    type="email"
                    name="email"
                    placeholder="enter email"
                    bind:value={email}
                />

                <BasicButtonFilled
                    OnClick={() => {
                        getEmailPasses();
                    }}
                >
                    <b>GET</b>
                </BasicButtonFilled>
                <BasicButtonOutline
                    OnClick={() => {
                        loaded = false;
                        email = "";
                    }}>RESET</BasicButtonOutline
                >
            </div>
        </div>

        {#if loaded}
            <div in:fly={{ y: 200, duration: 100 }} out:fade>
                {#if response?.error != null}
                    <div class="text-red">
                        {response.error}
                    </div>
                {/if}
                {#if response?.ownsPass}
                    <div class="flex flex-col">
                        <div>Pass Name : {response.pass?.name}</div>
                        <div>Description : {response.pass?.description}</div>
                        <div>Pass Cost : ₹{response.pass?.cost}</div>
                    </div>
                {:else}
                    <div>User does not own any pass!</div>
                {/if}
            </div>
        {/if}
    </div>
</div>

<style>
    h1,
    div {
        color: white;
    }
    h1 {
        font-size: xx-large;
    }
    button {
        border-style: solid;
        border-width: 1px;
        border-color: lightblue;
        color: black;
        padding: 5px 5px 5px 5px;
        margin: 10px 5px 5px 5px;
        background-color: lightblue;
    }
</style>
