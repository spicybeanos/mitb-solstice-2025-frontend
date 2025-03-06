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

    let isMahe = $state(true);

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

<div class="flex h-full justify-center items-center py-[6rem]">
    {#if !UserProfileData.loggedIn}
        <GoogleLogin cookieJwt={data.authToken} />
    {:else}
        <div>
            <!-- transition:fly={{
            y: -200,
            duration: 200,
        }} -->
            <div class="flex w-full h-full justify-between mb-4 max-sm:px-4">
                <div class="flex w-[20%] justify-between gap-3 sm:gap-4">
                    <img
                        src={UserProfileData.picture}
                        alt="pfp"
                        width="50px"
                        height="50px"
                        class="size-[50%] self-center"
                    />
                    <div class="self-center">
                        <div>{UserProfileData.name}</div>
                        <div>{UserProfileData.email}</div>
                    </div>
                </div>
                <div class="self-center">
                    <Button danger OnClicked={LogOut}>Sign Out</Button>
                </div>
            </div>

            {#if data.user == null}
                <h1 class="w-full text-center sm:py-4 py-8">
                    You haven't registered yet!
                </h1>
                <br />
                <div>
                    <SimpleCard>
                        <h1 class="w-full text-center text-2xl font-semibold">
                            Register
                        </h1>
                        <div class="text-white">If you have already registered, please refresh the page.</div>
                        <form
                            action="?/register"
                            method="post"
                            class="w-[80vw] sm:w-[60vw] grid place-items-center pt-6 gap-6"
                        >
                            <div class="flex flex-row w-[100%]">
                                <TextInput
                                    placeholder="First Name"
                                    name="first_name"
                                    required
                                ></TextInput>
                                <TextInput
                                    placeholder="Last Name"
                                    name="last_name"
                                    required
                                ></TextInput>
                            </div>
                            <TextInput
                                placeholder="Phone Number"
                                name="phone_num"
                                type="number"
                                required
                            ></TextInput>
                            <div>
                                <input
                                    type="checkbox"
                                    name="is_mahe"
                                    bind:checked={isMahe}
                                />
                                <span class="text-white p-[5px]"
                                    >I am a MAHE student</span
                                >
                            </div>
                            {#if isMahe}
                                <TextInput
                                    placeholder="Mahe Registration Number"
                                    name="mahe_num"
                                    type="number"
                                    required
                                ></TextInput>
                            {/if}
                            <Button OnClicked={() => {}}
                                ><div style="color: white ;">
                                    Submit
                                </div></Button
                            >
                        </form>
                        <span class="text-white"
                            >*Event organizers and volunteers may use your
                            mobile number and email to contact you for event and
                            fest related matters</span
                        >
                    </SimpleCard>
                </div>
            {:else if data.user != null || UserProfileData.registered}
                <div>
                    <SimpleCard>
                        <h1 class="w-full text-center text-2xl font-semibold">
                            Update Information
                        </h1>
                        <form
                            action="?/update"
                            method="post"
                            class="w-[80vw] sm:w-[60vw] grid place-items-center pt-6 gap-6"
                        >
                            <TextInput
                                placeholder="First Name"
                                name="f-name"
                                required
                                text={data?.user?.first_name}
                            ></TextInput>
                            <TextInput
                                placeholder="Last Name"
                                name="l-name"
                                required
                                text={data?.user?.last_name}
                            ></TextInput>
                            <TextInput
                                placeholder="Phone Number"
                                name="ph-num"
                                type="number"
                                required
                                text={data?.user?.phone_number}
                            ></TextInput>
                            <TextInput
                                placeholder="Mahe Registration Number"
                                name="mahe_num_update"
                                type="number"
                                required
                                text={data?.user?.mahe_registration_number}
                            ></TextInput>
                            <Button OnClicked={() => {}}
                                ><div style="color: white;">Submit</div></Button
                            >
                        </form>
                        <span class="text-white"
                            >*Event organizers and volunteers may use your
                            mobile number and email to contact you for event and
                            fest related matters</span
                        >
                    </SimpleCard>
                </div>
                <!-- <div>All good :)</div> -->
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
   
</style>
