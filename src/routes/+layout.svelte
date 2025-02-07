<script>
    import "./app.css";
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
    <ALink style="margin:5px" href="/">Home</ALink>
    <ALink style="margin:5px" href="/profile">Profile</ALink>
    <ALink style="margin:5px" href="/events">Events & Conclaves</ALink>
    <ALink style="margin:5px" href="/support">Support</ALink>
    <ALink style='margin:5px' href='/stay'>Accommodation</ALink>
</nav>
{@render children()}

<style>
    nav {
        padding: 15px;
        margin: 12px;
        border-radius: 1em;
        border-style: solid;
        flex-wrap: wrap;
        display: flex;
        flex-direction: row;
        border-color: var(--border-light-mode);
        box-shadow: 0px 6px black;
    }
</style>
