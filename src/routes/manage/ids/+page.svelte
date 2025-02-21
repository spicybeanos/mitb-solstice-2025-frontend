<script lang="ts">
    import type { SolsticeUser } from "$lib/components/backend/BackendAgentUser";
    import { fade, fly } from "svelte/transition";

    let email = $state("");
    let loaded = $state(false);
    let response: { error: string | null; userData: SolsticeUser | null } =
        $state({ error: null, userData: null });

    async function getUserDetails() {
        loaded = false;
        let base_url =
            window === undefined
                ? "http://localhost:5173/manage/ids"
                : (window as any).location.origin;

        const email_q = encodeURIComponent(email);
        console.log(email_q);
        let url: URL = new URL("manage/ids", base_url);
        url.searchParams.append("email", email);

        const res = await fetch(url.toString(), { method: "GET" });
        if (res.status == 200) {
            const info = await res.json();
            response.error = null;
            response.userData = info.userData;
        } else {
            const info = await res.json();
            response.error = info.error;
        }
        loaded = true;
    }
</script>

<div class="p-[30px]">
    <h1>Get info of a user</h1>
    <div>
        <label for="email"
            >Email:<input
                class="m-3"
                name="email"
                type="email"
                placeholder="E-mail"
                bind:value={email}
            /></label
        >
        <button
            onclick={() => {
                getUserDetails();
            }}
            class="rounded-sm">Go</button
        >
        <button
            onclick={() => {
                loaded = false;
            }}
            class="rounded-sm">Reset</button
        >
    </div>
    {#if loaded == true}
        <div in:fly={{ y: 200, duration: 100 }} out:fade>
            {#if response.error != null}
                <div style="color: red;">
                    Error:{response.error}
                </div>
            {/if}
            {#if response.userData != null}
                <div class="flex flex-col">
                    <div>
                        Name : {response.userData.first_name}
                        {response.userData.last_name}
                    </div>
                    <div>Email : {response.userData.email_address}</div>
                    <div>Phone number : {response.userData.phone_number}</div>
                    <div>User ID : {response.userData.id}</div>
                    <div>
                        Registration number : {response.userData
                            .mahe_registration_number}
                    </div>
                    <div>Pass ID : {response.userData.pass_id == null ? 'None' : response.userData.pass_id}</div>
                </div>
            {/if}
        </div>
    {/if}
</div>

<style>
    h1,
    div {
        color: white;
    }
    h1 {
        font-size: xx-large;
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
