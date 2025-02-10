<script lang="ts">
    import { UserProfileData } from "./GoogleLogin.svelte.ts";
</script>

<main class="flex flex-col items-center justify-center min-h-screen">
    <div class="h-screen flex flex-col justify-center items-center w-full">
        <div class="h-[70%] w-[90%] flex flex-col justify-center items-center text-white gap-5 md:gap-3">
            <h1 class="font-akira md:text-6xl text-5xl text-left">Book your tickets now!</h1>
            <h1 class="font-akira md:text-6xl text-5xl text-right">The fest will be a blast</h1>
            <p class="text-[#5F4C86] md:text-3xl text-xl text-center">This will be the best fest you will ever encounter</p>
            <a href="/passes" class="md:mt-5 bg-black text-center rounded-md md:p-5 p-3 min-w-[50%] md:min-w-[20%] md:max-w-[20%] text-lg md:text-2xl font-semibold cursor-pointer hover:scale-105 transition-[scale] duration-200 ease-in-out">Book Tickets</a>
        </div>
    </div>

    <div class="landing-sec-2 h-screen flex flex-col justify-center items-center w-full bg-cover">
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
        background-color: #AB83FE;
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
