<script lang="ts">
    import type { FalakPass } from "$lib/components/FalakPass.js";
    import { onMount } from "svelte";
    import PassCard from "$lib/components/PassCard.svelte";
    import BuyPass from "$lib/components/BuyPass.svelte";
    import QRCode from "$lib/components/QR.svelte";
    import type { SolsticePassInfo } from "$lib/server/BackendTypes.ts";
    import type { EventInAllPasses } from "./+page.server.ts";
    import { fade, slide, scale } from "svelte/transition";
    import { cubicOut, quintOut } from "svelte/easing";

    /* 
        <div class="button mt-2">
            <BuyPass href={passURL}>
                <div class="text">Buy Pass!</div>
            </BuyPass>
        </div>
    */

    let { data } = $props();
    let nonmahe_pass_list = [
        "Robotics",
        "Technical",
        "Finance",
        "All Access",
        "non-mahe",
        "e-Sports",
    ];
    // last element for demo purposes

    let passURL = $state("https://payment.manipal.edu/Tech-solstice-nexus-Login");

    let loading = $state(true);
    let SolsticeAllPassInfo: SolsticePassInfo[] | null = $state([]);

    let userPassInfo: SolsticePassInfo | null = $state(null);

    onMount(async () => {
        await new Promise((resolve) => setTimeout(resolve, 100));
        SolsticeAllPassInfo = data.SolsticeAllPassInfo;

        SolsticeAllPassInfo?.sort((a, b) => {
            return a.name.localeCompare(b.name);
        });
        if(!data.loggedIn){
            passURL='/profile'
        }
        userPassInfo = data.userPassInfo;
        loading = false;
    });

    /*
    {#if EventsInAllPasses !== null}
                                    {#each EventsInAllPasses as event}
                                        {#if event.passId === pass.id}
                                            <div class="eventsIncluded">
                                                <a href={`/events/${event.id}`}
                                                    >{event.name}</a
                                                >
                                            </div>
                                        {/if}
                                    {/each}
                                {/if}
    */
</script>

{#snippet passCardInfo(i: number, pass: SolsticePassInfo)}
    <div
        class="container"
        style="--index:{i}"
        in:slide={{
            delay: i * 200,
            duration: 1000,
            easing: quintOut,
            axis: "y",
        }}
        out:fade|global={{
            duration: 300,
        }}
    >
        <div
            class="card-wrapper"
            in:scale|global={{
                delay: i * 200,
                duration: 800,
                start: 0.95,
                opacity: 0,
            }}
        >
            <div
                class="card-wrapper"
                in:scale|global={{
                    delay: i * 200,
                    duration: 800,
                    start: 0.95,
                    opacity: 0,
                }}
            >
                <PassCard>
                    <div class="detailContainer">
                        <div class="content-wrapper">
                            <h1 class="text-6xl font-bold mb-1">{pass.name}</h1>
                            <div class="desc text-sm mb-1">
                                {pass.description}
                            </div>

                            <div class="eventsIncludedOuter"></div>

                            <div class="price">
                                {pass.cost}
                            </div>
                            <div class="button mt-2">
                                <BuyPass href={passURL}>
                                    <div class="text">Buy Pass!</div>
                                </BuyPass>
                            </div>
                        </div>
                    </div>
                </PassCard>
            </div>
        </div>
    </div>
{/snippet}

{#if !loading}
    <div class="text-4xl font-akira text-white p-15">MAHE passes</div>
    <div class="outer" in:fade={{ duration: 300, delay: 150 }}>
        <div class="inner">
            {#if userPassInfo == null}
                {#if SolsticeAllPassInfo !== null}
                    {#each SolsticeAllPassInfo as pass, i}
                        {#if pass.name.startsWith("MAHE")}
                            {#if pass.name !== undefined && pass.id !='9iiwEUtZSz2052dd6S0wzw' && pass.id != 'ALryBwdJS-yJm1zosXzUHQ'}
                                {@render passCardInfo(i, pass)}
                            {/if}
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
                <div
                    class="container single-container"
                    in:fade={{ duration: 300 }}
                >
                    <PassCard>
                        <div class="detailContainer single-pass-container">
                            <div class="content-wrapper">
                                <h1 class="text-4xl font-bold mb-4">
                                    Your Pass
                                </h1>
                                <div class="info-box">
                                    <div class="pass-info">
                                        <h2 class="pass-name">
                                            {userPassInfo.name}
                                        </h2>
                                        <div class="uniqueString">
                                            Unique Id: <span class="id-text"
                                                >{userPassInfo.id}</span
                                            >
                                        </div>
                                    </div>
                                    <div class="qr-wrapper">
                                        <QRCode text={userPassInfo.id} />
                                    </div>
                                    <div class="button-wrapper">
                                        <BuyPass href="/events">
                                            <div class="text">View Events</div>
                                        </BuyPass>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </PassCard>
                </div>
            {/if}
        </div>
    </div>

    <div class="text-4xl font-akira text-white p-15">non-MAHE passes</div>
    <div class="outer" in:fade={{ duration: 300, delay: 150 }}>
        <div class="inner">
            {#if userPassInfo == null}
                {#if SolsticeAllPassInfo !== null}
                    {#each SolsticeAllPassInfo as pass, i}
                        {#if !pass.name.startsWith("MAHE")}
                            {#if pass.name !== undefined && pass.id != 'Pi036rnfQni-tknGiM4qQg'}
                                {@render passCardInfo(i, pass)}
                            {/if}
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
                <div
                    class="container single-container"
                    in:fade={{ duration: 300 }}
                >
                    <PassCard>
                        <div class="detailContainer single-pass-container">
                            <div class="content-wrapper">
                                <h1 class="text-4xl font-bold mb-4">
                                    Your Pass
                                </h1>
                                <div class="info-box">
                                    <div class="pass-info">
                                        <h2 class="pass-name">
                                            {userPassInfo.name}
                                        </h2>
                                        <div class="uniqueString">
                                            Unique Id: <span class="id-text"
                                                >{userPassInfo.id}</span
                                            >
                                        </div>
                                    </div>
                                    <div class="qr-wrapper">
                                        <QRCode text={userPassInfo.id} />
                                    </div>
                                    <div class="button-wrapper">
                                        <BuyPass href="/events">
                                            <div class="text">View Events</div>
                                        </BuyPass>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </PassCard>
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
        /* background-color: #1e1e1e; */
    }

    .inner {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: flex-start;
        max-width: 1600px;
        gap: 24px;
        perspective: 1000px;
        transform-style: preserve-3d;
        backface-visibility: hidden;
    }

    /* display: flex;
    justify-content: center;
    flex-wrap: wrap;
    align-items: center;
    width: 100%;
    padding: 48px; */

    .inner {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: flex-start;
        max-width: 1600px;
        gap: 24px;
        perspective: 1000px;
        transform-style: preserve-3d;
        backface-visibility: hidden;
    }

    .container {
        flex: 0 1 calc(33.333% - 20px);
        max-width: 33%;
        min-width: 300px;
        box-sizing: border-box;
        max-height: fit-content;
        margin-bottom: 10px;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        word-wrap: break-word;
        overflow-wrap: break-word;
        transform-origin: center;
        will-change: transform, opacity;
        background: rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(8px);
    }

    .desc {
        flex-grow: 1;
        text-align: center;
        font-size: 1rem;
        margin-bottom: 32px;
        margin-top: 20px;
    }
    .uniqueString {
        color: #ab83fe;
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
        margin-top: auto;
    }

    .text {
        color: #000000;
    }

    .detailContainer h1 {
        font-size: 2.5rem;
        margin-top: -10px;
        font-weight: 800;
        line-height: 1.1;
        padding-bottom: 16px;
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
        color: #c7ae93;
        text-align: center;
        flex-grow: 1;
        height: 100%;
        min-height: 100%;
        padding-bottom: 1rem;
    }

    @media screen and (max-width: 1024px) {
        .container {
            flex: 0 1 calc(33.333% - 20px);
            max-width: 33%;
            min-width: 300px;
            box-sizing: border-box;
            max-height: fit-content;
            margin-bottom: 10px;
            display: flex;
            flex-direction: column;
            align-items: stretch;
            word-wrap: break-word;
            overflow-wrap: break-word;
            transform-origin: center;
            will-change: transform, opacity;
        }

        .desc {
            flex-grow: 1;
            text-align: center;
            font-size: 1rem;
            margin-bottom: 32px;
            margin-top: 20px;
        }
        .uniqueString {
            color: #ab83fe;
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
            margin-top: auto;
        }

        .text {
            color: #000000;
        }

        .detailContainer h1 {
            font-size: 2.5rem;
            margin-top: -10px;
            font-weight: 800;
            line-height: 1.1;
            padding-bottom: 16px;
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
            color: #c7ae93;
            text-align: center;
            flex-grow: 1;
            height: 100%;
            min-height: 100%;
            padding-bottom: 1rem;
        }
        .container {
            flex: 0 1 calc(50% - 20px);
            max-width: 48%;
        }

        .desc {
            flex-grow: 1;
            text-align: center;
            font-size: 1rem;
            margin-bottom: 32px;
            margin-top: 20px;
        }
        .uniqueString {
            color: #ab83fe;
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

        .text {
            color: #000000;
        }

        .detailContainer h1 {
            font-size: 2.5rem;
            margin-top: -10px;
            font-weight: 800;
            line-height: 1.1;
            padding-bottom: 16px;
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
            color: #c7ae93;
            text-align: center;
            flex-grow: 1;
            height: 100%;
        }
    }
    @media screen and (max-width: 768px) {
        .container {
            flex: 1 1 100%;
            max-width: 100%;
            margin-bottom: 16px;
        }
        .detailContainer h1 {
            font-size: 1.6rem;
            margin: 0 0 8px 0;
        }
        .desc {
            font-size: 0.85rem;
            margin: 8px 0;
            line-height: 1.3;
        }
        .single-container {
            max-width: 320px;
        }

        .single-pass-container {
            padding: 0.75rem;
        }

        .pass-info {
            padding: 0.25rem;
            width: 80%;
        }

        .pass-name {
            font-size: 1rem;
        }

        .qr-wrapper {
            width: 80%;
            padding: 0.75rem;
            max-width: 180px;
        }
        .info-box {
            padding: 0.25rem;
        }
        .eventsIncludedOuter {
            min-height: 100px;
        }

        .detailContainer {
            padding: 1rem;
            min-height: auto;
        }
        .eventsIncludedOuter {
            min-height: auto;
            padding: 12px;
            margin: 12px -12px;
        }
        .eventsIncluded {
            padding: 6px 12px;
            margin-bottom: 4px;
        }
        .price {
            margin: 12px 0;
            padding: 6px 12px;
        }
        .button {
            margin-top: 12px;
        }
    }

    @media screen and (max-width: 480px) {
        .inner {
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
        .emptyPassInner {
            background-color: rgba(42, 42, 42, 0.6);
            padding: 2rem;
            border-radius: 10px;
            text-align: center;
            color: #c7ae93;
            font-size: 1.2rem;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            max-width: 400px;
            width: 90%;
            backdrop-filter: blur(4px);
        }

        .emptyPassInner {
            font-size: 1rem;
            padding: 1.5rem;
        }

        .card-wrapper {
            height: 100%;
            width: 100%;
        }

        .single-container {
            max-width: 400px;
        }

        .single-pass-container {
            padding: 1rem;
        }

        .pass-info {
            padding: 0.5rem;
        }

        .qr-wrapper {
            width: 60%;
            padding: clamp(0.5rem, 2vw, 1rem);
            margin: 1rem auto;
            max-width: 160px;
        }

        .uniqueString {
            font-size: 0.8rem;
        }

        .id-text {
            font-size: 0.75rem;
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
    }
    .detailContainer {
        padding: 0.75rem;
    }
    .detailContainer h1 {
        font-size: 1.4rem;
    }
    .desc {
        font-size: 0.8rem;
        margin: 6px 0;
    }
    .eventsIncludedOuter {
        padding: 10px;
        margin: 10px -10px;
    }
    .eventsIncluded {
        padding: 4px 10px;
        margin-bottom: 3px;
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
        border: 3px solid #ab83fe;
        border-top: 3px solid transparent;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }
    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }

    .price {
        text-align: center;
        font-size: 0.9rem;
        flex-grow: 1;
        margin-top: 14px;
        margin-bottom: 2px;
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
        color: #ab83fe;
    }

    .eventsIncludedOuter {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
        height: 200px; /* Fixed height */
        max-width: 280px; /* Fixed width */
        margin: 16px auto; /* Center horizontally */
        padding: 16px 24px;
        background: rgba(171, 131, 254, 0.05);
        border: 1px solid rgba(171, 131, 254, 0.1);
        border-radius: 8px;
        overflow-y: auto; /* Add scroll for overflow content */
    }

    /* Add custom scrollbar styling */
    .eventsIncludedOuter::-webkit-scrollbar {
        width: 6px;
    }

    .eventsIncludedOuter::-webkit-scrollbar-track {
        background: rgba(171, 131, 254, 0.05);
    }

    .eventsIncludedOuter::-webkit-scrollbar-thumb {
        background: rgba(171, 131, 254, 0.2);
        border-radius: 3px;
    }

    /* Responsive adjustments */
    @media screen and (max-width: 768px) {
        .eventsIncludedOuter {
            height: 150px;
            max-width: 240px;
            padding: 12px 20px;
            margin: 12px auto;
        }
    }

    @media screen and (max-width: 480px) {
        .eventsIncludedOuter {
            height: 200px;
            min-width: 200px;
            padding: 10px 16px;
            margin: 10px auto;
        }
    }

    .emptyPassOuter {
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        min-height: 300px;
    }

    .emptyPassInner {
        background-color: rgba(42, 42, 42, 0.6);
        padding: 2rem;
        border-radius: 10px;
        text-align: center;
        color: #c7ae93;
        font-size: 1.2rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        max-width: 400px;
        width: 90%;
        backdrop-filter: blur(4px);
    }

    .single-container {
        flex: 0 1 100%;
        max-width: 1000px;
        min-width: 280px;
        margin: 0 auto;
        animation: none;
        transform: none;
        opacity: 1;
        min-height: 0;
        padding: 0.5rem;
    }

    /* Pass Container Layout */
    .single-pass-container {
        padding: 0.75rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
    }

    /* Info Box Styles */
    .info-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 100%;
        gap: 0.5rem;
        padding: 0.5rem;
    }

    /* Pass Info Section */
    .pass-info {
        text-align: center;
        width: 107%;
        padding: 0.75rem;
        background: rgba(171, 131, 254, 0.05);
        border-radius: 0px;
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        backdrop-filter: blur(4px);
    }

    /* Typography */
    .pass-name {
        font-size: 1.5rem;
        color: #ab83fe;
        font-weight: 600;
        line-height: 1.1;
        margin-bottom: 0.25rem;
    }

    .uniqueString {
        color: #c7ae93;
        font-size: 0.85rem;
        word-break: break-all;
        line-height: 1.2;
        margin: 0px;
    }

    .id-text {
        color: #ab83fe;
        font-family: monospace;
        font-size: 0.85rem;
        background: rgba(171, 131, 254, 0.05);
        padding: 0.25px 0.5rem;
        border-radius: 6px;
        display: inline-block;
        margin-top: 0.1rem;
    }

    /* QR Code Wrapper */
    .qr-wrapper {
        padding: 0.75rem;
        border-radius: 0px;
        box-shadow: 4px 4px 8px #ffc089;
        width: 100%;
        max-width: 250px;
        aspect-ratio: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0.5rem auto;
        overflow: hidden;
        background-color: white;
        position: relative;
    }

    .qr-wrapper :global(canvas) {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 90% !important; /* Slightly smaller than container */
        height: 90% !important;
        max-width: none !important;
        object-fit: contain;
    }

    /* Button Wrapper */
    .button-wrapper {
        margin-top: auto;
        width: 100%;
        max-width: 400px;
        margin-top: 1rem;
        display: flex;
        justify-content: center;
    }

    /* Update the mobile styles in the <style> section */

    @media screen and (max-width: 768px) {
        .outer {
            padding: 16px;
        }

        .container {
            flex: 1 1 100%;
            max-width: 100%;
            min-height: auto;
            margin-bottom: 16px;
        }

        .detailContainer {
            padding: 1rem;
            min-height: auto;
        }

        .detailContainer h1 {
            font-size: 1.6rem;
            margin: 0 0 8px 0;
        }

        .desc {
            font-size: 0.85rem;
            margin: 8px 0;
            line-height: 1.3;
        }

        .eventsIncludedOuter {
            min-height: auto;
            padding: 12px;
            margin: 12px -12px;
        }

        .eventsIncluded {
            padding: 6px 12px;
            margin-bottom: 4px;
        }

        .price {
            margin: 12px 0;
            padding: 6px 12px;
        }

        .button {
            margin-top: 12px;
        }

        /* Single Pass Container Improvements */
        .single-container {
            max-width: 100%;
            padding: 16px;
        }

        .single-pass-container {
            padding: 1.25rem;
        }

        .info-box {
            gap: 1rem;
            padding: 0.75rem;
        }

        .pass-info {
            width: 100%;
            padding: 1rem;
            border-radius: 8px;
            background: rgba(171, 131, 254, 0.08);
        }

        .pass-name {
            font-size: 1.4rem;
            margin-bottom: 0.5rem;
        }

        .uniqueString {
            font-size: 0.8rem;
            padding: 8px;
            background: rgba(0, 0, 0, 0.2);
            border-radius: 4px;
            margin: 8px 0;
        }

        .qr-wrapper {
            width: 80%;
            max-width: 200px;
            margin: 1rem auto;
            padding: 0.5rem;
            box-shadow: 0 0 16px rgba(171, 131, 254, 0.2);
        }

        .button-wrapper {
            width: 100%;
            padding: 0 16px;
            margin-top: 1.5rem;
        }

        /* Loading State Improvements */
        .loading-container {
            min-height: 40vh;
        }

        .loading-spinner {
            width: 40px;
            height: 40px;
            border-width: 2px;
        }

        /* Empty State Improvements */
        .emptyPassOuter {
            min-height: 200px;
            padding: 16px;
        }

        .emptyPassInner {
            padding: 1.5rem;
            font-size: 1rem;
            line-height: 1.4;
            background: rgba(171, 131, 254, 0.05);
            border: 1px solid rgba(171, 131, 254, 0.1);
        }
    }

    /* Additional improvements for very small screens */
    @media screen and (max-width: 480px) {
        .outer {
            padding: 12px;
        }

        .inner {
            gap: 16px;
        }

        .detailContainer h1 {
            font-size: 1.6rem;
        }

        .desc {
            font-size: 0.85rem;
        }

        .eventsIncludedOuter {
            min-width: calc(100% + 24px);
            margin: 16px -12px;
            padding: 12px;
        }

        .eventsIncluded {
            padding: 6px 12px;
        }

        .price {
            font-size: 1.1rem;
            padding: 6px 12px;
        }

        .qr-wrapper {
            width: 70%;
            max-width: 180px;
        }

        .pass-name {
            font-size: 1.2rem;
        }

        .uniqueString {
            font-size: 0.75rem;
        }

        .button {
            margin-top: 12px;
        }
    }
</style>
