<script lang="ts">
    import BasicHeader from "$lib/components/ui/Basic/BasicHeader.svelte";
    import BasicInput from "$lib/components/ui/Basic/BasicInput.svelte";
    import BasicButtonFilled from "$lib/components/ui/Basic/BasicButtonFilled.svelte";
    import BasicButtonOutline from "$lib/components/ui/Basic/BasicButtonOutline.svelte";
    import SimpleCard from "$lib/components/SimpleCard.svelte";
    import AButton from "$lib/components/AButton.svelte";
    let { data, form } = $props();
    let comment = $state("");
</script>

<div class="flex justify-center">
    <div class="p-[30px]">
        <SimpleCard>
            <div>
                {#if form?.err}
                    <div class="text-red-400">{form?.err}</div>
                {/if}
                {#if form?.msg}
                    <div>{form?.msg}</div>
                {/if}
            </div>
            <div
                class="border border-gray-600 rounded-lg p-5 flex flex-col m-[5px]"
            >
                <BasicHeader>Ticket Information</BasicHeader>
                <code>{data.ticket?.id}</code>
                {#if data.ticket?.solved}
                    <div style:color="green">Status: Solved</div>
                {:else}
                    <div style:color="red">Status: Un solved</div>
                {/if}
                <div>Name : {data.ticket?.name}</div>
                <div>Phone number : {data.ticket?.phone_number}</div>
                <div>E-mail : {data.ticket?.email_address}</div>
                <div>College : {data.ticket?.college_name}</div>
                <div>Category : {data.ticket?.category}</div>
                {#if data.ticket?.category == "other"}
                    <div>Problem : {data.ticket?.problem}</div>
                {/if}
                <div>
                    <AButton
                        href={`/manage/dual?ticket_id=${encodeURIComponent(data.ticket?.id)}`}
                        >Assign dual pass</AButton
                    >
                </div>
                <div>Description : {data.ticket?.description}</div>
            </div>
            <div>
                <form action="?/solve" method="POST">
                    <label
                        >Comment:
                        <BasicInput
                            name="comment"
                            placeholder="Enter comment"
                            value={comment}
                            required
                        />
                    </label>
                    <label
                        >Is it solved? <input
                            type="checkbox"
                            name="solved"
                        /></label
                    >
                    <BasicButtonFilled><b>MARK</b></BasicButtonFilled>
                </form>
                <form action="?/delete" method="POST">
                    <BasicButtonOutline color="red"
                        ><b>DISMIS & DELETE</b></BasicButtonOutline
                    >
                </form>
            </div>
        </SimpleCard>
    </div>
</div>

<style>
    div {
        color: white;
        font-size: large;
    }
</style>
