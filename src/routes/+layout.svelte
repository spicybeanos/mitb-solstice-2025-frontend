<script lang="ts">
    import "./app.css";
    import { UserProfileData } from "./GoogleLogin.svelte.ts";
    // import logo from "$lib/falak.png";
    import logo from '$lib/icons/logo.svg'
    import profile_circle from "$lib/icons/account.svg";
    import hamburger from '$lib/icons/hamburger.svg'
    import {FloatingNavbar} from '../lib/components/ui/FloatingNavBar/index.ts';
    import { onMount } from "svelte";
    import * as Sheet from "$lib/components/ui/sheet";
    import { checkLoggedIn } from "./GoogleLogin.svelte.ts";

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
    const navItems = [{name: "Passes", link: "/passes"}, {name: "Events", link: "/events"}, {name: "Support", link: "/support"}, {name: "Stay", link: "/stay"}];
    if(manageAccess){
        navItems.push({ name: "Manage", link: "/manage" });
    }
    let open = $state(false);
    function toggleOpen(){
        open = !open;
    }
</script>


<div class="desktop pb-[120px]">
        <a href="/" class="grow max-w-[33%] absolute top-7.5 left-3.5"
            ><img class="logo w-[26vw] md:w-[15vw]" src={logo} alt="logo" /></a
        >
        <FloatingNavbar navItems={navItems} />

        <a href="/profile" class="grow flex flex-row justify-end max-w-[33%] absolute top-3.5 right-3.5">
            {#if !UserProfileData.loggedIn}
                <img class="icon" src={profile_circle} alt="profile" />
            {:else}
                <img class="icon" src={UserProfileData.picture} alt="profile" />
            {/if}
        </a>
</div>


<div class="mobile">
        <div
            class="relative w-full"
        >
            <a href="/" class="grow max-w-[33%] absolute top-[1.25rem] left-0"
                ><img
                    class="logo w-[26vw] md:w-[15vw]"
                    src={logo}
                    alt="logo"
                /></a
            >
            <Sheet.Root open={open} >
                <Sheet.Trigger><img src={hamburger} alt="menu" width={35} height={35} class="cursor-pointer hover:scale-110 transition-all absolute top-4.5 right-3.5" /></Sheet.Trigger>
                <Sheet.Content class="bg-black text-white">
                  <Sheet.Header class="mt-8 mb-16">
                    <a href="/profile" class="sm:my-8 px-6 grow flex flex-row justify-center border-[0.25px] border-white rounded-full h-[50%] w-full"  onclick={toggleOpen}>
                        <Sheet.Title class="w-full h-[10%] flex justify-center items-center gap-2 rounded-full p-1 text-light-100">
                            {#if !UserProfileData.loggedIn}
                                <div class="flex w-full items-center justify-center bg-amber-50">
                                    <img class="icon" src={profile_circle} alt="profile" />
                                    <h2 class="ml-4 self-center text-sm sm:text-2xl font-semibold text-white text-nowrap">Log in</h2>
                                </div>
                            {:else}
                                <div class="flex w-full items-center justify-center">
                                    <img class="icon" src={UserProfileData.picture} alt="profile" />
                                    <h2 class="ml-4 self-center text-sm sm:text-2xl font-semibold text-white text-nowrap">{UserProfileData.name}</h2>
                                </div>
                            {/if}
                        </Sheet.Title>
                    </a>
                    <Sheet.Description class="flex flex-col mt-6">
                        {#each navItems as navItem, idx (`link=${idx}`)}
                            <a
                                href={navItem.link}
                                class="py-4 w-full p-2 bg-amber-200 rounded-full "
                            >
                                <span class="text-sm text-black w-full text-center">{navItem.name}</span>
                            </a>
                        {/each}
                    </Sheet.Description>
                  </Sheet.Header>
                </Sheet.Content>
              </Sheet.Root>
        </div>
</div>

<div class="bg-[#1E1E1E]" style="min-height: 70vh; height:fit-content">
    {@render children()}
</div>

<footer class="flex flex-col p-6 md:p-8 text-xs md:text-base text-white" style="z-index: -33333;">
    <div class="flex flex-row justify-between">
        <div class="flex flex-col">
            <p>Manipal Institute of technology</p>
            <p>Yelahanka, Bengaluru</p>
            <p>Karnataka - 650036</p>
        </div>

        <div class="flex flex-col text-right">
            <p>Contact @</p>
            <p>+91 79069 52055</p>
            <p>( Atharva Maikhuri - HR Head )</p>
        </div>
    </div>
</footer>

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
</style>
