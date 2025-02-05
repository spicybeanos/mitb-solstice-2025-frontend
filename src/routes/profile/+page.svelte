<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import { fly } from "svelte/transition";
    import Card from "$lib/components/Card.svelte";
    import TextInput from "$lib/components/TextInput.svelte";
    import GoogleLogin from "../GoogleLogin.svelte";
    import {isSigningOut} from "../GoogleLogin.svelte.ts";

    import { UserProfileData } from "../GoogleLogin.svelte.ts";
    import { json } from "@sveltejs/kit";

    let { data } = $props();

    function LogOut() {
        isSigningOut.status = true;
        // Clear local user profile data
        UserProfileData.name = "";
        UserProfileData.email = "";
        UserProfileData.picture = "";
        UserProfileData.loggedIn = false;

        (window as any).google.accounts.id.disableAutoSelect();

        // Clear your app's session or token storage
        localStorage.removeItem("authToken"); // Replace with your app's token key
        sessionStorage.removeItem("authToken");

        // Optional: Notify your backend to clear the session if needed
        fetch("/profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "logout" }),
        }).finally(() => {
            isSigningOut.status = false;
            console.log("done logging out!")
        });
    }
</script>

<div class="centre">
    {#if !UserProfileData.loggedIn}
        <GoogleLogin cookieJwt={data.authToken} />
    {:else}
        <div
            transition:fly={{
                y: -200,
                duration: 200,
            }}
        >
            <img
                src={UserProfileData.picture}
                alt="pfp"
                width="50px"
                height="50px"
            />
            <div style="padding:15px;">
                <div>{UserProfileData.name}</div>
                <div>{UserProfileData.email}</div>
            </div>
            <Button danger OnClicked={LogOut}>Sign Out</Button>
        </div>
    {/if}
</div>

<style>
    img {
        border-radius: 50%;
    }

    .centre {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
    }
</style>
