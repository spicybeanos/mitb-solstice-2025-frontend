<script lang="ts">
    import SimpleCard from "$lib/components/SimpleCard.svelte";
    import BasicButtonFilled from "$lib/components/ui/Basic/BasicButtonFilled.svelte";
    import BasicHeader from "$lib/components/ui/Basic/BasicHeader.svelte";
    import BasicInput from "$lib/components/ui/Basic/BasicInput.svelte";
    import { onMount } from "svelte";
    let { data, form } = $props();

    let regOn = $state(false);
    let bandOn = $state(false);
    let gform = $state("");

    onMount(() => {
        regOn = data.eventRegis ? data.eventRegis : false;
        bandOn = data.bandDist ? data.bandDist : false;
        gform = data.gform;
    });
</script>

<div class="flex justify-center">
    <SimpleCard>
        <div class="flex flex-col">
            <BasicHeader>OC and Admin Panel</BasicHeader>
            <BasicHeader>Website properties</BasicHeader>
            <div class="flex flex-col">
                <form
                    action="?/set_event_regist"
                    class="flex flex-col"
                    method="POST"
                >
                    <label class="text-white flex flex-row">
                        Enable event registrations
                        <input
                            class="w-6"
                            type="checkbox"
                            name="reg"
                            bind:checked={regOn}
                        />
                    </label>
                    <BasicButtonFilled>UPDATE</BasicButtonFilled>
                </form>
                <form
                    action="?/set_band_dist"
                    class="flex flex-col"
                    method="POST"
                >
                    <label class="text-white flex flex-row">
                        Enable band distribution
                        <input
                            class="w-8"
                            type="checkbox"
                            name="band"
                            bind:checked={bandOn}
                        />
                    </label>
                    <BasicButtonFilled>UPDATE</BasicButtonFilled>
                </form>
                <a
                    href="https://www.mediafire.com/file/wlhoi1onvr7llli/solstice-verifier.apk/file"
                    download
                >
                    <BasicButtonFilled>Download Car</BasicButtonFilled>
                </a>
                <form action="?/gform" method="post">
                    <label>
                        Stay Google form URL
                        <BasicInput
                            bind:value={gform}
                            name="link"
                            placeholder="Stay google form link"
                        />
                    </label>

                    <BasicButtonFilled>UPDATE</BasicButtonFilled>
                </form>
            </div>
        </div>
    </SimpleCard>
</div>

<style>
    * {
        color: white;
    }
</style>
