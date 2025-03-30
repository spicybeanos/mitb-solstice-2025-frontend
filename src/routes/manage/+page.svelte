<script lang="ts">
    import BasicButtonFilled from "$lib/components/ui/Basic/BasicButtonFilled.svelte";
    import BasicHeader from "$lib/components/ui/Basic/BasicHeader.svelte";
    import { onMount } from "svelte";
    let { data, form } = $props();

    let regOn = $state(false);

    onMount(() => {
        regOn = data.eventRegis ? data.eventRegis : false;
    });
</script>

<div class="flex justify-center">
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
                    <input type="checkbox" name="reg" bind:checked={regOn}/>
                </label>
                <BasicButtonFilled>UPDATE</BasicButtonFilled>
            </form>
            <form action='?/pass_synch' method='post'>
                <BasicButtonFilled>Synch Cache passes</BasicButtonFilled>
            </form>

            <a href='https://www.mediafire.com/file/wlhoi1onvr7llli/solstice-verifier.apk/file' download>
                <BasicButtonFilled>Download verifier app</BasicButtonFilled>
            </a>
        </div>
    </div>
</div>

<style>
    * {
        color: white;
    }
</style>
