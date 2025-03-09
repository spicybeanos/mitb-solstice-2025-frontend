<script lang="ts">
    import EventCard from "./EventCard.svelte";
    import { onMount } from "svelte";
    import { browser } from '$app/environment';
    
    interface CarouselProps {
        feature: Array<any>; // Replace 'any' with your actual event type
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
        // Calculate position based on index
        currentTranslate = -(index * 100);
        handleMouseEnter();
        setTimeout(() => handleDelayedResume(), 3000);
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

    const ANIMATION_SPEED = 0.4; // Controls the speed of animation (higher = faster)
    let currentTranslate = $state(0);

    function updateScroll() {
        if (!isPaused && browser && !isManualScrolling) {
            currentTranslate -= (ANIMATION_SPEED * direction);
            
            // Reverse direction at the ends
            const maxTranslate = -(features.length * 100);
            if (currentTranslate <= maxTranslate) {
                currentTranslate = 0; // Reset to start
            } else if (currentTranslate > 0) {
                currentTranslate = maxTranslate; // Reset to end
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
            setTimeout(() => {
                isRendered = true;
            }, 100);
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

    // Add this function to calculate which card is in center
    function getCurrentCenterIndex() {
        if (!containerRef) return 0;
        // Normalize the translate value to handle wrapped cards
        const totalWidth = features.length * 100;
        const normalizedPosition = Math.abs(currentTranslate) % totalWidth;
        return Math.round(normalizedPosition / 100);
    }

    // Add to your script section
    let isRendered = $state(false);
</script>

<div class="relative w-full my-12 sm:my-20 z-20">
    <!-- Mobile Carousel - Remove hover handlers -->
    <div class="sm:hidden w-full px-4">
        <div class="relative w-full {isRendered ? 'animate-fadeIn' : 'opacity-0'}">
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
                                thumbnail={`/thumbnail/${item.id}.jpg`}
                            />
                        </div>
                    {/each}
                </div>
            </div>

            <!-- Update navigation buttons - remove disabled state -->
            

            <!-- Dots Indicator -->
            <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3 p-2">
                {#each features as _, i}
                    <button 
                        class="w-2.5 h-2.5 rounded-full transition-all duration-300 ease-in-out transform hover:scale-125 {
                            i === currentIndex 
                                ? 'bg-[#AB83FE] shadow-lg shadow-[#AB83FE]/50' 
                                : 'bg-[#AB83FE]/20 hover:bg-[#AB83FE]/40'
                        }"
                        onclick={() => handleDotClick(i)}
                        aria-label={`Go to slide ${i + 1}`}
                        aria-current={i === currentIndex ? 'true' : 'false'}
                    ></button>
                {/each}
            </div>
        </div>
    </div>

    <!-- Update the desktop carousel section -->
    <div class="hidden sm:block relative">
        <div class="desktop-carousel-container relative overflow-x-hidden {isRendered ? 'animate-fadeInSlide' : 'opacity-0'}">
            <div 
                class="desktop-carousel w-full relative py-14"
                bind:this={containerRef}
            >
                <div 
                    class="flex transition-transform duration-800 ease-linear will-change-transform"
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
                                thumbnail={`/thumbnail/${item.id}.jpg`}
                            />
                        </div>
                    {/each}
                </div>
            </div>
            
            <!-- Updated dots container -->
            <div 
                class="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-3 p-2 bg-black/10 backdrop-blur-sm rounded-full z-30"
                onmouseenter={handleMouseEnter}
                onmouseleave={handleDelayedResume}
            >
                {#each features as _, i}
                    <button 
                        class="w-2.5 h-2.5 min-w-[0.625rem] rounded-full transition-all duration-300 ease-in-out transform hover:scale-125 {
                            i === getCurrentCenterIndex() 
                                ? 'bg-[#AB83FE] shadow-lg shadow-[#AB83FE]/50' 
                                : 'bg-[#AB83FE]/20 hover:bg-[#AB83FE]/40'
                        }"
                        onclick={() => handleDotClick(i)}
                        aria-label={`Go to slide ${i + 1}`}
                        aria-current={i === getCurrentCenterIndex() ? 'true' : 'false'}
                    ></button>
                {/each}
            </div>
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
        transition: transform 800ms cubic-bezier(0.4, 0, 0.2, 1);
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

    /* Add these styles to your style section */
    button.rounded-full {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        flex-shrink: 0;
        display: block;
        width: 0.625rem;  /* 10px */
        height: 0.625rem; /* 10px */
        min-width: 0.625rem;
        min-height: 0.625rem;
        border-radius: 9999px;
        aspect-ratio: 1;
    }

    button.rounded-full:hover {
        transform: scale(1.2);
        aspect-ratio: 1;
    }

    button.rounded-full[aria-current="true"] {
        transform: scale(1.2);
        aspect-ratio: 1;
    }

    .absolute.bottom-4 {
        position: absolute;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.75rem;
        padding: 0.5rem 1rem;
    }

    /* Add these animations to your style section */
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

    @keyframes fadeInSlide {
        from {
            opacity: 0;
            transform: translateX(-20px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    /* Add these utility classes */
    .animate-fadeIn {
        animation: fadeIn 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }

    .animate-fadeInSlide {
        animation: fadeInSlide 0.8s cubic-bezier(0.4, 0, 0.2, 1) forwards;
    }

    /* Update existing transitions for smoother animations */
    .transition-transform {
        transition: transform 800ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    .transition-all {
        transition: all 800ms cubic-bezier(0.4, 0, 0.2, 1);
    }

    /* Add smooth transition for card hover */
    .hover\:scale-105 {
        transition: transform 400ms cubic-bezier(0.4, 0, 0.2, 1);
    }
</style>