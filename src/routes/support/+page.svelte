<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import TextInput from "$lib/components/TextInput.svelte";
    import AButton from "$lib/components/AButton.svelte";
    import SimpleCard from "$lib/components/SimpleCard.svelte";

    interface ProblemTicket {
        name: String;
        description: String;
        college: String;
        problem: String;
        category: String;
        phone: String;
    }

    let name = $state(""),
        description = $state(""),
        problemType = $state(""),
        college = $state(""),
        phoneNumber = $state("");

    let { data, form } = $props();
    let selected = $state("website");

    let categories = [
        "contest",
        "event",
        "organization",
        "other",
        "passes",
        "payment",
        "special_request",
        "website",
    ];
</script>

<div class="centre">
    <div class="mid">
        {#if form?.success == true}
            <div class="text-white">Successful!</div>
        {:else if form?.success == false}
            <div class="text-white">Failed! [{form?.error}]</div>
        {/if}
        <AButton href="/tickets"
            ><div class="text-white">Tickets you've submitted</div></AButton
        >
        <SimpleCard>
            <h1 class="text-white">Make a ticket</h1>
            <form method="post" action="?/postTicket" class="mid">
                <TextInput
                    bind:text={college}
                    required
                    placeholder="Your college/ organisation"
                    name="college"
                /><br />
                <div style="align-items: start; text-white">
                    <div class="text-white">Category:</div>
                    <select bind:value={selected} required name="category">
                        {#each categories as cat}
                            <option value={cat}>
                                {cat}
                            </option>
                        {/each}
                    </select>
                </div>
                {#if selected === "other"}
                    <TextInput
                        bind:text={problemType}
                        placeholder="Problem category if other (NA other wise)"
                        name="problem"
                    /><br />
                {/if}
                <TextInput
                    bind:text={description}
                    name="description"
                    required
                    placeholder="Desciption and additional info"
                    type="textarea"
                    maxLength={128}
                />
                <div class="text-white">{description.length}/128</div>
                <Button OnClicked={() => {}} active>Send ticket</Button>
            </form>
        </SimpleCard>
        <AButton href="/contactus"
            ><div class="text-white">Contact us</div></AButton
        >
    </div>
</div>

<style>
    select,
    option {
        margin: 5px;
        padding: 7px;
        border: none;
        background-color: var(--background-dark);
        width: max-content;
        color: var(--text-dark);
        font-optical-sizing: auto;
        font-style: normal;
        font-size: medium;
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
    }
</style>
