<script>
    import "./app.css";
    import { UserProfileData } from "./GoogleLogin.svelte.ts";
    import logo from "$lib/falak.png";
    import profile_circle from "$lib/icons/account_circle.png"
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
    <a style="margin:5px" href="/"><img class="logo" src={logo} alt="logo" /></a>
    <div>
        <a style="margin:5px" href="/events"><img class="icon" src={events_icon} alt="events and conclaves"></a>
        <a style="margin:5px" href="/support"><img class="icon" src={support_icon} alt="support"></a>
        <a style="margin:5px" href="/passes"><img class="icon" src={tickets_icon} alt='passes'></a>
        <a style="margin:5px" href="/stay"><img class="icon" src={stay_icon} alt='stay and accomodation'></a>
    </div>

    <a style="margin:5px" href="/profile">
        {#if !UserProfileData.loggedIn}
        <img class="icon" src={profile_circle} alt='profile'>
        {:else}
        <img class="icon" src={UserProfileData.picture} alt='profile'>
        {/if}
    </a>
</nav>
{@render children()}

<style>
    .logo{
        width: max(7vw,10em);
    }
    .icon{
        padding: 7px 7px 7px 7px;
        width: min(7vw,3em);
    }
    div{
        display: flex;
        justify-content: center;
        border-style: solid ;
        border-width: 0.1em;
        border-radius: 3em;
        border-color: black;
        padding: 0.3em 0.3em 0.3em 0.3em;
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
