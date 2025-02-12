<script lang='ts'>
    import type { FalakPass } from '$lib/components/FalakPass.js';
    import { onMount } from 'svelte';
    import PassCard from '$lib/components/PassCard.svelte';
    import BuyPass from '$lib/components/BuyPass.svelte';
    import QRCode from '$lib/components/QR.svelte';
    
    let {data} = $props();
    let passes:FalakPass[] = $state([]);
    let userPassData=$state(
        null
    )
    // If the pass is bought,state must look like this:-
        // let userPassData=$state({
        //     name:"PLATINUM",
        //     uniqueString:"EFJNCFJVNFHV"
        // })

    onMount(() => {
        passes = data.passes;
    });
    
</script>

<div class="outer">
    <div class="inner ">
        {#if userPassData==null}
            {#each passes as pass}
                {#if pass.name !== undefined}
                    
                        <div class="container">
                            <PassCard>
                                <div class="detailContainer">
                                    <h1 class="text-6xl font-bold mb-2">{pass.name}</h1>
                                    <div class="desc text-sm mb-4">
                                        {pass.description}
                                    </div>
                                    <div class="price">
                                        {pass.price}
                                    </div>
                                    <div class="button mt-10">
                                        <BuyPass href={`https://payment.manipal.edu/bangalore-campus`} >
                                            <div class="text">Buy Pass!</div>
                                        </BuyPass>  
                                    </div>
                                </div>
                            </PassCard>
                        </div>
                    
                {/if}
            {/each}
            {:else}
            <div class="outer">
                <div class="inner">
                    <div class="">
                        <PassCard>
                            <div class="detailContainer">
                                <h1 class="text-6xl font-bold mb-6">{userPassData.name}</h1>
                                <div class="uniqueString text-sm ">
                                    Unique Id: {userPassData.uniqueString}
                                </div>
                                <div class="qr-container">
                                    <QRCode text={userPassData.uniqueString} />
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
    padding-bottom: 20px;
    
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
    margin-top: 48px;
    margin-bottom: 12px;
}
.qr-container {
        display: flex;
        justify-content: center;
        margin: 20px 0;
    }
</style>
