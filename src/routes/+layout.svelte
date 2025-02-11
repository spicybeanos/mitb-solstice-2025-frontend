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

<nav>
    <a style="margin:5px" href="/"><img class="logo" src={logo} alt="logo" /></a
    >
    <div class="hotbar">
        <a style="margin:0.3em" href="/events">EVENTS</a>
        <a style="margin:0.3em" href="/support">SUPPORT</a>
        <a style="margin:0.3em" href="/passes">PASSES</a>
        <a style="margin:0.3em" href="/stay">STAY</a>
    </div>

    <a style="margin:5px" href="/profile">
        {#if !UserProfileData.loggedIn}
            <img class="icon" src={profile_circle} alt="profile" />
        {:else}
            <img class="icon" src={UserProfileData.picture} alt="profile" />
        {/if}
    </a>
</nav>
<div class="bg-[#1E1E1E]" style="min-height: 70vh;">
   {@render children()} 
</div>


<div class="justify-between p-[1vw]">
    <div class="text-white">
        Manipal Institute of Technology<br />Yelahanka, Bengaluru<br
        />Karnataka- 650036
    </div>
</div>

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
