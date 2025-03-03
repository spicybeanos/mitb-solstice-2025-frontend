<script>
    import { browser } from "$app/environment";
    import { Share2 } from "lucide-svelte";
    import { writable } from "svelte/store";
    let showPopup=writable(false)
    async function copyURL() {
        
        if (!browser) return;
        const url= window.location.href
        try{
            navigator.clipboard.writeText(url)
            showPopup.set(true)
            setTimeout(()=>showPopup.set(false),2000)
        }catch (e){
            console.log("ERror is ",e)
        }
    }
</script>

<button on:click={copyURL} class="copy-btn"><Share2></Share2></button>

{#if $showPopup}
    <div class="popup">URL copied to clipboard</div>
{/if}

<style>

    .popup {
        position: fixed;
        top: 50px;
        left: 50%;
        transform: translateX(-50%);
        background: black;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        opacity: 0.9;
        font-size: 14px;
    }
</style>