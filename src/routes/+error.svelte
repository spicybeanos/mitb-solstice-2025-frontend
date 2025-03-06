<script lang="ts">
    import { page } from "$app/state";
    import SimpleCard from "$lib/components/SimpleCard.svelte";
    import { error } from "@sveltejs/kit";

    function svg() {
        switch (page.status) {
            case 403:
                return { src: "/icons/forbidden.svg", title: "Forbidden" };
            case 500:
                return {
                    src: "/icons/server_error.svg",
                    title: "Server error",
                };
            case 400:
                return { src: "/icons/bad_req.svg", title: "Bad request" };
            case 404:
                return { src: "/icons/not_found.svg", title: "Not found" };
            default:
                return { src: "/icons/other_error.svg", title: "" };
        }
    }
</script>

<div class="flex justify-center h-[60vh] items-center">
    <div class=" flex flex-row">
        <SimpleCard>
            <img
                src={svg().src}
                width="150px"
                height="150px"
                alt="forbidden"
                class="m-[20px]"
            />
            <div>
                <h1>{page.status} | {svg().title}</h1>
                <div class="text-white text-lg">
                    {page.error?.message}
                </div>
                <div class="text-white">
                    If you think this is an error, please <a
                        class="text-blue-400"
                        href="/support">submit a ticket</a
                    >
                    or <a class="text-blue-400" href="/contactus">contact us</a>
                </div>
            </div>
        </SimpleCard>
    </div>
</div>

<style>
    h1 {
        color: rgb(252, 164, 164);
        font-size: 60px;
    }
</style>
