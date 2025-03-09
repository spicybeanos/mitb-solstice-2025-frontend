<script lang="ts">
    import EventCard from "./EventCard.svelte";
    import { onMount } from "svelte";
    import { browser } from '$app/environment';
    
    interface CarouselProps {
        feature: Array<any>; // Replace 'any' with your actual event type
        medias: Array<any>;
    }

    let { data } = $props<{ data: CarouselProps }>();
    let currentIndex = $state(0);
    let autoplayInterval: ReturnType<typeof setInterval>;
    let isPaused = $state(false);
    let scrollPosition = $state(0);
    const SCROLL_SPEED = 0.8; // Adjusted for smoother movement
    let sliderPosition = $state(0);
    let animationFrame: number;
    let scrollWidth = 10;
    let containerRef: HTMLDivElement;
    let isManualScrolling = false;
    let manualScrollTimeout: ReturnType<typeof setTimeout>;
    let direction = $state(1); // 1 for forward, -1 for backward

    // Add null check for data.feature
    let features = $state([]);
    $effect(() => {
        features = data?.feature || [];
    });
    
    function nextSlide() {
        // Allow wrapping to first card
        currentIndex = (currentIndex + 1) % features.length;
    }

    function prevSlide() {
        // Allow wrapping to last card
        currentIndex = currentIndex <= 0 ? features.length - 1 : currentIndex - 1;
    }

    function handleClick(type: 'next' | 'prev') {
        if (type === 'next') {
            nextSlide();
        } else {
            prevSlide();
        }
        handleMouseEnter()
        setTimeout(()=>handleDelayedResume(),5000)
    }

    function handleDotClick(index: number) {
        currentIndex = index;
    }

    // Auto-rotation function
    function startAutoplay() {
        autoplayInterval = setInterval(() => {
            if (!isPaused) {
                if (currentIndex < data.feature.length - 1) {
                    currentIndex++;
                } else {
                    // Smooth reset to beginning
                    currentIndex = 0;
                }
            }
        }, 4000); // Change slide every 3 seconds
    }

    const ANIMATION_SPEED = 0.25; // Controls the speed of animation (smaller = slower)
    let currentTranslate = $state(0);

    function updateScroll() {
        if (!isPaused && browser && !isManualScrolling) {
            currentTranslate -= (ANIMATION_SPEED * direction);
            
            // Reverse direction at the ends
            const maxTranslate = -(features.length * 100);
            if (currentTranslate <= maxTranslate) {
                direction = -1; // reverse direction
                currentTranslate = maxTranslate;
            } else if (currentTranslate >= 0) {
                direction = 1; // forward direction
                currentTranslate = 0;
            }
        }
        animationFrame = requestAnimationFrame(updateScroll);
    }

    // function updateDesktopScroll() {
    //     if (!isPaused && browser && containerRef) {
    //         currentTranslate -= SCROLL_SPEED;
    //         // Wrap around logic
    //         if (currentTranslate <= -100) {
    //             currentTranslate = 0;
    //         }
    //         // Update slider position
    //         sliderPosition = Math.abs(currentTranslate);
    //     }
    //     animationFrame = requestAnimationFrame(updateDesktopScroll);
    // }

    // function handleScroll() {
    //     if (containerRef) {
    //         isManualScrolling = true;
    //         scrollPosition = containerRef.scrollLeft;
            
    //         // Reset manual scrolling flag after user stops scrolling
    //         clearTimeout(manualScrollTimeout);
    //         manualScrollTimeout = setTimeout(() => {
    //             isManualScrolling = false;
    //         }, 1000);
    //     }
    // }

    // Start autoplay when component mounts
    onMount(() => {
        if (browser) {
            startAutoplay();
            animationFrame = requestAnimationFrame(updateScroll);
            return () => {
                clearInterval(autoplayInterval);
                cancelAnimationFrame(animationFrame);
            };
        }
    });

    $effect(() => {
        if (browser && containerRef) {
            scrollWidth = containerRef.scrollWidth;
        }
    });

    function handleMouseEnter() {
        isPaused = true;
        // Clear any existing timeouts to prevent resume
        clearTimeout(manualScrollTimeout);
    }

    function handleDelayedResume() {
        // Clear any existing timeouts
        clearTimeout(manualScrollTimeout);
        // Set new timeout for resuming
        manualScrollTimeout = setTimeout(() => {
            isPaused = false;
        }, 1000); // 1 second delay before resuming
    }

    // // Add manual scroll handling
    // function handleManualScroll(event: WheelEvent) {
    //     if (containerRef) {
    //         isPaused = true;
    //         const delta = event.deltaX || event.deltaY;
    //         currentTranslate -= delta * 0.5; // Adjust sensitivity
            
    //         // Reset pause timeout
    //         clearTimeout(manualScrollTimeout);
    //         manualScrollTimeout = setTimeout(() => {
    //             isPaused = false;
    //         }, 3000);
    //     }
    // }

    function handleSliderChange(event: Event) {
        const target = event.target as HTMLInputElement;
        const newPosition = -Number(target.value);
        
        // Update direction based on slider movement
        direction = newPosition < currentTranslate ? 1 : -1;
        currentTranslate = newPosition;
        
        isPaused = true;
        clearTimeout(manualScrollTimeout);
        manualScrollTimeout = setTimeout(() => {
            isPaused = false;
        }, 4000);
    }
</script>

<div class="relative w-full my-12 sm:my-20 z-20">
    <!-- Mobile Carousel - Remove hover handlers -->
    <div class="sm:hidden w-full px-4">
        <div class="relative w-full">
            <div class="w-full aspect-[4/5] overflow-hidden">
                <div class="flex relative">
                    {#each features as item, i}
                        <div 
                            class="absolute w-full transition-all duration-500 ease-in-out"
                            style="
                                transform: translateX({((i - currentIndex + features.length) % features.length - 1) * 100}%);
                                opacity: {Math.abs(((i - currentIndex + features.length) % features.length) - 1) < 2 ? 1 : 0}
                            "
                        >
                            <EventCard 
                                event={item} 
                                i={i} 
                                thumbnail={data.medias.success?data.medias.result[i].thumbnail:`/thumbnail/${item.id}.jpg`}
                            />
                        </div>
                    {/each}
                </div>
            </div>

            <!-- Update navigation buttons - remove disabled state -->
            <button 
                class="absolute left-2 top-1/2 p-2 rounded-full bg-black/30 backdrop-blur-sm border border-[#AB83FE]/30 text-[#AB83FE] z-10 transform -translate-y-1/2 transition-opacity duration-300"
                onclick={() => handleClick('prev')}
                aria-label="Previous slide"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
            </button>

            <button 
                class="absolute right-2 top-1/2 p-2 rounded-full bg-black/30 backdrop-blur-sm border border-[#AB83FE]/30 text-[#AB83FE] z-10 transform -translate-y-1/2 transition-opacity duration-300"
                onclick={() => handleClick('next')}
                aria-label="Next slide"
            >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
            </button>

            <!-- Dots Indicator -->
            <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                {#each features as _, i}
                    <button 
                        class={`w-2 h-2 rounded-full transition-colors duration-200 ${i === currentIndex ? 'bg-[#AB83FE]' : 'bg-[#AB83FE]/30'}`}
                        onclick={() => handleDotClick(i)}
                        aria-label={`Go to slide ${i + 1}`}></button>
                {/each}
            </div>
        </div>
    </div>

    <!-- Update the desktop carousel section -->
    <div class="hidden sm:block relative overflow-hidden">
        <div 
            class="desktop-carousel w-full relative py-8"
            bind:this={containerRef}
        >
            <div 
                class="flex transition-transform duration-1000 ease-linear will-change-transform"
                style="transform: translateX({currentTranslate}%)"
                onmouseenter={handleMouseEnter}
                onmouseleave={handleDelayedResume}
            >
                {#each [...features, ...features, ...features] as item, i}
                    <div 
                        class="w-[360px] flex-shrink-0 mx-12 aspect-[5/7] shadow-lg rounded-lg hover:scale-105 transition-transform duration-300"
                        onmouseenter={handleMouseEnter}
                        onmouseleave={handleDelayedResume}
                    >
                        <EventCard 
                            event={item} 
                            i={i % features.length} 
                            thumbnail={data.medias.result[i].thumbnail}
                        />
                    </div>
                {/each}
            </div>
        </div>

        <!-- Update the slider container -->
        <div 
            class="absolute bottom-0 left-0 w-full px-8 py-4"
            onmouseenter={handleMouseEnter}
            onmouseleave={handleDelayedResume}
        >
            <input 
                type="range"
                min="0"
                max="100"
                step="0.1"
                value={Math.abs(currentTranslate)}
                onchange={handleSliderChange}
                oninput={handleSliderChange}
                class="slider w-full"
            />
        </div>
    </div>
</div>

<style>
    button {
        transition: opacity 0.3s ease, background-color 0.3s ease;
    }

    button:hover:not(:disabled) {
        background-color: rgba(171, 131, 254, 0.2);
    }

    button:active:not(:disabled) {
        background-color: rgba(171, 131, 254, 0.3);
    }

    button:disabled {
        cursor: not-allowed;
    }

    /* Optional: Add touch support for mobile swipe */
    @media (pointer: coarse) {
        .carousel {
            touch-action: pan-y pinch-zoom;
        }
    }

    /* Smooth transitions */
    .transition-transform {
        transition: transform 1500ms linear;
    }

    /* Improve button transitions */
    button {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Hide scrollbar but allow scrolling */
    .scrollbar-hide {
        -ms-overflow-style: none;
        scrollbar-width: none;
    }

    .scrollbar-hide::-webkit-scrollbar {
        display: none;
    }

    /* Smooth card transitions */
    .carousel-card {
        transition: opacity 0.5s ease-in-out;
    }

    /* Add to existing styles */
    .desktop-carousel {
        overflow: visible;
        cursor: grab;
    }

    .desktop-carousel:active {
        cursor: grabbing;
    }

    /* Smooth scroll animation */
    @keyframes scroll {
        0% {
            transform: translateX(0);
        }
        100% {
            transform: translateX(-50%);
        }
    }

    /* Hover effect for scrollbar */
    .bg-ab83fe-10:hover {
        background-color: rgba(171, 131, 254, 0.2);
    }

    .bg-ab83fe-40:hover {
        background-color: rgba(171, 131, 254, 0.6);
    }

    /* Custom slider styling */
    .slider {
        -webkit-appearance: none;
        height: 2px;
        background: rgba(171, 131, 254, 0.1);
        outline: none;
        transition: all 0.3s ease;
    }

    .slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #AB83FE;
        cursor: pointer;
        transition: all 0.3s ease;
    }

    .slider::-moz-range-thumb {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        background: #AB83FE;
        cursor: pointer;
        transition: all 0.3s ease;
        border: none;
    }

    .slider:hover::-webkit-slider-thumb {
        transform: scale(1.2);
        background: rgba(171, 131, 254, 0.8);
    }

    .slider:hover::-moz-range-thumb {
        transform: scale(1.2);
        background: rgba(171, 131, 254, 0.8);
    }

    /* Add hardware acceleration for smoother animations */
    .will-change-transform {
        will-change: transform;
        -webkit-backface-visibility: hidden;
        backface-visibility: hidden;
    }

    /* Add to your style section */
    .flex.relative {
        transform-style: preserve-3d;
        perspective: 1000px;
    }

    .transition-all {
        transition-property: all;
        transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
</style>