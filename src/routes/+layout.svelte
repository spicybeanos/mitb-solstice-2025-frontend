<script>
    import "./app.css";
    import { UserProfileData } from "./GoogleLogin.svelte.ts";
    import logo from "$lib/falak.png";
    import profile_circle from "$lib/icons/account_circle.png";
    import tickets_icon from "$lib/icons/ticket.png";
    import support_icon from "$lib/icons/support.png";
    import events_icon from "$lib/icons/event.png";
    import stay_icon from "$lib/icons/stay.png";

    import ALink from "$lib/components/ALink.svelte";
    import { onMount } from "svelte";
    import { checkLoggedIn } from "./GoogleLogin.svelte.ts";

    let { children, data } = $props();

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
</script>

<nav class="absolute top-0 z-10 flex flex-row items-center justify-between p-3 md:p-6 w-full">
    <a href="/" class="grow max-w-[33%]"><img class="logo w-[26vw] md:w-[15vw]" src={logo} alt="logo" /></a>
    
    <div class="flex flex-row grow-0 rounded-full px-12 py-3 bg-black text-white gap-8">
        <a class="hover:text-[#AB83FE] cursor-pointer" href="/passes">Passes</a>
        <a class="hover:text-[#AB83FE] cursor-pointer" href="/events">Events</a>
        <a class="hover:text-[#AB83FE] cursor-pointer" href="/support">Support</a>
        <a class="hover:text-[#AB83FE] cursor-pointer" href="/stay">Stay</a>
        <!-- <a href="/events"><img class="icon " src={events_icon} alt="events and conclaves"></a>
        <a href="/support"><img class="icon" src={support_icon} alt="support"></a>
        <a href="/passes"><img class="icon" src={tickets_icon} alt='passes'></a>
        <a href="/stay"><img class="icon" src={stay_icon} alt='stay and accomodation'></a> -->

    </div>

    <a href="/profile" class="grow flex flex-row justify-end max-w-[33%]">
        {#if !UserProfileData.loggedIn}

        <img class="icon" src={profile_circle} alt='profile'>

        {:else}
            <img class="icon" src={UserProfileData.picture} alt="profile" />
        {/if}
    </a>
</nav>

<div class="bg-[#1E1E1E]" style="min-height: 70vh;">
   {@render children()} 
</div>


<footer class="flex flex-col p-6 md:p-8 text-xs md:text-base text-white">
    <div class="flex flex-row justify-between">
        <div class="flex flex-col">
            <p>Manipal Institute of technology</p>
            <p>Yelahanka, Bengaluru</p>
            <p>Karnataka - 650036</p>
        </div>

        <div class="flex flex-col text-right">
            <p>Contact @</p>
            <p>+91 12345 67890</p>
            <p>( Name - HR Head )</p>
        </div>
    </div>
</footer>

<style>

    :global(body) {
        background-color: #ab83fe;
    }
    a {
        font-size: small;
        color: white;
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
        width: min(12vw, 3em);
        border-radius: 50%;
    }
    .hotbar {
        display: flex;
        justify-content: center;
        align-items: center;
        border-style: solid;
        border-width: 0.1em;
        border-radius: 2em;
        border-color: black;

        padding-left: 1em;
        padding-right: 1em;
        aspect-ratio: 290/40;
        height: 40px;
        background-color: black;
    }
    nav {
        padding: 15px;
        margin: 12px;
        flex-wrap: wrap;
        display: flex;
        justify-content: space-between;
        flex-direction: row;
    }
</style>
