<script lang="ts">
    import { UserProfileData } from "./GoogleLogin.svelte.ts";
    import landing_solstice from '../lib/icons/landing_solstice.svg'
    import tech from '../lib/icons/landing_tech.svg'
    import RetroGrid from "$lib/components/ui/RetroGrid.svelte";
    import { cn } from "$lib/utils/cn.ts";
  import InteractiveHover from "$lib/components/ui/InteractiveHover.svelte";
  const content = ["A", "B", "C", "D"];
</script>

<main class="flex flex-col items-center justify-center min-h-screen">
    <div class="h-screen flex flex-col justify-center items-center w-full overflow-hidden">
        <div class="relative  h-[70%] w-[90%] flex flex-col justify-center items-center text-white gap-5 md:gap-3">
            <!-- <h1 class="font-akira md:text-6xl text-5xl text-left">Book your tickets now!</h1> -->
            <!-- <h1 class="font-akira md:text-6xl text-5xl text-right">The fest will be a blast</h1> -->
            <!-- <p class="text-[#5F4C86] md:text-3xl text-xl text-center">This will be the best fest you will ever encounter</p> -->
             <!-- <h1 class="font-akira md:text-7xl text-5xl text-center" >Tech</h1> -->
             <img src={tech} class="sm:w-[25%] w-[45%] z-20" alt="tech"/>
             <img src={landing_solstice} class="sm:w-3/5 w-full z-20" alt="solstice"/>
            <!-- <a href="/passes" class="md:mt-5 text-nowrap bg-black text-center rounded-md md:p-5 p-3 min-w-[50%] md:min-w-[20%]  text-lg md:text-2xl font-semibold cursor-pointer hover:scale-105 transition-[scale] duration-200 ease-in-out">Book Tickets</a> -->
            <a href="/passes" class="pt-12"><InteractiveHover text="Book your tickets" class="text-nowrap min-w-[12rem] z-20"></InteractiveHover></a> 
        </div>
        <RetroGrid />
    </div>

    <div class="h-[100vh] w-full flex flex-col my-12 sm:my-20">
        <div class="w-full h-full flex justify-between gap-4 px-2 sm:px-6 sm:gap-12">
        {#each content as item}
            <div class={`bg-[#d9d9d9] h-[75%] sm:h-[90%] w-full rounded-2xl grid place-items-center ${item === "D" ? "max-sm:hidden" : ""} `}>
                {item}
            </div>
        {/each}
        </div>
        <div class="text-[#d9d9d9] flex flex-col gap-4">
            <h1 class="font-akira text-2xl sm:text-6xl text-center
            ">Book your tickets now!</h1>
            <h1 class="font-akira text-2xl sm:text-6xl text-center
           from-indigo-500 via-purple-500 to-indigo-500
            animate-text
            ">This fest will be a blast</h1>
        </div>
        <div class="w-full grid place-items-center my-8">
           <a href="/passes"><InteractiveHover text="Book your tickets" class="text-nowrap min-w-[12rem]"></InteractiveHover></a> 
        </div>
    </div>

    <div class="max-sm:hidden w-full h-[50vh] mb-24 flex flex-col justify-between text-[#d9d9d9] text-lg sm:text-2xl px-8">
        <div class="w-full ">
            <p>This will be the best fest you will ever encounter</p>
            <p>This will be the best fest you will ever encounter</p>
        </div>
        <div class="w-full text-end">
            <p>This will be the best fest you will ever encounter</p>
            <p>This will be the best fest you will ever encounter</p>
        </div>
        <div class="w-full ">
            <p>This will be the best fest you will ever encounter</p>
            <p>This will be the best fest you will ever encounter</p>
        </div>
    </div>

    <div class="landing-sec-2 h-screen flex flex-col justify-center items-center w-[95vw] bg-cover hidden sm:block">
        <!-- <div class="h-[70%] w-[80%] flex flex-col justify-center items-center text-white gap-3">
            <h1 class="font-akira text-6xl text-center">Book your tickets now!</h1>
            <h1 class="font-akira text-6xl text-center">The fest will be a blast</h1>
            <p class="text-[#5F4C86] text-3xl">This will be the best fest you will ever encounter</p>
            <button class="mt-5 bg-black rounded-md p-5 min-w-[20%] max-w-[20%] text-2xl font-semibold cursor-pointer hover:scale-105 transition-[scale] duration-200 ease-in-out">Book Tickets</button>
        </div> -->
    </div>
    
</main>

<style>
    .landing-sec-2 {
        background-image: 
        linear-gradient(black, black),
        url("../lib/landing_sec_2_image.jpg");
        background-blend-mode: saturation;
        
    }

    main{
        /* background-color: #AB83FE; */
    }

    /* .mid {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: fit-content;
    }
    .centre {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
    } */
</style>
