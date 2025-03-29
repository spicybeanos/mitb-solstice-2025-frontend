<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import { fly, fade } from "svelte/transition";
    import TextInput from "$lib/components/TextInput.svelte";
    import QR from "$lib/components/QR.svelte";
    // import GoogleLogin from "../GoogleLogin.svelte";
    import { isSigningOut } from "../GoogleLogin.svelte.ts";
    import { tick } from "svelte";

    import { PUBLIC_G_CLIENT } from "$env/static/public";

    import { UserProfileData } from "../GoogleLogin.svelte.ts";
    //import { json } from "@sveltejs/kit";
    //import SimpleCard from "$lib/components/SimpleCard.svelte";
    //import InfoCard from "$lib/components/InfoCard.svelte";

    import { backOut } from "svelte/easing";
    import GlowDiv from "$lib/components/ui/GlowDiv.svelte";

    const cardAnimation = {
        y: 50,
        duration: 1000,
        easing: backOut,
    };

    let { data, form } = $props();

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
        }).finally(async () => {
            isSigningOut.status = false;
            console.log("done logging out!");
            window.location.reload();
            await tick();
        });
    }
</script>

<!-- Replace the outer container -->
<div class="min-h-screen flex flex-col justify-between">
    <!-- Main content -->
    <main class="flex-grow flex justify-center items-center py-0 px-4 sm:py-16">
        <div
            class="w-full max-w-4xl space-y-4 sm:space-y-6"
            in:fade={{ duration: 1000 }}
        >
            {#if !UserProfileData.loggedIn}
                <!-- Login Card - Center content -->
                <div
                    class="flex flex-col items-center justify-center min-h-[30vh] sm:min-h-[50vh]"
                >
                    <div
                        class="card-glow w-full max-w-md shadow-[#AB83FE]/40 sm:shadow-0 bg-[#AB83FE]/30 sm:bg-black/40 backdrop-blur-sm rounded-xl p-6 sm:p-8 border border-gray-800/50 hover:border-[#AB83FE]/30 transition-all duration-500 flex justify-center shadow-lg hover:shadow-[#AB83FE]/40"
                        in:fly={cardAnimation}
                    >
                        {#if !UserProfileData.loggedIn}
                            <div
                                class="flex flex-col justify-center items-center"
                            >
                                <div class="text-white">
                                    If you do not see a google log in button,
                                    kindly reload the page.
                                </div>
                                {#snippet glog()}
                                    <div
                                        id="g_id_onload"
                                        data-client_id={`${PUBLIC_G_CLIENT}.apps.googleusercontent.com`}
                                        data-context="signin"
                                        data-ux_mode="popup"
                                        data-login_uri="/profile?/glogin"
                                        data-auto_select="false"
                                        data-itp_support="true"
                                    ></div>

                                    <div
                                        class="g_id_signin"
                                        data-type="standard"
                                        data-shape="rectangular"
                                        data-theme="outline"
                                        data-text="signin_with"
                                        data-size="large"
                                        data-logo_alignment="left"
                                    ></div>
                                {/snippet}

                                {@render glog()}
                            </div>
                        {/if}
                        {#if UserProfileData.loggedIn}
                            <p>Welcome, {UserProfileData.name}!</p>
                            <p>Email: {UserProfileData.email}</p>
                        {/if}
                        <!-- <GoogleLogin cookieJwt={data.authToken} /> -->
                    </div>
                </div>
            {:else}
                <!-- Profile Header - Stack on mobile -->
                <div class="space-y-3 sm:space-y-6">
                    <div
                        class="card-glow shadow-xl hover:shadow-[#AB83FE]/40 bg-[#AB83FE]/40 sm:bg-black/80 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-800/50 hover:border-[#AB83FE]/30 transition-all duration-500"
                        in:fly={{ ...cardAnimation, delay: 600 }}
                    >
                        <div
                            class="flex flex-col sm:flex-row justify-between items-center gap-4"
                        >
                            <div
                                class="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left w-full sm:w-auto"
                            >
                                <div class="relative">
                                    <img
                                        src={UserProfileData.picture}
                                        alt="Profile"
                                        class="sm:w-16 sm:h-16 rounded-full border-2 border-[#AB83FE]"
                                    />
                                </div>
                                <div>
                                    <div class="text-[#C7AE93] text-xl">
                                        {data.user?.first_name}
                                        {data.user?.last_name}
                                    </div>
                                    <div class="text-[#C7AE93] text-sm">
                                        {UserProfileData.email}
                                    </div>
                                    <div class="text-[#C7AE93] text-sm">
                                        +91 {data.user?.phone_number}
                                    </div>
                                    {#if data.user?.mahe_registration_number != null}
                                        <div class="text-[#C7AE93] text-sm">
                                            Registration number : {data.user
                                                ?.mahe_registration_number}
                                        </div>
                                    {/if}
                                    {#if data.pass != null}
                                        <div class="text-[#C7AE93] text-sm">
                                            Your pass : {data.pass.name}
                                        </div>
                                    {:else}
                                        <div
                                            class="text-[#C7AE93] text-sm text-red-400"
                                        >
                                            You do not own any pass!
                                        </div>
                                    {/if}
                                </div>
                            </div>

                            <Button
                                OnClicked={() => LogOut()}
                                class="w-full sm:w-auto"
                            >
                                <div
                                    class="border border-[#AB83FE] hover:border-red-400 hover:bg-red-500 p-3 rounded-lg text-[#C7AE93] text-center"
                                >
                                    Logout
                                </div>
                            </Button>
                        </div>
                    </div>
                    {#if data.pass != null}
                        <div class="w-full flex flex-center justify-center">
                            <div
                                class={`text-3xl font-bold w-fit flex justify-center ring-amber-300 ring-sm bg-amber-500/60 backdrop-blur-sm inset-shadow-xl  inset-shadow-yellow-300/50 rounded-xl p-6 m-1 hover:shadow-xl shadow-yellow-300/50 transition-all duration-500`}
                            >
                                {data.pass.name}
                            </div>
                        </div>
                    {/if}
                    <!-- Info Card - Improve mobile layout -->
                    <div
                        class="card-glow shadow-xl hover:shadow-[#AB83FE]/40 bg-black/30 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-gray-800/50 hover:border-[#AB83FE]/30 transition-all duration-500"
                        in:fly={{ ...cardAnimation, delay: 600 }}
                    >
                        <div
                            class="flex flex-col sm:flex-row items-center gap-3 text-center sm:text-left"
                        >
                            <img
                                src="/icons/info.svg"
                                alt="info icon"
                                class="w-6 h-6"
                            />
                            <div class="text-[#C7AE93]">
                                Make sure you bring your ID card when attending
                                any event!
                            </div>
                        </div>
                        <div>Feel free to screen shot this QR code!</div>
                    </div>

                    {#if data.user == null}
                        <!-- Registration Form  -->
                        <div
                            class="card-glow shadow-xl hover:shadow-[#AB83FE]/40 bg-[#AB83FE]/40 sm:bg-black/80 backdrop-blur-sm rounded-xl p-4 sm:p-8 border border-gray-800/50 hover:border-[#AB83FE]/30 transition-all duration-500"
                            in:fly={{ ...cardAnimation, delay: 700 }}
                        >
                            <div class="flex flex-col justify-center w-full">
                                <h1
                                    class="text-[#C7AE93] text-2xl font-semibold text-center mb-4 sm:mb-6"
                                >
                                    Register
                                </h1>
                                <div class="text-[#C7AE93] text-center mb-4">
                                    If you have already registered, please
                                    refresh the page.
                                </div>
                                <div class="text-[#C7AE93] text-center mb-4">
                                    Make sure that all your details match your
                                    ID's details as you will not be able to
                                    change them later!
                                </div>
                                <div class="text-[#C7AE93] text-center mb-4">
                                    Make sure that all your details match that
                                    of entered in the payment portal!
                                </div>
                                {#if form?.success}
                                    {#if form.success == true}
                                        <div
                                            class="text-[#C7AE93] text-center mb-4"
                                        >
                                            Registration successful
                                        </div>
                                    {:else}
                                        <div
                                            class="text-[#C7AE93] text-center mb-4"
                                        >
                                            Could not register: {form.error}
                                        </div>
                                    {/if}
                                {/if}
                                <form
                                    action="?/register"
                                    method="post"
                                    class="w-full space-y-4 sm:space-y-6"
                                >
                                    <div
                                        class="grid grid-cols-1 sm:grid-cols-2 gap-4"
                                    >
                                        <TextInput
                                            placeholder="First Name"
                                            name="first_name"
                                            required
                                        />
                                        <TextInput
                                            placeholder="Last Name"
                                            name="last_name"
                                            required
                                        />
                                    </div>
                                    <TextInput
                                        placeholder="Phone Number"
                                        name="phone_num"
                                        type="number"
                                        required
                                    />
                                    <div>
                                        <input
                                            type="checkbox"
                                            name="is_mahe"
                                            bind:checked={isMahe}
                                        />
                                        <span class="text-[#C7AE93] p-[5px]"
                                            >I am a MAHE student</span
                                        >
                                    </div>
                                    {#if isMahe}
                                        <TextInput
                                            placeholder="Mahe Registration Number"
                                            name="mahe_num"
                                            type="number"
                                            required
                                        />
                                    {/if}
                                    <Button OnClicked={() => {}}
                                        ><div
                                            style="color: white ;"
                                            class="border border-white p-[12px] rounded-lg"
                                        >
                                            Submit
                                        </div></Button
                                    >
                                </form>
                                <span class="text-[#C7AE93]"
                                    >*Event organizers and volunteers may use
                                    your mobile number and email to contact you
                                    for event and fest related matters</span
                                >
                                <span class="text-[#C7AE93]"
                                    >By registering to our site, you agree to
                                    our <a href="/tos" class="text-white"
                                        >terms of service</a
                                    >
                                    and
                                    <a href="/privacy" class="text-white">
                                        our privacy policy</a
                                    >
                                    If you disagree, do not register yourself. For
                                    more information
                                    <a href="/contactus" class="text-white"
                                        >contact us.</a
                                    ></span
                                >
                            </div>
                        </div>
                    {:else}
                        <!-- Update Form and QR Section -->

                        <div class="flex justify-center">
                            <div
                                class="card-glow shadow-xl hover:shadow-[#AB83FE]/40 bg-[#AB83FE]/40 sm:bg-black/60 backdrop-blur-sm rounded-xl p-4 sm:p-8 border border-gray-800/50 hover:border-[#AB83FE]/30 transition-all duration-500 w-1/3"
                                in:fly={{ ...cardAnimation, delay: 700 }}
                            >
                                <h1 class="text-2xl text-center">
                                    Your User ID : {data.user.id}
                                </h1>
                                <div class="flex justify-center gap-8">
                                    <!-- QR Code - Show first on mobile -->
                                    <div
                                        class="flex flex-col items-center justify-center order-1 lg:order-2"
                                        in:fly={{
                                            ...cardAnimation,
                                            delay: 700,
                                        }}
                                    >
                                        Your User ID QR:
                                        <div
                                            class="bg-white border-1 sm:border-4 border-[#AB83FE]/50 p-1.5 shadow-lg shadow-[#AB83FE]/60 rounded-xl"
                                        >
                                            <QR text={data.user.id} />
                                        </div>
                                        <div style="color: red;">
                                            This is not your pass ID
                                        </div>
                                    </div>
                                    <!-- Update Form -->
                                </div>
                            </div>
                        </div>
                    {/if}
                </div>
            {/if}
        </div>
    </main>
</div>

<style>
    img {
        border-radius: 50%;
    }
    div {
        color: white;
    }
    :global(.card-glow) {
        position: relative;
    }

    :global(.card-glow::before) {
        content: "";
        position: absolute;
        inset: -1px;
        background: linear-gradient(
            0deg,
            rgba(171, 131, 254, 0.3),
            rgba(171, 131, 254, 0.1)
        );
        border-radius: 0.75rem;
        z-index: -1;
        opacity: 0;
        transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
    }

    :global(.card-glow:hover::before) {
        opacity: 1;
    }

    :global(input[type="number"]::-webkit-inner-spin-button),
    :global(input[type="number"]::-webkit-outer-spin-button) {
        -webkit-appearance: none;
        margin: 0;
    }

    :global(input[type="number"]) {
        -moz-appearance: textfield;
    }

    :global(.form-input),
    :global(.form-checkbox) {
        background-color: rgba(31, 41, 55, 0.5);
        border-color: #374151;
        color: #f3f4f6;
    }

    :global(.form-input:focus),
    :global(.form-checkbox:focus) {
        border-color: #ab83fe;
        box-shadow: 0 0 0 2px rgba(171, 131, 254, 0.2);
    }

    /* Input field styling */
    :global(input[type="text"]),
    :global(input[type="number"]),
    :global(input[type="email"]),
    :global(.form-input) {
        background-color: rgba(31, 41, 55, 0.5);
        border: 1px solid #ab83fe;
        color: #f3f4f6;
        border-radius: 0.5rem;
        padding: 0.5rem 1rem;
        transition: all 0.3s ease;
    }

    :global(input[type="text"]:focus),
    :global(input[type="number"]:focus),
    :global(input[type="email"]:focus),
    :global(.form-input:focus) {
        border-color: #ab83fe;
        box-shadow: 0 0 0 2px rgba(171, 131, 254, 0.2);
        outline: none;
    }

    :global(input[type="text"]::placeholder),
    :global(input[type="number"]::placeholder),
    :global(input[type="email"]::placeholder),
    :global(.form-input::placeholder) {
        color: rgba(199, 174, 147, 0.5);
    }

    /* Checkbox styling */
    :global(input[type="checkbox"]) {
        accent-color: #ab83fe;
        width: 1.2rem;
        height: 1.2rem;
        border-radius: 0.25rem;
        border: 1px solid #ab83fe;
        background-color: transparent;
        cursor: pointer;
    }

    :global(input[type="checkbox"]:checked) {
        background-color: #ab83fe;
        border-color: #ab83fe;
    }

    /* Remove number input spinners */
    :global(input[type="number"]::-webkit-inner-spin-button),
    :global(input[type="number"]::-webkit-outer-spin-button) {
        -webkit-appearance: none;
        margin: 0;
    }

    :global(input[type="number"]) {
        -moz-appearance: textfield;
    }

    /* Label styling */
    :global(label) {
        color: #c7ae93;
        font-size: 0.875rem;
        margin-bottom: 0.5rem;
    }

    /* Form group spacing */
    :global(.space-y-6 > *) {
        margin-top: 1.5rem;
    }

    :global(.space-y-6 > *:first-child) {
        margin-top: 0;
    }

    /* Mobile-first responsive styles */
    @media (max-width: 640px) {
        :global(.card-glow) {
            padding: 1rem;
        }

        :global(input[type="text"]),
        :global(input[type="number"]),
        :global(input[type="email"]),
        :global(.form-input) {
            font-size: 16px; /* Prevent zoom on iOS */
        }

        :global(button) {
            width: 100%;
        }
    }

    /* Improved touch targets */
    :global(input[type="checkbox"]) {
        min-width: 24px;
        min-height: 24px;
        margin: 0;
        padding: 0;
    }

    /* Better spacing for mobile */
    :global(.space-y-4 > * + *) {
        margin-top: 1rem;
    }

    :global(.space-y-6 > * + *) {
        margin-top: 1.5rem;
    }

    /* Prevent overflow on mobile */
    :global(.min-h-screen) {
        min-height: 100svh;
    }
</style>
