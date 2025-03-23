<script lang="ts">
    import "./app.css";
    import { UserProfileData } from "./GoogleLogin.svelte.ts";
    // import logo from "$lib/falak.png";
    import retro from "$lib/retro.svg";
    import logo from "$lib/icons/logo.svg";
    import profile_circle from "$lib/icons/account.svg";
    import { FloatingNavbar } from "../lib/components/ui/FloatingNavBar/index.ts";
    import { onMount } from "svelte";
    import { checkLoggedIn } from "./GoogleLogin.svelte.ts";
    import bg from "$lib/icons/gif2.gif";
    import { WavyBackground } from "$lib/components/ui/Waves/index.ts";
    import { Hamburger } from "svelte-hamburgers";
    import { MobileWaves } from "$lib/components/ui/MobileWaves/index.ts";

    let hamOpen = $state(false);

    let { children, data } = $props();
    let manageAccess = data.manageAccess;

    onMount(() => {
        if (!data.authToken) {
            console.log("user not logged in!");
            return;
        } else {
            checkLoggedIn(data.authToken).then((res) => {
                console.log("is logged in:" + res);
            });
        }
    });
    const navItems = [
        { name: "Passes", link: "/passes" },
        { name: "Events", link: "/events" },
        { name: "Support", link: "/support" },
        { name: "Workshops", link: "/workshops" },
        { name: "Stay", link: "/stay" },
        
    ];
    if (manageAccess) {
        navItems.push({ name: "Manage", link: "/manage" });
    }
    let open = $state(false);
    function toggleOpen() {
        open = !open;
    }
</script>

<div class="desktop pb-[120px] z-20">
    <a href="/" class="grow max-w-[33%] absolute top-7.5 left-3.5 z-50"
        ><img class="logo w-[26vw] md:w-[15vw]" src={logo} alt="logo" /></a
    >
    <FloatingNavbar {navItems} />

    <a
        href="/profile"
        class="grow flex flex-row justify-end max-w-[33%] absolute top-3.5 right-3.5"
    >
        {#if !UserProfileData.loggedIn}
            <img class="icon z-20" src={profile_circle} alt="profile" />
        {:else}
            <img
                class="icon z-20"
                src={UserProfileData.picture}
                alt="profile"
            />
        {/if}
    </a>
</div>

<div class="mobile">
    <div class="relative w-full h-[6.5rem]">
        <a href="/" class="grow max-w-[33%] absolute top-[1.25rem] left-0 z-20">
            <img class="logo w-[26vw] md:w-[15vw]" src={logo} alt="logo" />
        </a>

        <div class="absolute top-4 right-4 z-20">
            <Hamburger bind:open={hamOpen} --color="white" type="spin" />
        </div>

        <div
            class="sheet-overlay"
            class:active={hamOpen}
            onclick={() => (hamOpen = false)}
        ></div>
        <div class="sheet" class:active={hamOpen}>
            <div class="sheet-content">
                <a
                    href="/profile"
                    class="profile-link"
                    onclick={() => (hamOpen = false)}
                >
                    {#if !UserProfileData.loggedIn}
                        <div class="flex items-center justify-center gap-4">
                            <img
                                class="icon"
                                src={profile_circle}
                                alt="profile"
                            />
                            <span class="text-lg font-semibold">Log in</span>
                        </div>
                    {:else}
                        <div class="flex items-center justify-center gap-4">
                            <img
                                class="icon"
                                src={UserProfileData.picture}
                                alt="profile"
                            />
                            <span class="text-lg font-semibold"
                                >{UserProfileData.name}</span
                            >
                        </div>
                    {/if}
                </a>

                <div class="nav-links">
                    {#each navItems as navItem}
                        <a
                            href={navItem.link}
                            class="nav-item"
                            onclick={() => (hamOpen = false)}
                        >
                            {navItem.name}
                        </a>
                    {/each}
                </div>
            </div>
        </div>
    </div>
</div>

<div class="bg-[#1E1E1E] z-20" style="min-height: 70vh; height:fit-content">
    <WavyBackground>
        <img
            src={bg}
            alt="bg"
            class="fixed inset-0 object-cover w-full h-screen -z-10 sm:hidden"
        />
        {@render children()}
    </WavyBackground>
</div>

<style>
    :global(body) {
        background-color: #1f1f1f;
    }
    .mobile {
        display: none;
    }
    a {
        font-size: medium;
        color: white;
        margin: 10px;
    }
    a:hover {
        color: yellow;
    }
    .logo {
        aspect-ratio: 249/31;
        width: max(14vw, 10em);
    }
    .icon {
        padding: 7px 7px 7px 7px;
        width: 60px;
        border-radius: 50%;
    }

    @media (max-width: 768px) {
        .desktop {
            display: none;
        }
        .mobile {
            display: block;
        }
    }
    .sheet-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.5);
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.3s;
        z-index: 40;
    }

    .sheet-overlay.active {
        opacity: 1;
        visibility: visible;
    }

    .sheet {
        position: fixed;
        top: 0;
        right: -100%;
        width: 80%;
        max-width: 400px;
        height: 100%;
        background: #1f1f1f;
        transition: right 0.3s ease-in-out;
        z-index: 45;
        box-shadow: -2px 0 10px rgba(0, 0, 0, 0.3);
    }

    .sheet.active {
        right: 0;
    }

    .sheet-content {
        padding: 6rem 2rem 2rem;
        height: 100%;
        overflow-y: scroll;
    }

    .profile-link {
        display: block;
        padding: 1rem;
        margin-bottom: 2rem;
        border: 1px solid #333;
        border-radius: 999px;
        transition: background-color 0.2s;
    }

    .profile-link:hover {
        background-color: rgba(255, 255, 255, 0.1);
    }

    .nav-links {
        display: flex;
        flex-direction: column;
        gap: 1rem;
    }

    .nav-item {
        display: block;
        padding: 1rem;
        border-radius: 999px;
        background-color: rgb(253 230 138);
        color: black;
        text-align: center;
        transition: transform 0.2s;
    }

    .nav-item:hover {
        transform: scale(1.02);
        color: black;
    }
</style>
