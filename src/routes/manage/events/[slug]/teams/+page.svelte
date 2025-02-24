<script lang="ts">
    let { data } = $props();
    let show_tname = $state(true);
    let show_tcap = $state(true);
    let show_pname = $state(true);
    let show_pemail = $state(true);
</script>

<div class="flex justify-center">
    <div class="flex flex-col w-[60%]">
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
                    bind:checked={show_tcap}
                /><span class="text-white p-[5px]">Team Captain</span>
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
        </div>
        <table>
            <thead>
                <tr>
                    {#if show_tname}
                        <th> Team Name </th>
                    {/if}
                    {#if show_tcap}
                        <th> Team Captain </th>
                    {/if}
                    {#if show_pname}
                        <th>Player Name</th>
                    {/if}
                    {#if show_pemail}
                        <th> Player Email </th>
                    {/if}
                </tr>
            </thead>
            <tbody>
                <tr>
                    {#if show_tname}
                        <th> a </th>
                    {/if}
                    {#if show_tcap}
                        <th> b </th>
                    {/if}
                    {#if show_pname}
                        <th>c</th>
                    {/if}
                    {#if show_pemail}
                        <th> d </th>
                    {/if}
                </tr>
            </tbody>
        </table>
    </div>
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
