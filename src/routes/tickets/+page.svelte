<script lang="ts">
    import { onMount } from "svelte";
    import { UserProfileData } from "../GoogleLogin.svelte.ts";
    import SimpleCard from "$lib/components/SimpleCard.svelte";
    import type { ProblemTicket } from '$lib/server/BackendTypes.ts';

    let tickets = $state([] as ProblemTicket[]);
    let { data } = $props();
    let loadingData = $state(false);

    onMount(() => {
        tickets = data.tickets;
    });

    // TO BE CALLED ON MOUNT ONLY !!
    async function getTickets() {
        loadingData = true;
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
        loadingData = false;
    }
</script>

<div class="mid">
    <div class="flex justify-center">
        <div class="text-white">Unsolved tickets: {tickets.length}</div>
    </div>
    {#if !UserProfileData.loggedIn}
        <div style="color: red;">Please log in to make a ticket!</div>
    {/if}
    <div class="centre">
        {#each tickets as ticket}
            <div class="margin">
                <SimpleCard>
                    <div class="text-white">Problem : {ticket.problem}</div>
                    <div class="border border-gray-500 p-1.5 rounded-sm">
                        <div
                            class="text-white"
                            style="color:{ticket.solved ? 'green' : 'red'}"
                        >
                            {ticket.solved ? "Solved" : "Un Solved"}
                        </div>
                        <div class="medium text-white">
                            Phone: {ticket.phone}
                        </div>
                        <div class="medium text-white">
                            e-mail : {ticket.email}
                        </div>
                        <div class="tiny gray">{ticket.ticketID}</div>
                        <div
                            class="medium text-white border border-gray-500 p-1.5 rounded-sm"
                        >
                            {ticket.description}
                        </div>
                        {#if ticket.comment != ''}
                        <div class='text-green-400'>{ticket.comment}</div>
                        {/if}
                    </div>
                </SimpleCard>
            </div>
        {/each}
    </div>
</div>

<style>
    .tiny {
        font-size: small;
    }
    .medium {
        font-size: medium;
    }
    .gray {
        color: grey;
    }
    .margin {
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
