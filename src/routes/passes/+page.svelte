<script lang='ts'>
    import type { FalakPass } from '$lib/components/FalakPass.js';
    import { onMount } from 'svelte';
    import PassCard from '$lib/components/PassCard.svelte';
    import BuyPass from '$lib/components/BuyPass.svelte';
    import QRCode from '$lib/components/QR.svelte';
    import type { SolsticePassInfo } from '$lib/components/backend/BackendAgentPass.js';
    import type { EventInAllPasses } from './+page.server.js';
    import type { SolsticeUserPass } from '$lib/components/backend/BackendAgentUser.js';
    import { fade,slide,scale } from 'svelte/transition'
    import { cubicOut, quintOut } from 'svelte/easing';
    
    let {data} = $props();
    
    let loading = $state(true);
    let SolsticeAllPassInfo:SolsticePassInfo[]|null = $state([]);
    let EventsInAllPasses:EventInAllPasses[]|null = $state([]);

    let userPassInfo:SolsticeUserPass|null=$state(null)

    onMount(async () => {
        await new Promise(resolve => setTimeout(resolve, 100));
        SolsticeAllPassInfo = data.SolsticeAllPassInfo;
        EventsInAllPasses = data.EventsInAllPasses;
        userPassInfo = data.userPassInfo;
        loading = false;
    });
    
</script>

{#if !loading}
    <div class="outer" in:fade={{duration: 300,delay: 150}}>
        <div class="inner ">
            {#if userPassInfo==null}
                {#if SolsticeAllPassInfo!==null}
                    {#each SolsticeAllPassInfo as pass,i}
                        {#if pass.name !== undefined}
                            
                                <div class="container"
                                    in:slide={{
                                        delay: i * 200,
                                        duration: 1000,
                                        easing: quintOut,
                                        axis: 'y'
                                    }}
                                    out:fade|global={{
                                        duration: 300
                                    }}
                                >
                                    <div class="card-wrapper"
                                        in:scale|global={{
                                            delay: i * 200,
                                            duration: 800,
                                            start: 0.95,
                                            opacity:0
                                        }}>
                                        <PassCard>
                                            <div class="detailContainer">
                                                <h1 class="text-6xl font-bold mb-1">{pass.name}</h1>
                                                <div class="desc text-sm mb-1">
                                                    {pass.description}
                                                </div>
    
                                                <div class="eventsIncludedOuter">
                                                    {#if EventsInAllPasses!==null}
                                                        {#each EventsInAllPasses as event}
                                                            {#if event.pass===pass.name}
                                                                <div class="eventsIncluded">
                                                                    <a href={`/events/${event.id}`}>{event.name}</a>
                                                                </div>
                                                            {/if}
                                                        {/each}
                                                    {/if}
                                                </div>
                                                
                                                <div class="price">
                                                    {pass.cost}
                                                </div>
                                                <div class="button mt-2">
                                                    <BuyPass href={`https://payment.manipal.edu/bangalore-campus`} >
                                                        <div class="text">Buy Pass!</div>
                                                    </BuyPass>  
                                                </div>
                                            </div>
                                        </PassCard>
                                    </div>                                    
                                </div>
                        {/if}
                    {/each}
                    {:else}
                        <div class="emptyPassOuter">
                            <div class="emptyPassInner">
                                No Passes Online at the moment. Check Another time
                            </div>
                        </div>
                {/if}
                {:else}
                <div class="outer">
                    <div class="inner">
                        <div class="">
                            <PassCard>
                                <div class="detailContainer">
                                    <h1 class="text-6xl font-bold mb-6">{userPassInfo.name}</h1>
                                    <div class="uniqueString text-sm ">
                                        Unique Id: {userPassInfo.id}
                                    </div>
                                    <div class="price">
                                        {pass.cost}
                                    <div class="qr-container">
                                        <QRCode text={userPassInfo.id} />
                                    </div>
                                    <div class="button mt-4">
                                        <BuyPass href="/events" >
                                            <div class="text">Pass Bought!</div>
                                        </BuyPass>
                                    </div>
                                </div>
                            </PassCard>
                        </div>
                    </div>
                </div>
            {/if}
        </div>
    </div>
    {:else}
    <div class="loading-container" in:fade>
        <div class="loading-spinner"></div>
    </div>
{/if}


<style>
    .outer {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    align-items: center;
    width: 100%;
    padding: 48px;
    background-color: #1e1e1e;
}

.inner {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: stretch;
    max-width: 1600px; 
    gap: 0px; 
    perspective: 1000px;
    transform-style: preserve-3d;
    backface-visibility: hidden;
}


.container {
    flex: 1 1 calc(33.333% - 20px);
    max-width: 33%; 
    box-sizing: border-box;
    margin-bottom: 20px; 
    display: flex;
    flex-direction: column;
    align-items: stretch;
    word-wrap: break-word;
    overflow-wrap: break-word;
    transform-origin: center;
    will-change: transform, opacity;
    transform: translateY(100px);
    opacity: 0;
    animation: slideUp 2000ms cubic-bezier(0.23, 1, 0.32, 1) forwards;
    animation-delay: calc(1000ms * var(--index));
}

.PassCard {
    display: flex;
    flex-direction: column;
    height: 100%; 
}

.desc {
    flex-grow: 1;
    text-align: center;
    font-size: 1rem; 
    margin-bottom: 32px;
    margin-top: 20px;
}
.uniqueString {
    color: #AB83FE;
    flex-grow: 1;
    text-align: center;
    font-size: 1rem;
    margin-bottom: 32px;
    margin-top: 20px;
    word-break: break-word;
    white-space: normal;
}

.button {
    width: 100%;
    display: flex;
    justify-content: center; 
}

.text{
    color: #000000;
}

.detailContainer h1 {
    font-size: 2.5rem; 
    margin-top: -10px; 
    font-weight: 800;
    line-height: 1.1;
    padding-bottom: 16px;
    
}

.button AButton {
    flex-grow: 1;
    display: flex;
    justify-content: center;
}

.detailContainer {
    display: flex;
    flex-direction: column;
    justify-content: space-between; 
    align-items: center;
    width: 100%;
    font-size: 1.5rem;
    margin-top: 2%;
    transition: opacity 1s ease;
    color: #C7AE93;
    text-align: center;
    flex-grow: 1; 
    height: 100%;
}

@media screen and (max-width: 1024px) {
    .container {
        flex: 1 1 calc(50% - 20px);
        max-width: 48%;
    }
}

@media screen and (max-width: 768px) {
    .container {
        flex: 1 1 100%;
        max-width: 100%;
    }
    .detailContainer h1 {
        font-size: 2rem;
        margin-top: -5px;
    }
    .desc {
        font-size: 1rem; 
    }
    
}

@media screen and (max-width: 480px) {
    .inner{
        max-width: 300px;
        margin-left: 0px;
    }
    
    .detailContainer h1 {
        font-size: 1.8rem;
        margin-top: 0px; 
    }

    .desc {
        font-size: 0.7rem; 
    }
}

.price{
    text-align:center;
    font-size: 0.9rem;
    flex-grow: 1;
    margin-top: 14px;
    margin-bottom: 2px;
}
.qr-container {
        display: flex;
        justify-content: center;
        margin: 20px 0;
    }
.eventsIncluded {
    font-size: 0.8rem;
    text-align: left;
    padding-left: 18px;
    position: relative;
    margin-bottom: 4px;
}

.eventsIncluded::before {
    content: "•";
    position: absolute;
    left: 0px;
    color: #AB83FE;
}

.eventsIncludedOuter {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
    padding: 10px 20px;
    margin: 10px 0;
}

.emptyPassOuter {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 300px;
}

.emptyPassInner {
    background-color: #2a2a2a;
    padding: 2rem;
    border-radius: 10px;
    text-align: center;
    color: #C7AE93;
    font-size: 1.2rem;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    max-width: 400px;
    width: 90%;
}

@media screen and (max-width: 480px) {
    .emptyPassInner {
        font-size: 1rem;
        padding: 1.5rem;
    }
}

.card-wrapper {
        height: 100%;
        width: 100%;
    }

    .loading-container {
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 60vh;
    }

    .loading-spinner {
        width: 50px;
        height: 50px;
        border: 3px solid #AB83FE;
        border-top: 3px solid transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }

    @keyframes slideUp {
    from {
        transform: translateY(600px);
        opacity: 0;
    }
    to {
        transform: translateY(0);
        opacity: 1;
    }
}

</style>

