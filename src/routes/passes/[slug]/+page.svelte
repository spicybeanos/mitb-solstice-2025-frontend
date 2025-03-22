<script lang="ts">
    import PassCard from "$lib/components/PassCard.svelte";
    import BuyPass from "$lib/components/BuyPass.svelte";
    import EventCard from '$lib/components/EventCard.svelte';
    import type { SolsticePassInfo, SolsticeEventInfo } from "$lib/server/BackendTypes";
    import type { PageData } from './$types';
    import { fade, slide, scale } from 'svelte/transition';
    import { quintOut } from 'svelte/easing';

    export let data: PageData;
    let pass: SolsticePassInfo = data.pass;
    let events: SolsticeEventInfo[] = data.events;
    const passURL = "https://payment.manipal.edu/Tech-solstice-nexus-Login";
    
</script>

<div class="outer" in:fade={{ duration: 300, delay: 150 }}>
    <div class="inner">
        <div class="container" in:slide={{ duration: 800, easing: quintOut }}>
            <PassCard>
                <div class="detailContainer" in:scale={{ duration: 600, delay: 300, start: 0.95 }}>
                    <div class="content-wrapper">
                        <h1 class="text-6xl font-bold mb-1" in:fade={{ duration: 300, delay: 500 }}>
                            {pass?.name || 'Loading...'}
                        </h1>

                        <div class="eventsIncludedOuter pt-14 pb-14" in:slide={{ duration: 500, delay: 700 }}>
                            {#if events && events.length > 0}
                                {#each events as event, i}
                                    <div 
                                        class="eventsIncluded"
                                        in:scale={{
                                            duration: 400,
                                            delay: 800 + (i * 100),
                                            start: 0.95
                                        }}
                                    >
                                        <a 
                                            href={`/events/${event.id}`}
                                            data-sveltekit-preload="hover"
                                            class="event-link"
                                        >
                                            {event.name}
                                        </a>
                                    </div>
                                {/each}
                            {:else}
                                <p>No events available</p>
                            {/if}
                        </div>

                        <div class="price" in:fade={{ duration: 300, delay: 900 }}>
                            ₹{pass?.cost || 0}
                        </div>
                        
                        <div class="button mt-2" in:scale={{ duration: 400, delay: 1000, start: 0.9 }}>
                            <BuyPass href={passURL}>
                                <div class="text">
                                    Buy Pass!
                                </div>
                            </BuyPass>
                        </div>
                    </div>
                </div>
            </PassCard>
        </div>
    </div>
</div>

<style>
    /* Layout Styles */
    .outer {
        display: flex;
        justify-content: center;
        width: 100%;
        padding: 48px;
    }

    .inner {
        display: flex;
        justify-content: center;
        max-width: 1200px;
        gap: 24px;
        perspective: 1000px;
    }

    .container {
        flex: 1;
        max-width: 800px;
        background: rgba(0, 0, 0, 0.4);
        backdrop-filter: blur(8px);
        border-radius: 12px;
    }

    /* Content Styles */
    .detailContainer {
        display: flex;
        flex-direction: column;
        align-items: center;
        padding: 2rem;
        color: #c7ae93;
        text-align: center;
    }

    .content-wrapper {
        width: 100%;
    }

    .desc {
        font-size: 1rem;
        margin: 20px 0;
    }

    /* Events Section */
    .eventsIncludedOuter {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        width: 100%;
        padding: 16px 24px;
        margin: 16px 0;
        background: rgba(171, 131, 254, 0.05);
        border: 1px solid rgba(171, 131, 254, 0.1);
        border-radius: 8px;
    }

    .eventsIncluded {
        font-size: 0.9rem;
        padding: 8px 0 8px 18px;
        position: relative;
    }

    .eventsIncluded::before {
        content: "•";
        position: absolute;
        left: 0;
        color: #ab83fe;
    }

    /* Price and Button */
    .price {
        font-size: 1.5rem;
        color: #ab83fe;
        margin: 20px 0;
    }

    .button {
        width: 100%;
        display: flex;
        justify-content: center;
        margin-top: 20px;
    }

    /* Responsive Styles */
    @media screen and (max-width: 768px) {
        .outer {
            padding: 16px;
        }

        .detailContainer {
            padding: 1rem;
        }

        .desc {
            font-size: 0.85rem;
        }

        .eventsIncludedOuter {
            padding: 12px;
            margin: 12px 0;
        }

        .price {
            font-size: 1.2rem;
        }
    }

    @media screen and (max-width: 480px) {
        .outer {
            padding: 12px;
        }

        .detailContainer {
            padding: 0.75rem;
        }

        .desc {
            font-size: 0.8rem;
        }

        .eventsIncluded {
            font-size: 0.8rem;
        }

        .price {
            font-size: 1.1rem;
        }
    }
</style>
