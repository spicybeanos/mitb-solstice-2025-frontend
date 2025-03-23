<script lang="ts">
    import EventCard from "./EventCard.svelte";
    import { onMount } from "svelte";
    import { browser } from '$app/environment';
    import { tweened } from 'svelte/motion';
    import { cubicOut } from 'svelte/easing';

    interface CarouselProps {
        feature: Array<any>;
        medias: Array<any>;
    }

    let { data } = $props<{ data: CarouselProps }>();
    let currentIndex = $state(0);
    let autoplayInterval: ReturnType<typeof setInterval>;
    let isPaused = $state(false);
    let manualScrollTimeout: ReturnType<typeof setTimeout>;
    let features = $state([]);
    let expandedPanel = $state(0);
    let isDesktopMedium = $state(false);
    let isRendered = $state(false);

    $effect(() => {
        features = data?.feature || [];
    });

    function handleDotClick(index: number) {
        isPaused = true;
        currentIndex = index;
        resetAutoplayTimeout();
    }

    function resetAutoplayTimeout() {
        clearTimeout(manualScrollTimeout);
        manualScrollTimeout = setTimeout(() => {
            isPaused = false;
        }, 4000);
    }

    function startAutoplay() {
        if (autoplayInterval) clearInterval(autoplayInterval);
        autoplayInterval = setInterval(() => {
            if (!isPaused) {
                currentIndex = (currentIndex + 1) % features.length;
            }
        }, 4000);
    }

    onMount(() => {
        if (browser) {
            setTimeout(() => {
                isRendered = true;
            }, 100);
            startAutoplay();
            return () => {
                clearTimeout(manualScrollTimeout);
                clearInterval(autoplayInterval);
            };
        }
        const mediaQuery = window.matchMedia('(min-width: 768px)');
        isDesktopMedium = mediaQuery.matches;
        
        const handleResize = () => {
            isDesktopMedium = mediaQuery.matches;
        };
        
        mediaQuery.addEventListener('change', handleResize);
        return () => mediaQuery.removeEventListener('change', handleResize);
    });

    function handleMouseEnter(index: number) {
        isPaused = true;
        clearTimeout(manualScrollTimeout);
        expandedPanel = index;
    }
</script>

<div class="relative w-full my-12 sm:my-20 z-20">
    <!-- Mobile Carousel -->
    <div class="sm:hidden w-full px-4">
        <div class="relative w-full {isRendered ? 'animate-fadeIn' : 'opacity-0'}">
            <div class="w-full aspect-[4/5] overflow-hidden rounded-lg">
                <div class="relative w-full h-full">
                    {#each features as feature, i (feature.id)}
                        <div 
                            class="absolute w-full h-full transition-all duration-500 ease-out"
                            style="
                                transform: translateX({(i - currentIndex) * 100}%);
                                opacity: {Math.abs(i - currentIndex) <= 1 ? 1 : 0};
                                pointer-events: {i === currentIndex ? 'auto' : 'none'};
                                z-index: {i === currentIndex ? 1 : 0};
                            "
                        >
                            <EventCard 
                                event={feature} 
                                i={i} 
                                thumbnail={data.medias.result[i].thumbnail}
                            />
                        </div>
                    {/each}
                </div>
            </div>

            <div class="absolute -bottom-6 left-1/2 -translate-x-1/2 flex gap-2 p-1">
                {#each features as _, i (i)}
                    <button 
                        class="w-1.5 h-1.5 rounded-full transition-all duration-300 ease-out {
                            i === currentIndex 
                                ? 'bg-[#AB83FE] scale-110 shadow-lg shadow-[#AB83FE]/50' 
                                : 'bg-[#AB83FE]/20 hover:bg-[#AB83FE]/40'
                        }"
                        onclick={() => handleDotClick(i)}
                        aria-label={`Go to slide ${i + 1}`}
                        aria-current={i === currentIndex ? 'true' : 'false'}
                    />
                {/each}
            </div>
        </div>
    </div>

    <!-- Desktop Accordion -->
    <div class="hidden sm:flex flex-1 space-x-3 overflow-x-auto py-2 scrollbar-hide min-h-[600px] justify-center">
        {#each features as feature, i (feature.id)}
            <div 
                class="relative rounded-xl backdrop-blur-sm overflow-hidden transition-all duration-300 ease-out h-[550px]"
                class:panel-expanded={expandedPanel === i}
                class:panel-collapsed={expandedPanel !== i}
                style="width: {expandedPanel === i ? (isDesktopMedium ? '563px' : '575px') : (isDesktopMedium ? '70px' : '100px')};"
                onmouseenter={() => handleMouseEnter(i)}
            >
                <div class="absolute inset-0 -z-10 rounded-xl overflow-hidden">
                    <div 
                        class="absolute top-0 left-0 w-full h-full bg-cover bg-center bg-no-repeat transition-all duration-1000 ease-out"
                        class:scale-120={expandedPanel === i}
                        class:scale-100={expandedPanel !== i}
                        style="opacity: {expandedPanel === i ? 0.4 : 0.2};"
                    />
                    <div class="absolute inset-0 bg-gradient-to-br from-black/60 to-black/20 -z-5" />
                </div>

                <div 
                    class="absolute z-10 pointer-events-none"
                    class:title-expanded={expandedPanel === i}
                    class:title-collapsed={expandedPanel !== i}
                >
                    <span class="text-xl text-cyan-500 font-mono font-semibold tracking-wide text-gray-200 whitespace-nowrap" 
                          style="text-shadow: 0 0 10px rgba(0, 255, 255, 0.8);">
                        {feature.name}
                    </span>
                </div>

                {#if expandedPanel === i}
                    <div 
                        class="absolute inset-0 w-full transition-all duration-600 h-full flex items-center justify-center"
                        in:fade={{ duration: 600, easing: cubicOut }}
                    >
                        <div class="w-[90%] h-[90%] flex items-center justify-center transform-gpu">
                            <div 
                                class="w-full h-full transition-all duration-500 ease-out"
                                in:scale={{
                                    duration: 500,
                                    delay: 100,
                                    start: 0.95,
                                    opacity: 0,
                                    easing: cubicOut
                                }}
                            >
                                <EventCard 
                                    event={feature} 
                                    i={i} 
                                    thumbnail={data.medias.result[i].thumbnail}
                                />
                            </div>
                        </div>
                    </div>
                {/if}
            </div>
        {/each}
    </div>
</div>

<style>
    .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }

    .panel-collapsed {
        background-color: rgba(31, 41, 55, 0.2);
        border: 1px solid rgba(31, 41, 55, 0.5);
        min-width: 4rem;
    }

    .panel-expanded {
        background-color: rgba(16, 21, 29, 0.2);
        border: 1px solid rgba(55, 65, 81, 1);
        min-width: 4rem;
        display: flex;
        align-items: center;
        justify-content: center;
        transform-style: preserve-3d;
        perspective: 1000px;
        will-change: transform;
    }

    .title-collapsed {
        top: 15rem;
        left: 2rem;
        width: 25rem;
        transform-origin: center;
        transform: translate(-50%, -50%) rotate(90deg);
        opacity: 0.8;
    }

    .title-expanded {
        top: 15rem;
        left: 2rem;
        width: 25rem;
        transform-origin: center;
        transform: translate(-50%, -50%) rotate(90deg);
    }

    .scale-120 { transform: scale(1.2); }
    .scale-100 { transform: scale(1); }

    .transform-gpu {
        transform: translateZ(0);
        backface-visibility: hidden;
        perspective: 1000px;
    }

    .animate-fadeIn {
        animation: fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }

    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(20px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
</style>