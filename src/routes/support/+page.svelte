<script lang="ts">
    import Button from "$lib/components/Button.svelte";
    import Card from "$lib/components/Card.svelte";
    import TextInput from "$lib/components/TextInput.svelte";
    import AButton from "$lib/components/AButton.svelte";

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

    let { data } = $props();
    let selected = $state(1);

    let categories = [
        {
            id: 1,
            text: "Website",
        },
        {
            id: 2,
            text: "Passes",
        },
        {
            id: 3,
            text: "Payment",
        },
        {
            id: 4,
            text: "Other",
        },
        {
            id: 5,
            text: "Organisation",
        },
        {
            id: 6,
            text: "Contests/ Contest results",
        },
    ];
</script>

<div class="centre">
    <div class="mid">
        <AButton href="/tickets">Tickets you've submitted</AButton>
        <Card title="Make a ticket">
            <form method="post" action="?/postTicket" class="mid">
                <TextInput
                    bind:text={name}
                    required
                    placeholder="Your name"
                    name="name"
                /><br />
                <TextInput
                    bind:text={phoneNumber}
                    required
                    maxLength={10}
                    placeholder="Your phone number (whatsapp)"
                    name="phone"
                /><br />
                <TextInput
                    bind:text={college}
                    required
                    placeholder="Your college/ organisation"
                    name="college"
                /><br />
                <div style="align-items: start;">
                    Category:
                    <select bind:value={selected} required name="category">
                        {#each categories as cat}
                            <option value={cat.id}>
                                {cat.text}
                            </option>
                        {/each}
                    </select>
                </div>
                {#if selected === 4}
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
                <div>{description.length}/128</div>
                <Button OnClicked={() => {}} active>Send ticket</Button>
            </form>
        </Card>
        <AButton href="/contactus">Contact us</AButton>

    </div>
</div>

<style>
    select,
    option {
        margin: 5px;
        padding: 7px;
        border: none;
        border-radius: 6px;
        background-color: var(--background-light);
        width: max-content;

        font-family: "Clash Display Medium";
        font-optical-sizing: auto;
        font-style: normal;
        font-size: x-large;
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
