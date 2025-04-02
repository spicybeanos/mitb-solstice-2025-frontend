<script lang="ts">
    import { onMount, tick } from "svelte";
    import { UserProfileData } from "../GoogleLogin.svelte.ts";
    import SimpleCard from "$lib/components/SimpleCard.svelte";
    import type { ProblemTicket } from "$lib/server/BackendTypes.ts";
    import BasicButtonFilled from "$lib/components/ui/Basic/BasicButtonFilled.svelte";

    let tickets = $state([] as ProblemTicket[]);
    let { data } = $props();
    let loadingData = $state(false);

    onMount(() => {
        tickets = data.tickets;
    });

    let ticketDeletResult = $state(null as string | null);

    function deleteTicket(ticketID: string) {
        fetch(`/tickets/delete/${ticketID}`, { method: "POST" }).then((r) => {
            if (r.ok) {
                r.json().then((body) => {
                    ticketDeletResult = body.msg;
                });
            } else {
                r.json().then((body) => {
                    ticketDeletResult = body.error;
                });
            }
        }).then(
        );
    }

    // TO BE CALLED ON MOUNT ONLY !!
</script>

<div class="mid">
    <div class="flex justify-center">
        <div class="text-white">Unsolved tickets: {tickets.length}</div>
    </div>
    {#if ticketDeletResult != null}
        <div class="text-white">{ticketDeletResult}</div>
    {/if}
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
                            Phone: {ticket.phone_number}
                        </div>
                        <div class="medium text-white">
                            e-mail : {ticket.email_address}
                        </div>
                        <code class="tiny gray">{ticket.id}</code>
                        <div
                            class="medium text-white border border-gray-500 p-1.5 rounded-sm"
                        >
                            {ticket.description}
                        </div>
                        {#if ticket.comment != ""}
                            <div class="text-green-400">{ticket.comment}</div>
                        {/if}
                        <BasicButtonFilled
                            color="red"
                            OnClick={() => {
                                deleteTicket(ticket.id);
                            }}
                        >
                            <b>DELETE</b></BasicButtonFilled
                        >
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
