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
    import QR from "$lib/components/QR.svelte";
    import InteractiveHover from "$lib/components/ui/InteractiveHover.svelte";
    import Youtube from "$lib/components/Youtube.svelte";
    import SimpleCard from "$lib/components/SimpleCard.svelte";
    import retro from "$lib/retro.svg";
    import matrix from "$lib/matrix2.svg";
    import EventCard from "$lib/components/EventCard.svelte";
    import Carousel from "$lib/components/Carousel.svelte";
    const content = ["A", "B", "C", "D"];
    let { data } = $props();
</script>

<main class="flex flex-col items-center justify-center min-h-screen space-y-8">
    <div
        class="h-screen flex flex-col justify-center items-center w-full overflow-hidden pb-[4rem]"
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
  <div class="h-[100vh] w-full flex flex-col mb-12 sm:mb-60 mt-2 z-20">
    <Carousel {data}></Carousel>

     <div class="text-[#d9d9d9] flex flex-col gap-4 z-20 m-[30px] mt-16">
            <h1
                class="font-akira text-2xl sm:text-6xl text-center gradient-text
            "
            >
                Book your tickets now!
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

        <SimpleCard>
            <div
                class="flex max-sm:flex-col gap-12 justify-between items-center video-container"
            >
                <iframe
                    class="w-full sm:w-1/2 min-h-[12rem] sm:min-h-[5rem] sm:my-6 my-4 rounded-xl aspect-video"
                    title="montage"
                    src="https://www.youtube.com/embed/IYjSzDsYhgA?si=1Shh4M9aT8o9eA_q?controls=0"
                >
                </iframe>
                <div
                    class="text-center text-lg sm:text-left text-white w-full sm:w-1/2"
                >
                    Tech Solstice is the annual technical fest of Manipal
                    Institute of Technology, Bangalore, uniting innovation,
                    creativity, and cutting-edge technology. Featuring an
                    exciting lineup of hackathons, competitions, robotics
                    challenges, workshops, and speaker sessions, it provides a
                    dynamic platform for students to showcase their skills,
                    collaborate, and explore emerging tech trends. Get ready for
                    an immersive experience of learning, competing, and
                    networking at Tech Solstice!
                </div>
            </div>
        </SimpleCard>
        <div class="flex flex-center justify-center font-akira m-9">
            <h1 class="text-white text-3xl">Our Sponsors</h1>
        </div>
        <div class="flex flex-center flex-col justify-center">
            <div class="flex flex-center bg-white w-fit m-7">
                <img src="./Virya.svg" alt="Virya sponsor logo" width="700px" />
            </div>

            <div class="flex flex-center justify-center">
                <div class="flex flex-center justify-center bg-white m-7 rounded-xl">
                    <img
                        src="./StockGrowpng.png"
                        alt="Virya sponsor logo"
                        width="350px"
                    />
                </div>

                <div class="flex flex-center justify-center bg-white m-7">
                    <img
                        src="./Signitude.svg"
                        alt="Virya sponsor logo"
                        width="350px"
                    />
                </div>
            </div>
        </div>

        <div
            class="flex flex-col p-6 md:p-8 text-xs md:text-base text-white z-0"
        >
            <div class="flex flex-row justify-between z-30">
                <div class="flex flex-col">
                    <p>Manipal Institute of Technology</p>
                    <p>Yelahanka, Bengaluru</p>
                    <p>Karnataka - 560064</p>

                    <a href="/privacy" class="text-white">Our Privacy policy</a>
                    <a href="/tos" class="text-white">Our terms of service</a>
                </div>

                <div class="flex flex-col text-right">
                    <p>Contact @</p>
                    <p>+91 79069 52055</p>
                    <p>( Atharva Maikhuri - HR Head )</p>
                    <p>+91 72045 87438</p>
                    <p>( Rohit Nandagopal - HR Head )</p>
                    <a href="/contactus">Contact us</a>
                </div>
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
