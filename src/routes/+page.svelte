<script lang="ts">

    interface SolEvent {
        name: string;
        description: string | null;
        type: EventType;
        team_members: number | null;
        start: string | null;
        venue: string | null;
        id: string;
    }
    type EventType =
        | "cultural"
        | "e_sports"
        | "experiences"
        | "finance"
        | "hackathon"
        | "other"
        | "robotics"
        | "sports"
        | "technical";
    let landing_solstice = "/media/landing_solstice.svg";
    let tech = "/media/landing_tech.svg";
    import QR from '$lib/components/QR.svelte'
    import InteractiveHover from "$lib/components/ui/InteractiveHover.svelte";
    import Youtube from "$lib/components/Youtube.svelte";
    import retro from "$lib/retro.svg";
    import matrix from "$lib/matrix2.svg";
    import EventCard from '$lib/components/EventCard.svelte';
    const content = ["A", "B", "C", "D"];
    let { data } = $props();
</script>

<main class="flex flex-col items-center justify-center min-h-screen">
    <div
        class="h-screen flex flex-col justify-center items-center w-full overflow-hidden sm:pb-[16rem]"
    >
        <div
            class="relative h-[70%] w-[90%] flex flex-col justify-center items-center text-white gap-5 md:gap-3"
        >
            <img
                src={tech}
                class="sm:w-[25%] w-[45%] z-20 mt-[120px]"
                alt="tech"
            />
            <img
                src={landing_solstice}
                class="sm:w-3/5 w-full z-20"
                alt="solstice"
            />
            <a href="/passes" class="pt-12"
                ><InteractiveHover
                    text="Book your tickets"
                    class="text-nowrap min-w-[12rem] z-20"
                ></InteractiveHover></a
            >
        </div>
    </div>
    <div class="h-[100vh] w-full flex flex-col my-12 sm:my-20 z-20">
        <div
            class="flex gap-4 px-2 sm:px-6 sm:gap-12 overflow-x-auto whitespace-nowrap p-4 w-full scrollbar-hide"
        >
            {#each data.feature as item,i}
                <div
                    class='w-[360px] aspect-[5/7] shadow-lg rounded-lg flex items-center justify-center'
                >
                    <EventCard event={item} i thumbnail={`/thumbnail/${item.id}.jpg`} />
                </div>
            {/each}
        </div>
        <div class="text-[#d9d9d9] flex flex-col gap-4 z-20">
            <h1
                class="font-akira text-2xl sm:text-6xl text-center gradient-text
            "
            >
                Book your tickets now!
            </h1>
            <h1
                class="font-akira text-2xl sm:text-6xl text-center gradient-text
            "
            >
                This fest will be a blast
            </h1>
        </div>
        <div class="w-full grid place-items-center my-8">
            <a href="/passes"
                ><InteractiveHover
                    text="Book your tickets"
                    class="text-nowrap min-w-[12rem]"
                ></InteractiveHover></a
            >
        </div>
    </div>
    <Youtube />

    <div
        class="max-sm:hidden w-full h-[50vh] mb-24 flex flex-col justify-between text-[#d9d9d9] text-lg sm:text-2xl px-8 z-50"
    >
        <div class="w-full">
            <div class="w-fit bg-[#512451] p-4 rounded-2xl">
                <p>Sponsor</p>
            </div>
        </div>
        <div class="w-full text-end flex justify-end">
            <div class="w-fit bg-[#512451] p-4 rounded-2xl">
                <p>Sponsor 2</p>
            </div>
        </div>
        <div class="w-full">
            <div class="w-fit bg-[#512451] p-4 rounded-2xl">
                <p>Sponsor 2</p>
            </div>
        </div>
    </div>
</main>

<style>
    .gradient-text {
        background: linear-gradient(
            90deg,
            #b41e8e,
            #9933ff,
            #8a2be2,
            #9933ff,
            #b4218f
        );
        background-size: 200% auto;
        color: transparent;
        -webkit-background-clip: text;
        background-clip: text;
        animation: gradient 3s linear infinite;
    }

    @keyframes gradient {
        0% {
            background-position: 0% center;
        }
        100% {
            background-position: 200% center;
        }
    }
</style>
