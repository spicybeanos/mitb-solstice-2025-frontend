<script lang="ts">
    import type { SolsticeUser } from "$lib/server/BackendTypes";
    import BasicButtonFilled from "$lib/components/ui/Basic/BasicButtonFilled.svelte";
    import BasicButtonOutline from "$lib/components/ui/Basic/BasicButtonOutline.svelte";
    import BasicInput from "$lib/components/ui/Basic/BasicInput.svelte";
    import { fade, fly } from "svelte/transition";

    let email = $state("");
    let userid = $state("");
    let loaded = $state(false);
    let response: { error: string | null; userData: SolsticeUser | null } =
        $state({ error: null, userData: null });

    async function getUserDetailsByEmail() {
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
    async function getUserDetailsByUserID() {
        loaded = false;
        let base_url =
            window === undefined
                ? "http://localhost:5173/manage/ids"
                : (window as any).location.origin;

        const userid_q = encodeURIComponent(userid);
        console.log(userid_q);
        let url: URL = new URL("manage/ids", base_url);
        url.searchParams.append("userid", userid);

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

<div class="flex justify-center">
    <div class="p-[30px]">
        <h1>Get info of a user</h1>
        <div>
            <BasicInput
                required
                name="email"
                type="email"
                placeholder="E-mail"
                bind:value={email}
            />
            <BasicButtonFilled
                OnClick={() => {
                    getUserDetailsByEmail();
                }}><b>GO</b></BasicButtonFilled
            >
            <BasicButtonOutline
                OnClick={() => {
                    loaded = false;
                }}><b>RESET</b></BasicButtonOutline
            >
        </div>
        <div>
            <BasicInput
                required
                name="userid"
                type="userid"
                placeholder="User ID"
                bind:value={userid}
            />
            <BasicButtonFilled
                OnClick={() => {
                    getUserDetailsByUserID();
                }}><b>GO</b></BasicButtonFilled
            >
            <BasicButtonOutline
                OnClick={() => {
                    loaded = false;
                }}><b>RESET</b></BasicButtonOutline
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
                        <div>
                            Phone number : {response.userData.phone_number}
                        </div>
                        <div>User ID : <code>{response.userData.id}</code></div>
                        <div>
                            Registration number : {response.userData
                                .mahe_registration_number}
                        </div>
                        <div>
                            Pass ID : {response.userData.pass_id == null
                                ? "None"
                                : response.userData.pass_id}
                        </div>
                    </div>
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
</style>
