<script lang="ts">
    import type { SolsticePassInfo } from '$lib/components/backend/BackendAgentPass.js';

    let { data } = $props();
    let email = $state('');
    let response:{ownsPass:boolean,pass:SolsticePassInfo,error:string}|null = $state(null);

    async function verifyEmail(){
        let base_url =
            window === undefined
                ? "http://localhost:5173/tickets"
                : (window as any).location.origin;
        const email_q = encodeURIComponent(email);
            console.log(email_q);
            let url: URL = new URL("tickets", base_url);
            url.searchParams.append("email", email);

        const res = await fetch(url.toString(),{method:'GET'});
        
    }
</script>

<div class="p-[30px]">
    <h1>Here you can veirfy what pass an email owns.</h1>
    <label for="email">
        Email:
        <input required type="email" name="email" placeholder="enter email" bind:value={email}/>
    </label>

    <button onclick={() => {await verifyEmail();}}>Get</button>
    {#if response?.error != null}
        <div>
            An error happened:
            {response.error}
        </div>
    {/if}
    {#if response?.ownsPass}
        <div class="flex flex-row">
            Pass Name : {response.pass?.name}
            Pass Description : {response.pass?.description}
            Pass Cost : {response.pass?.cost}
        </div>
    {/if}
</div>

<style>
    h1,
    div {
        color: white;
    }
    input,
    button {
        border-style: solid;
        border-width: 1px;
        border-color: lightblue;
        padding: 5px 5px 5px 5px;
        color: lightblue;
    }
</style>
