<script lang="ts">
    import BasicHeader from "$lib/components/ui/Basic/BasicHeader.svelte";
    import GlowDiv from "$lib/components/ui/GlowDiv.svelte";
    import BasicInput from "$lib/components/ui/Basic/BasicInput.svelte";
    import BasicButtonFilled from "$lib/components/ui/Basic/BasicButtonFilled.svelte";
    import SimpleCard from "$lib/components/SimpleCard.svelte";
    import { onMount } from "svelte";
    import type { SolsticePassInfo } from "$lib/server/BackendTypes.js";
    let { data, form } = $props();
    let isDual = $state(true);
    let passesList = $state([] as SolsticePassInfo[]);
    let isMAHE = $state(true);

    onMount(() => {
        if (data.allPasses != null) {
            for (const p of data.allPasses) {
                passesList.push(p);
            }
        }
    });
</script>

<div class="flex justify-center flex-wrap">
    <div class="p-[30px]">
        <SimpleCard>
            <div class="flex flex-col flex-center justify-center">
                <BasicHeader>Assign pass</BasicHeader>
                {#if data.ticket != null}
                    <SimpleCard>
                        <BasicHeader>Ticket info</BasicHeader>
                        <div class="text-white text-xl">
                            Category : {data.ticket.category}
                        </div>
                        <div class="text-white text-xl">
                            Name : {data.ticket.name}
                        </div>
                        <div class="text-white text-xl">
                            Phone number : <code
                                >{data.ticket.phone_number}</code
                            >
                        </div>
                        <div class="text-white text-xl">
                            email : <code>{data.ticket.email_address}</code>
                        </div>
                        <div class="text-white text-xl">
                            College : {data.ticket.college_name}
                        </div>
                        <div class="text-white text-xl">
                            Ticket ID : <code>{data.ticket.id}</code>
                        </div>

                        <div
                            class="text-white text-xl border-gray-500 border-1 p-3 rounded-lg m-3"
                        >
                            {data.ticket.description}
                        </div>
                    </SimpleCard>
                {/if}
                <div class="flex flex-center justify-center">
                    <label>
                        Is Dual pass?
                        <input
                            type="checkbox"
                            bind:checked={isDual}
                            class="w-10"
                        />
                    </label>
                    <label>
                        Is MAHE pass?
                        <input
                            type="checkbox"
                            bind:checked={isMAHE}
                            class="w-10"
                        />
                    </label>
                </div>
                {#if form?.msg}
                    <div class="text-xl text-white">{form?.msg}</div>
                {/if}
                {#if isMAHE}
                    {#if isDual}
                        <form
                            action="?/dual"
                            method="post"
                            class="flex justify-center flex-center"
                        >
                            <BasicInput
                                placeholder="Reg No 1"
                                required={true}
                                name="reg1"
                            />
                            <BasicInput
                                placeholder="Reg No 2"
                                required={true}
                                name="reg2"
                            />
                            <label class="flex flex-center justify-center">
                                Is esports?
                                <input type="checkbox" name="esports" />
                            </label>
                            <BasicButtonFilled>ASSIGN</BasicButtonFilled>
                        </form>
                    {:else}
                        <form
                            action="?/single"
                            method="post"
                            class="flex justify-center flex-center"
                        >
                            <BasicInput
                                placeholder="Reg No"
                                required={true}
                                name="reg"
                            />
                            <label>
                                Is esports?
                                <input type="checkbox" name="esports" />
                            </label>
                            <BasicButtonFilled>ASSIGN</BasicButtonFilled>
                        </form>
                    {/if}
                {:else}
                    <form
                        action="?/non"
                        method="post"
                        class="flex justify-center flex-center"
                    >
                        <BasicInput
                            placeholder="User ID"
                            required={true}
                            name="userid"
                        />
                        <select name="passid" class="bg-white p-3 rounded-md text-black">
                            {#each passesList as p}
                                <option class="text-black" value={p.id}>{p.name}</option>
                            {/each}
                        </select>
                        <BasicButtonFilled>ASSIGN</BasicButtonFilled>
                    </form>
                {/if}
            </div>
        </SimpleCard>
    </div>
</div>

<style>
    h1,
    div {
        color: white;
    }
    h1 {
        font-size: xx-large;
    }
    a {
        border-style: solid;
        border-width: 1px;
        border-radius: 10px;
        border-color: lightcoral;
        padding: 10px 10px 10px 10px;
        color: lightcoral;
        margin: 15px 15px 15px 15px;
        margin-top: 30px;

        background: rgba(0, 0, 0, 0.15);
        backdrop-filter: blur(15px) saturate(120%);
        -webkit-backdrop-filter: blur(15px) saturate(120%);
        border-radius: 15px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        padding: 15px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        transition: all 0.3s ease-in-out;
    }
    a:hover {
        background: rgba(255, 255, 255, 0.075);
        backdrop-filter: blur(20px);
    }
</style>
