<script lang="ts">
    import BasicHeader from "$lib/components/ui/Basic/BasicHeader.svelte";

    let { data } = $props();
    let show_tname = $state(true);
    let show_pname = $state(true);
    let show_pemail = $state(true);
    let show_pnum = $state(true);
    let show_reg = $state(true);
</script>

<div class="flex justify-center">
    {#if data.success}
        <div class="flex flex-col w-[60%]">
            <BasicHeader>Event registerations</BasicHeader>
            <div>
                <label>
                    <input
                        type="checkbox"
                        name="flavours"
                        bind:checked={show_tname}
                    /><span class="text-white p-[5px]">Team Name</span>
                </label>
                <label>
                    <input
                        type="checkbox"
                        name="flavours"
                        bind:checked={show_pname}
                    /><span class="text-white p-[5px]">Player Name</span>
                </label>
                <label>
                    <input
                        type="checkbox"
                        name="flavours"
                        bind:checked={show_pemail}
                    /><span class="text-white p-[5px]">Player email</span>
                </label>
                <label>
                    <input
                        type="checkbox"
                        name="flavours"
                        bind:checked={show_pnum}
                    /><span class="text-white p-[5px]">Player phone number</span
                    >
                </label>
                <label>
                    <input
                        type="checkbox"
                        name="flavours"
                        bind:checked={show_reg}
                    /><span class="text-white p-[5px]"
                        >Player mahe registration number</span
                    >
                </label>
            </div>
            <table>
                <thead>
                    <tr>
                        {#if show_tname}
                            <th> Team Name </th>
                        {/if}
                        {#if show_pname}
                            <th>Name</th>
                        {/if}
                        {#if show_pnum}
                            <th> Number </th>
                        {/if}
                        {#if show_pemail}
                            <th> Email </th>
                        {/if}
                        {#if show_reg}
                            <th> Mahe Reg Num </th>
                        {/if}
                    </tr>
                </thead>
                <tbody>
                    {#if data.success}
                        {#if data.rows != undefined}
                            {#each data.rows as row}
                                <tr>
                                    {#if show_tname}
                                        <th>
                                            {#if row.is_captain}
                                                <span class="text-red-300"
                                                    >{row.team_name}</span
                                                >
                                            {:else}
                                                <span class="text-white"
                                                    >{row.team_name}</span
                                                >
                                            {/if}
                                        </th>
                                    {/if}
                                    {#if show_pname}
                                        <th
                                            >{#if row.is_captain}
                                                <span class="text-red-300"
                                                    >(C) {row.player_name}</span
                                                >
                                            {:else}
                                                <span class="text-white"
                                                    >{row.player_name}</span
                                                >
                                            {/if}</th
                                        >
                                    {/if}
                                    {#if show_pnum}
                                        <th
                                            >{#if row.is_captain}
                                                <span class="text-red-300"
                                                    >{row.player_phno}</span
                                                >
                                            {:else}
                                                <span class="text-white"
                                                    >{row.player_phno}</span
                                                >
                                            {/if}</th
                                        >
                                    {/if}
                                    {#if show_pemail}
                                        <th>
                                            {#if row.is_captain}
                                                <span class="text-red-300"
                                                    >{row.player_email}</span
                                                >
                                            {:else}
                                                <span class="text-white"
                                                    >{row.player_email}</span
                                                >
                                            {/if}
                                        </th>
                                    {/if}
                                    {#if show_reg}
                                        <th>
                                            {#if row.is_captain}
                                                <span class="text-red-300"
                                                    >{row.player_reg}</span
                                                >
                                            {:else}
                                                <span class="text-white"
                                                    >{row.player_reg}</span
                                                >
                                            {/if}
                                        </th>
                                    {/if}
                                </tr>
                            {/each}
                        {/if}
                    {/if}
                </tbody>
            </table>
        </div>
    {:else}
        <div class="flex flex-col w-[60%]">
            <BasicHeader>{data.error}</BasicHeader>
        </div>
    {/if}
</div>

<style>
    table {
        font-family: arial, sans-serif;
        border-collapse: collapse;
        width: 100%;
    }

    td,
    th {
        border: 1px solid #dddddd;
        text-align: left;
        color: white;
        padding: 8px;
    }

    tr:nth-child(even) {
        background-color: #201a43;
    }
</style>
