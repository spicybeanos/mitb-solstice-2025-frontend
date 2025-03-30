<script lang="ts">
    // @ts-ignore
    import GlowDiv from "$lib/components/ui/GlowDiv.svelte";
    import BasicHeader from "$lib/components/ui/Basic/BasicHeader.svelte";
    import BasicInput from "$lib/components/ui/Basic/BasicInput.svelte";
    import BasicButtonFilled from "$lib/components/ui/Basic/BasicButtonFilled.svelte";
    import SimpleCard from "$lib/components/SimpleCard.svelte";
    // @ts-ignore
    import InfoCard from "$lib/components/InfoCard.svelte";
    import { onMount } from "svelte";
    import type {
        SolsticeTeamInfo,
        SolsticeUser,
    } from "$lib/server/BackendTypes.js";
    import { MemoryStick } from "lucide-svelte";

    let { data, form } = $props();

    let teamDataLoaded = $state(false);
    let registrationData = $state(
        {} as {
            inTeam: boolean;
            teamID: string | null;
            team: SolsticeTeamInfo;
            memebers: SolsticeUser[];
        },
    );

    onMount(() => {
        fetch(`/events/${data.eventID}/team/mem/${data.userID}`).then((res) => {
            res.json().then((d) => {
                try {
                    const data = d as {
                        inTeam: boolean;
                        teamID: string | null;
                        team: SolsticeTeamInfo;
                        memebers: SolsticeUser[];
                    };
                    registrationData = data;
                } catch {}

                teamDataLoaded = true;
            });
        });
    });
</script>

<div class="flex flex-row flex-center w-full justify-center">
    <div class="flex flex-center justify-center flex-col w-fit">
        {#if data.isRegistered == false}
            <InfoCard>
                <div class="text-xl text-white">You're not logged in!</div>
            </InfoCard>
        {:else if data.registrationEnabled == false}
            <InfoCard>
                <div class="text-xl text-white">
                    This event's registrations haven't started yet!
                </div>
            </InfoCard>
        {/if}
        {#if data.canAccessEvent == false}
            <div class="flex flex-center flex-col flex-wrap">
                <InfoCard>
                    <span class="text-white"
                        >You do not have the pass to register for this event!</span
                    >
                </InfoCard>

                {#if data.eventPasses != null}
                    <div
                        class="text-white text-lg p-4 bg-gray-900 w-fit rounded-lg inset-shadow-sm inset-shadow-cyan-500/50 hover:shadow-lg shadow-cyan-500/50 transition-all duration-500"
                    >
                        Passes for this event:
                        <ul>
                            {#each data.eventPasses as p}
                                <li>
                                    <GlowDiv>{p.name}</GlowDiv>
                                </li>
                            {/each}
                        </ul>
                    </div>
                {/if}
            </div>
        {/if}
        {#if data.canAccessEvent}
            {#if teamDataLoaded}
                {#if !registrationData.inTeam}
                    <SimpleCard>
                        {#if form?.msg}
                            <GlowDiv className="text-red">{form?.msg}</GlowDiv>
                        {/if}
                        <BasicHeader>Teams</BasicHeader>
                        <GlowDiv className="p-6">
                            <h1 class="text-2xl text-white">Create team</h1>
                            <form
                                class="flex flex-col flex-wrap w-fit"
                                action="?/newTeam"
                                method="post"
                            >
                                <BasicInput
                                    className=""
                                    name="team_name"
                                    placeholder="Team name"
                                />
                                <BasicButtonFilled
                                    >Create team</BasicButtonFilled
                                >
                            </form>
                        </GlowDiv>
                        <h1 class="w-full text-center text-white text-2xl">
                            Or
                        </h1>
                        <GlowDiv className="p-6">
                            <h1 class="text-2xl text-white">Join team</h1>
                            <form
                                class="flex flex-col flex-wrap w-fit"
                                action="?/joinTeam"
                                method="post"
                            >
                                <BasicInput
                                    className=""
                                    placeholder="Team ID"
                                    name="team_id"
                                />
                                <BasicButtonFilled>Join team</BasicButtonFilled>
                            </form>
                        </GlowDiv>
                    </SimpleCard>
                {:else if registrationData.team.host_id == data.userID}
                    <SimpleCard className="p-6">
                        <h1 class="text-2xl text-white">
                            {registrationData.team.name}
                        </h1>
                        <div class="text-white">You're the host</div>
                        <div class="text-white">
                            Team ID <code class="text-white"
                                >{registrationData.team.id}</code
                            >
                        </div>
                        <GlowDiv>
                            <div class="text-white">Members</div>
                            {#each registrationData.members as mem}
                                <GlowDiv className="bg-gray-700"
                                    >{`${mem.first_name} ${mem.last_name}`}</GlowDiv
                                >
                            {/each}
                        </GlowDiv>
                        <form action="?/disbandTeam" method="post">
                            <BasicButtonFilled color="#ff0000"
                                >DISBAND</BasicButtonFilled
                            >
                        </form>
                    </SimpleCard>
                {:else}
                    <SimpleCard>
                        <h1 class="text-2xl text-white">
                            {registrationData.team.name}
                        </h1>
                        <div class="text-white">
                            Team ID <code class="text-white"
                                >{registrationData.team.id}</code
                            >
                        </div>
                        <GlowDiv>
                            <div class="text-white">Members</div>
                            {#each registrationData.members as mem}
                                <GlowDiv className="bg-gray-700"
                                    >{`${mem.first_name} ${mem.last_name}`}</GlowDiv
                                >
                            {/each}
                        </GlowDiv>
                        <form action="?/leaveTeam" method="post">
                            <BasicButtonFilled color="#ff0000"
                                >LEAVE</BasicButtonFilled
                            >
                        </form>
                    </SimpleCard>
                {/if}
            {:else}
                <GlowDiv className="p-6">
                    <h1 class="text-2xl text-white">Loading...</h1>
                    <div class="text-white">This may take a while...</div>
                </GlowDiv>
            {/if}
        {/if}
    </div>
</div>
