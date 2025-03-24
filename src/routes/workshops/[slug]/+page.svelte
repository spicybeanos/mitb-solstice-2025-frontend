<script lang="ts">
    import {
        CardBody,
        CardContainer,
        CardItem,
    } from "$lib/components/ui/ThreeDCardEffect";
    import SimpleCard from "$lib/components/SimpleCard.svelte";
    import BasicHeader from "$lib/components/ui/Basic/BasicHeader.svelte";
    import { onMount } from "svelte";
    import {
        displayDate,
        displayDateTime,
        displayTime,
    } from "$lib/components/DisplayTime.js";
    let { data } = $props();
    let isMouseEntered = $state(false);

    let dateFrom = $state("");
    let dateTo = $state("");
    let date_to = $state(new Date());
    let date_from = $state(new Date());
    onMount(() => {
        const df = new Date(data.result?.date_from);
        const dt = new Date(data.result?.date_to);
        date_to = dt;
        date_from = df;
        dateFrom = displayDateTime(df);
        dateTo = displayDateTime(dt);
    });
</script>

<div class="flex flex-center justify-center align-center">
    <CardContainer bind:isMouseEntered className={`inter-var my-16 fade-in`}>
        <CardBody
            className=" bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-[#C7AE93]/80 duration-600 dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-[95%] max-w-[60rem] h-auto rounded-xl p-4 sm:p-6 border mx-auto"
        >
            <CardItem
                {isMouseEntered}
                translateZ="100"
                className="w-full mb-4 flex justify-center overflow-hidden rounded-xl"
            >
                <img src={data.result?.image_url} class="rounded-xl" />
            </CardItem>

            <div class="p-5">
                <CardItem
                    {isMouseEntered}
                    translateZ="50"
                    className="text-xl w-full  text-[#C7AE93]  mt-8 flex flex-col sm:flex-row justify-between space-y-4 md:space-y-0 justify-center"
                    ><BasicHeader>{data.result?.name}</BasicHeader></CardItem
                >

                <div class="flex flex-center justify-center flex-row flex-wrap">
                    <div class="text-white bg-gray-900 rounded-xl w-fit p-3">
                        <div class="flex flex-col justify-center align-center">
                            <div class="bg-gray-500 p-2 rounded-lg m-2">
                                Presented by <span>{data.result?.club}</span>
                            </div>
                            <div class="bg-gray-500 p-2 rounded-lg m-2">
                                Venue :{data.result?.venue}
                            </div>

                            <div class="bg-gray-500 p-2 rounded-lg m-2">
                                On {displayDate(date_from)}
                            </div>
                            <div class="bg-gray-500 p-2 rounded-lg m-2">
                                From {displayTime(date_from)}
                            </div>
                        </div>
                    </div>
                    <div class="text-white w-fit m-4">
                        {data.result?.description}
                    </div>
                </div>
            </div>
        </CardBody>
    </CardContainer>
</div>
