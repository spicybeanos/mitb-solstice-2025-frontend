<script lang="ts">
    import type { SolsticePassInfo } from "$lib/components/backend/BackendAgentPass.js";
    import { error } from "@sveltejs/kit";

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
        }
        loaded = true;
    }
</script>

<div class="p-[30px]">
    <h1>Here you can veirfy what pass an email owns.</h1>
    <label for="email">
        Email:
        <input
            required
            type="email"
            name="email"
            placeholder="enter email"
            bind:value={email}
        />
    </label>

    <button
        class="rounded-sm"
        onclick={() => {
            getEmailPasses();
        }}>Get</button
    >

    {#if loaded}
        {#if response?.error != null}
            <div>
                An error happened:
                {response.error}
            </div>
        {/if}
        {#if response?.ownsPass}
            <div class="flex flex-row">
                Pass Name : {response.pass?.name}
                Pass Description : {response.pass?.description}
                Pass Cost : {response.pass?.cost}
            </div>
        {/if}
    {/if}
</div>

<style>
    h1,
    div {
        color: white;
    }
    input {
        border-style: solid;
        border-width: 1px;
        border-color: lightblue;
        padding: 5px 5px 5px 5px;
        color: lightblue;
    }
    button {
        border-style: solid;
        border-width: 1px;
        border-color: lightblue;
        color: black;
        padding: 5px 5px 5px 5px;
        background-color: lightblue;
    }
</style>
