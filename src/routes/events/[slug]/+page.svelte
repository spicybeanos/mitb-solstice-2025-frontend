<script lang="ts">
    import type { FalakEvent } from "$lib/components/Events.js";
    import { onMount } from "svelte";
    import {events} from "$lib/components/Events.js";
    // import Card from "$lib/components/Card.svelte";
    import { CardBody, CardContainer, CardItem } from "$lib/components/ui/ThreeDCardEffect/index.js";
  import { UserProfileData } from "../../GoogleLogin.svelte.js";
  import { page } from "$app/stores";

    let teamId: string;
    let teamName = $state("");
    let teamID = $state();
    let hostID: string|null;
    
    let teamSize : number;
    let teamMembers : string[] = $state([]);
    let teamLeader = $state("");
    let teamMember2 = $state("");
    let teamMember3 = $state("");
    let existing_team_ID = $state("");
    let new_member = $state("");
    let team = $state("existing");
    let isMouseEntered = $state(false);
    let { data } = $props();
    let event: FalakEvent = $state({
        img_alt:"picture of the event",
        name: "",
        id: "",
        title: "",
        description: "",
        date: "",
        time: "",
        duration: 0,
        teamSize: 1,
        pictureURL: '',
    });

    function showTeams() {
        console.log("Showing teams");
    }
    function toggleTeam() {
    team = "existing" === team ? "new" : "existing"; 
    }
    function register() {
    console.log("Registering:", { teamLeader, teamMember2, teamMember3 });
    }

    onMount(() => {
        const eventID = data.slug;
        
        events.forEach(element => {
            if(element.id === eventID){
                event = element;
                teamSize = event.teamSize;
                teamMembers = Array(teamSize-1).fill("");
                
            }
        });
    });


    async function getTeamID() {    
        try {
            if (!UserProfileData.email) {
                throw new Error("No email available - please login first");
            }
                
            const response = await fetch(`/events/${event.id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    teamName,
                    email: UserProfileData.email  // Send email instead of hostId
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to create team');
            }

            const result = await response.json();
            console.log({ teamName, result });
            teamID = result.team.id;
            team = "made";
        } catch (error) {
            console.error("Error creating team:", error);
        }
    }
    async function delTeam() {
        if (!teamId) {
            console.error("No team ID provided");
            return;
        }

        console.log("Deleting team with ID:", teamId);
        console.log(teamId);
        
        try {
            const res = await fetch(`/api/team/${teamId}`, { method: 'DELETE' });
            const data = await res.json();

            if (data.success) {
                console.log("Team deleted successfully:", data.team);
                // Optionally, update UI or redirect
            } else {
                console.error("Error deleting team:", data.error);
            }
        } catch (err) {
            console.error("Failed to delete team:", err);
        }
    }

    let loading = $state(false);
    let error = $state('');
    let successMessage = $state('');
    async function addMember() {
        loading = true;
        error = '';
        successMessage = '';
        
        try {
            const teamId = existing_team_ID;  // Get the teamId from the URL
            const userID = UserProfileData.userID;
            
            if (!UserProfileData.userID) {
                throw new Error('You must be logged in to join a team');
            }

            const response = await fetch(`/events/${teamId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ userID })
            });

            const result = await response.json();

            if (!response.ok) {
                throw new Error(result.error || 'Failed to join team');
            }

            successMessage = 'Successfully joined the team!';
            console.log("Added");
            
            setTimeout(() => {
                window.location.reload();
            }, 1500);

        } catch (err) {
            error = err instanceof Error ? err.message : 'Failed to join team';
        } finally {
            loading = false;
        }
    }   
    
</script>
<div class="centre main">
    <CardContainer bind:isMouseEntered className="inter-var my-16 ">
        <CardBody className=" bg-gray-50 relative group/card  dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[60rem] h-auto rounded-xl p-6 border">
            <CardItem {isMouseEntered} translateZ="100" className="w-full  mb-4 flex justify-center ">
                <img
                    src={event.pictureURL}
                    height="1000"
                    width="1000"
                    class="h-80 w-full rounded-xl object-cover group-hover/card:shadow-xl"
                    alt="thumbnail"
                />
            </CardItem>
            <CardItem
            {isMouseEntered}
            translateZ="50"
            className="text-xl w-full  text-[#C7AE93] flex mt-8 justify-between"
            >
                <div class="text font-extrabold">
                    {event.name}   
                </div>
                <div class="text font-medium">
                    {`@${event.id}`}
                </div>
            </CardItem>
            <CardItem
                {isMouseEntered}
                translateZ="60"
                className="text-[#C7AE93] text-sm max-w-sm mt-2 "
            >
                {event.description}
            </CardItem>
            <CardItem
                {isMouseEntered}
                translateZ="60"
                className="text-[#C7AE93] text-sm max-w-sm mt-2 mb-4"
            >
                <pre>Team size: {` ${event.teamSize} ${event.teamSize === 1 ? ' person' : ' people'}`}</pre>
            </CardItem>
            <CardItem
            className="w-full flex flex-col"
            >   
                <div class="picker relative sm:px-2 flex justify-between font-light text-xs">
                    <div class={`rounded-xs w-1/2 text-center py-1 ${team === "existing"  ? `bg-white text-black`:`bg-[#1d1d1d] text-white border `}`}><button class="cursor-pointer" onclick={toggleTeam}>New Team</button></div>
                    <div class={`rounded-xs w-1/2 text-center py-1 ${team === "new" ? `bg-white text-black`: `bg-[#1d1d1d] text-white border `}`}><button class="cursor-pointer" onclick={toggleTeam}>Existing Team</button></div>
                </div>
                {#if team === "existing"}
                <div class="bg-black text-white w-full pt-2 sm:pt-8">
                    <div class="mb-6 sm:mb-8">
                        <label for="team-name" class="block mb-1">Team Name</label>
                        <input placeholder="Enter team name" class="w-full p-2 border text-white bg-[#1d1d1d]" bind:value={teamName} />
                      </div>
                    
                    <div class="mb-6 sm:mb-8">
                      <label for="leader-name" class="block mb-1">Team  leader</label>
                      <input placeholder="Enter name" class="w-full p-2 border text-white bg-[#1d1d1d]" bind:value={teamLeader} />
                    </div>

                    {#each teamMembers as teamMember, i}
                        <div class="mb-6 sm:mb-8">
                            <label for="member-{i}" class="block mb-1">Team member {i + 2}</label>
                            <input
                            placeholder="Enter name"
                            class="w-full p-2 border text-white bg-[#1d1d1d]"
                            bind:value={teamMembers[i]}
                            />
                        </div>
                    {/each}
                  
                    <button class="w-full text-center bg-white text-black hover:bg-black hover:text-white transition-all duration-200 p-2 rounded-sm max-sm:mt-3" onclick={getTeamID}>Register</button>
                    <!-- {#if } FUNCTIONALITY TO CHECK IF USER IS HR TO BE IMPLEMENTED -->
                        <button class="w-full text-center bg-white text-black hover:bg-black hover:text-white transition-all duration-200 p-2 rounded-sm mt-3 sm:mt-6" onclick={showTeams}>Show teams</button>
                    <!-- {/if} -->
                    </div>
                  {:else if team === "new" } 
                  <div class="bg-black text-white w-full pt-6 sm:pt-8 ">
                    <div class="mb-6 sm:mb-8">
                        <label for="team-ID" class="block mb-1">Team ID</label>
                        <input placeholder="Enter team name" class="w-full p-2 border text-white bg-[#1d1d1d]" bind:value={existing_team_ID} />
                    </div>
                    
                    <div class="mb-6 sm:mb-8">
                      <label for="member-name" class="block mb-1">Member Name</label>
                      <input placeholder="Enter your name" class="w-full p-2 border text-white bg-[#1d1d1d]" bind:value={new_member} />
                    </div>

                    {#if error}
                        <div class="text-red-500 mt-2">{error}</div>
                    {/if}
                    {#if successMessage}
                        <div class="text-green-500 mt-2">{successMessage}</div>
                     {/if}
                    <button 
                    class="w-full text-center bg-white text-black hover:bg-black hover:text-white transition-all duration-200 p-2 rounded-sm mt-4" 
                    onclick={addMember}
                    disabled={loading}
                    >
                        {loading ? 'Joining...' : 'Join'}
                    </button>

                  </div>
                  {:else}
                    <div class="bg-black text-white w-full pt-2 sm:pt-8 mt-6">
                        <div class="mb-8 mt-6">
                            <p>Your Team ID : {teamID}</p>
                            <button class="w-full text-center mt-6 bg-white text-black hover:bg-black hover:text-white transition-all duration-200 p-2 rounded-sm max-sm:mt-3" onclick={delTeam}>Delete Team</button>
                        </div>
                    </div>
                {/if}
            </CardItem>
        </CardBody>
    </CardContainer>
</div>
<style>
    img{
        width: 60vw;
    }
    /* div{
        color: var(--text-light)
    } */
    .margin {
        margin: 10px;
    }
    .aspect {
        aspect-ratio: 1.423 / 1.8;
        width: 15em;
    }
    .nowrap {
        height: 5em;
        overflow: auto;
    }
    .mid {
        display: flex;
        flex-direction: column;
        align-items: center;
        width: 70vw;
        flex-wrap: wrap;
    }
    .centre {
        display: flex;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
    }

</style>
