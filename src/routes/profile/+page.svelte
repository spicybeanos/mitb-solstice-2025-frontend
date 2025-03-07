<script lang="ts">
    //import Button from "$lib/components/Button.svelte";
    import TextInput from "$lib/components/TextInput.svelte";
    import GoogleLogin from "../GoogleLogin.svelte";
    import { isSigningOut, UserProfileData } from "../GoogleLogin.svelte.ts";
    //import SimpleCard from "$lib/components/SimpleCard.svelte";
    import { fade, fly } from 'svelte/transition';
    import { backOut } from 'svelte/easing';
    import { goto } from '$app/navigation';

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
        localStorage.removeItem("authToken");
        sessionStorage.removeItem("authToken");

        // Optional: Notify your backend to clear the session if needed
        fetch("/profile", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ action: "logout" }),
        }).then(async () =>{
            await goto('/profile',{ invalidateAll:true })
        }).finally(() => {
            isSigningOut.status = false;
            console.log("done logging out!");
            window.location.reload()
        });
    }
</script>

<div class="min-h-screen bg-gradient-to-b from-black via-gray-900 to-black flex justify-center items-center py-16 px-4">
    <div class="w-full max-w-4xl" in:fade={{ duration: 300, delay: 150 }}>
        {#if !UserProfileData.loggedIn}
            <div 
                class="initialCard bg-gray-900/60 backdrop-blur-sm rounded-xl p-8 border border-gray-800/50 hover:border-[#AB83FE]/30 transition-all duration-500 shadow-2xl hover:shadow-[#AB83FE]/20 flex justify-center"
                in:fly={{ y: 20, duration: 800, delay: 300, easing: backOut }}
            >
                <GoogleLogin cookieJwt={data.authToken} />
            </div>
        {:else}
            <div class="space-y-6" in:fly={{ y: 20, duration: 800, delay: 300, easing: backOut }}>
                <!-- User Profile Header -->
                <div class="bg-gray-900/60 backdrop-blur-sm rounded-xl p-6 border border-gray-800/50 hover:border-[#AB83FE]/30 transition-all duration-500 shadow-2xl hover:shadow-[#AB83FE]/20">
                    <div class="flex flex-col sm:flex-row justify-between items-center gap-4">
                        <div class="flex items-center space-x-4">
                            <div class="relative">
                                <div class="absolute -inset-1 bg-gradient-to-r from-[#AB83FE] to-[#C7AE93] rounded-full blur-md opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200"></div>
                                <img
                                    src={UserProfileData.picture}
                                    alt="Profile"
                                    class="relative w-16 h-16 rounded-full border-2 border-[#AB83FE] shadow-md"
                                />
                            </div>
                            <div>
                                <h2 class="text-[#C7AE93] font-medium text-xl">{UserProfileData.name}</h2>
                                <p class="text-gray-400 text-sm">{UserProfileData.email}</p>
                            </div>
                        </div>
                        <button 
                            onclick={LogOut}
                            class="relative inline-flex items-center justify-center px-6 py-2 overflow-hidden font-medium text-white transition duration-300 ease-out border-2 border-red-500 rounded-lg shadow-md group"
                        >
                            <span class="absolute inset-0 flex items-center justify-center w-full h-full text-white duration-300 -translate-x-full bg-red-500 group-hover:translate-x-0 ease">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
                                </svg>
                            </span>
                            <span class="absolute flex items-center justify-center w-full h-full text-red-500 transition-all duration-300 transform group-hover:translate-x-full ease">Sign Out</span>
                            <span class="relative invisible">Sign Out</span>
                        </button>
                    </div>
                </div>

                <!-- Registration/Update Forms with enhanced styling -->
                {#if data.user == null}
                    <div 
                        class="bg-gray-900/60 backdrop-blur-sm rounded-xl p-8 border border-gray-800/50 hover:border-[#AB83FE]/30 transition-all duration-500 shadow-2xl hover:shadow-[#AB83FE]/20"
                        in:fly={{ y: 20, duration: 800, delay: 450, easing: backOut }}
                    >
                        <h1 class="text-[#AB83FE] text-2xl font-bold text-center mb-6">
                            Registration
                        </h1>
                        <p class="text-gray-400 text-sm text-center mb-4">If you have already registered, please refresh the page.</p>
                        
                        <form
                            action="?/register"
                            method="post"
                            class="space-y-5"
                        >
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div class="space-y-1">
                                    <label for="first_name" class="text-sm text-[#C7AE93]">First Name</label>
                                    <TextInput
                                        placeholder="First Name"
                                        name="first_name"
                                        required
                                    ></TextInput>
                                </div>
                                <div class="space-y-1">
                                    <label for="last_name" class="text-sm text-[#C7AE93]">Last Name</label>
                                    <TextInput
                                        placeholder="Last Name"
                                        name="last_name"
                                        required
                                    ></TextInput>
                                </div>
                            </div>
                            
                            <div class="space-y-1">
                                <label for="phone_num" class="text-sm text-[#C7AE93]">Phone Number</label>
                                <TextInput
                                    placeholder="Phone Number"
                                    name="phone_num"
                                    type="number"
                                    required
                                ></TextInput>
                            </div>
                            
                            <div class="flex items-center space-x-2 py-2">
                                <input
                                    type="checkbox"
                                    id="is_mahe"
                                    name="is_mahe"
                                    bind:checked={isMahe}
                                    class="w-4 h-4 accent-[#AB83FE] bg-[#1f2937] border-[#374151] rounded"
                                />
                                <label for="is_mahe" class="text-[#C7AE93]">
                                    I am a MAHE student
                                </label>
                            </div>
                            
                            {#if isMahe}
                                <div class="space-y-1">
                                    <label for="mahe_num" class="text-sm text-[#C7AE93]">MAHE Registration Number</label>
                                    <TextInput
                                        placeholder="MAHE Registration Number"
                                        name="mahe_num"
                                        type="number"
                                        required
                                    ></TextInput>
                                </div>
                            {/if}
                            
                            <div class="pt-4">
                                <button
                                    type="submit"
                                    class="w-full bg-gradient-to-r from-[#AB83FE] to-purple-700 text-white font-medium py-3 rounded-lg hover:from-purple-700 hover:to-[#AB83FE] transition duration-300 shadow-md"
                                >
                                    Complete Registration
                                </button>
                            </div>
                        </form>
                        
                        <p class="text-gray-400 text-xs mt-6">
                            *Event organizers and volunteers may use your mobile number and email 
                            to contact you for event and fest related matters
                        </p>
                    </div>
                {:else if data.user != null || UserProfileData.registered}
                    <!-- Update Information Form -->
                    <div 
                        class="bg-gray-900/60 backdrop-blur-sm rounded-xl p-8 border border-gray-800/50 hover:border-[#AB83FE]/30 transition-all duration-500 shadow-2xl hover:shadow-[#AB83FE]/20"
                        in:fly={{ y: 20, duration: 800, delay: 450, easing: backOut }}
                    >
                        <h1 class="text-[#AB83FE] text-2xl font-bold text-center mb-6">
                            Update Information
                        </h1>
                        
                        <form
                            action="?/update"
                            method="post"
                            class="space-y-5"
                        >
                            <div class="space-y-1">
                                <label for="f-name" class="text-sm text-[#C7AE93]">First Name</label>
                                <TextInput
                                    placeholder="First Name"
                                    name="f-name"
                                    required
                                    text={data?.user?.first_name}
                                ></TextInput>
                            </div>
                            
                            <div class="space-y-1">
                                <label for="l-name" class="text-sm text-[#C7AE93]">Last Name</label>
                                <TextInput
                                    placeholder="Last Name"
                                    name="l-name"
                                    required
                                    text={data?.user?.last_name}
                                ></TextInput>
                            </div>
                            
                            <div class="space-y-1">
                                <label for="ph-num" class="text-sm text-[#C7AE93]">Phone Number</label>
                                <TextInput
                                    placeholder="Phone Number"
                                    name="ph-num"
                                    type="number"
                                    required
                                    text={data?.user?.phone_number}
                                ></TextInput>
                            </div>
                            
                            <div class="space-y-1">
                                <label for="mahe_num_update" class="text-sm text-[#C7AE93]">MAHE Registration Number</label>
                                <TextInput
                                    placeholder="MAHE Registration Number"
                                    name="mahe_num_update"
                                    type="number"
                                    required
                                    text={data?.user?.mahe_registration_number}
                                ></TextInput>
                            </div>
                            
                            <div class="pt-4">
                                <button
                                    type="submit"
                                    class="w-full bg-gradient-to-r from-[#AB83FE] to-purple-700 text-white font-medium py-3 rounded-lg hover:from-purple-700 hover:to-[#AB83FE] transition duration-300 shadow-md"
                                >
                                    Update Information
                                </button>
                            </div>
                        </form>
                        
                        <p class="text-gray-400 text-xs mt-6">
                            *Event organizers and volunteers may use your mobile number and email 
                            to contact you for event and fest related matters
                        </p>
                    </div>
                {/if}
            </div>
        {/if}
    </div>
</div>

<style>
    /* Remove spinner from number inputs */
    :global(input[type="number"]::-webkit-inner-spin-button),
    :global(input[type="number"]::-webkit-outer-spin-button) {
        -webkit-appearance: none;
        margin: 0;
    }

    :global(input[type="number"]) {
        -moz-appearance: textfield;
    }

    /* Custom input styling */
    :global(.form-input) {
        background-color: #1f2937;
        border-color: #374151;
        color: #f3f4f6;
    }

    :global(.form-input:focus) {
        border-color: #AB83FE;
        box-shadow: 0 0 0 2px rgba(171, 131, 254, 0.2);
    }

    /* Custom checkbox styling */
    :global(.form-checkbox) {
        border-radius: 0.25rem;
        border-color: #374151;
        background-color: #1f2937;
        color: #AB83FE;
    }

    :global(.form-checkbox:focus) {
        box-shadow: 0 0 0 2px rgba(171, 131, 254, 0.2);
    }

    /* Submit button animation */
    :global(button[type="submit"]) {
        background-size: 200% 200%;
        animation: gradient 4s ease infinite;
    }

    @keyframes gradient {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }

    /* Glass morphism effect */
    :global(.backdrop-blur-sm) {
        backdrop-filter: blur(8px);
        -webkit-backdrop-filter: blur(8px);
    }

    /* Form transitions */
    :global(.space-y-5 > *) {
        transition: transform 0.3s ease-out;
    }

    :global(.space-y-5 > *:hover) {
        transform: translateY(-2px);
    }
</style>