<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import { fly } from "svelte/transition";
    import TextInput from "$lib/components/TextInput.svelte";
    import GoogleLogin from "../GoogleLogin.svelte";
    import { isSigningOut } from "../GoogleLogin.svelte.ts";

    import { UserProfileData } from "../GoogleLogin.svelte.ts";
    import { json } from "@sveltejs/kit";
    import SimpleCard from "$lib/components/SimpleCard.svelte";

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
            console.log("done logging out!");
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

            {#if !UserProfileData.registered}
                <h1>You haven't registered yet!</h1>
                <br />
                <div>
                    <SimpleCard>
                        <h1>Register</h1>
                        <form action="?/register" method="post">
                            <TextInput
                                placeholder="First Name"
                                name="first_name"
                            ></TextInput>
                            <TextInput placeholder="Last Name" name="last_name"
                            ></TextInput>
                            <TextInput
                                placeholder="Phone Number"
                                name="phone_num"
                                type="number"
                            ></TextInput>
                            <TextInput
                                placeholder="Mahe Registration Number"
                                name="mahe_num"
                                type="number"
                            ></TextInput>
                            <Button OnClicked={() => {}}
                                ><div style="color: black;">Submit</div></Button
                            >
                        </form>
                    </SimpleCard>
                </div>
            {:else}
                <div>All good :)</div>
            {/if}
        </div>
    {/if}
</div>

<style>
    img {
        border-radius: 50%;
    }
    div {
        color: white;
    }
    .centre {
        display: flex;
        height: 60vh;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
    }
</style>
