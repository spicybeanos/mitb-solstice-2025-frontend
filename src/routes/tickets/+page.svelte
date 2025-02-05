<script lang="ts">
    import { onMount } from "svelte";
    import { UserProfileData } from "../GoogleLogin.svelte.ts";
    import Button from "$lib/components/Button.svelte";
    import Card from "$lib/components/Card.svelte";
    import type {ProblemTicket} from '../support/+page.server.ts'

    let tickets = $state([] as ProblemTicket[]);
    let { data } = $props();
    let loadingData = $state(false);

    onMount(() => {
        getTickets();
    });

    // TO BE CALLED ON MOUNT ONLY !!
    async function getTickets() {
        loadingData=true;
        let base_url =
            window === undefined
                ? "http://localhost:5173/tickets"
                : (window as any).location.origin;

        if (UserProfileData.loggedIn) {
            const email_q = encodeURIComponent(UserProfileData.email);
            console.log(email_q);
            let url: URL = new URL("tickets", base_url);
            url.searchParams.append("email", UserProfileData.email);
            console.log(url.toString());
            const response = await fetch(url.toString(), {
                method: "GET",
            });
            const result = await response.json();
            if (result.success) {
                tickets = result.value;
            } else {
                console.log("no tickets!");
            }
        }
        loadingData=false;
    }
</script>

<div class="mid">
    <div class="centre">
        <Button disable={loadingData} padding={5} OnClicked={getTickets}><svg xmlns="http://www.w3.org/2000/svg" height="30px" viewBox="0 -960 960 960" width="30px" fill="#000000"><path d="M480-160q-134 0-227-93t-93-227q0-134 93-227t227-93q69 0 132 28.5T720-690v-110h80v280H520v-80h168q-32-56-87.5-88T480-720q-100 0-170 70t-70 170q0 100 70 170t170 70q77 0 139-44t87-116h84q-28 106-114 173t-196 67Z"/></svg></Button>
        <div>Unsolved tickets: {tickets.length}</div>
    </div>
    {#if !UserProfileData.loggedIn}
        <div style="color: red;">Please log in to make a ticket!</div>
    {/if}
    <div class="centre">
        {#each tickets as ticket}
            <div class='margin'>
                <Card title={ticket.category}>
                    <div>Problem : {ticket.problem}</div>
                    <div class="" style="color:{ticket.solved?"green":"red"}">{ticket.solved?"Solved":"Un Solved"}</div>
                    <div class="medium">{ticket.description}</div>
                    <div class="medium">Phone: {ticket.phone}</div>
                    <div class="medium">e-mail : {ticket.email}</div>
                    <div class="tiny gray">{ticket.ticketID}</div>
                </Card>
            </div>
        {/each}
    </div>
</div>

<style>
    .tiny{
        font-size: small;
    }
    .medium{
        font-size: medium;
    }
    .gray{
        color: grey;
    }
    .margin{
        margin: 10px;
    }
    .mid {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: fit-content;
    }
    .centre {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
    }
</style>
