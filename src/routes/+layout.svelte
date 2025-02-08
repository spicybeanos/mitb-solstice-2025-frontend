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
    <ALink style="margin:5px" href="/"><img class="logo" src={logo} alt="logo" /></ALink>
    <div>
        <ALink style="margin:5px" href="/events"><img class="icon" src={events_icon} alt="events and conclaves"></ALink>
        <ALink style="margin:5px" href="/support"><img class="icon" src={support_icon} alt="support"></ALink>
        <ALink style="margin:5px" href="/passes"><img class="icon" src={tickets_icon} alt='passes'></ALink>
        <ALink style="margin:5px" href="/stay"><img class="icon" src={stay_icon} alt='stay and accomodation'></ALink>
    </div>

    <ALink style="margin:5px" href="/profile">
        {#if !UserProfileData.loggedIn}
        <img class="icon" src={profile_circle} alt='profile'>
        {:else}
        <img class="icon" src={UserProfileData.picture} alt='profile'>
        {/if}
    </ALink>
</nav>
{@render children()}

<style>
    .logo{
        width: max(7vw,10em);
    }
    .icon{
        width: min(7vw,2em);
    }
    div{
        display: flex;
        justify-content: center;
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
