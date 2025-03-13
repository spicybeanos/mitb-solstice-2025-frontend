<script>

    import BasicHeader from "$lib/components/ui/Basic/BasicHeader.svelte";
    import { onMount } from "svelte";
    import { UserProfileData } from "../../GoogleLogin.svelte.ts";
    import { redirect } from "@sveltejs/kit";
    let {data} = $props();

    onMount(() =>{
        if(data.user != null){
            UserProfileData.loggedIn = true;
            UserProfileData.email = data.user.email;
            UserProfileData.name = data.user.name;
            UserProfileData.registered = data.sol != null;
            if(data.sol != null){
                UserProfileData.userID = data.sol.id
            }
        }

        redirect(308,'/profile');
    })
</script>
<div class="flex justify-center">
    <div class="p-[30px]">
        <BasicHeader>You're logged in! redirecting...</BasicHeader>
        {#if data.msg}
        <div class="text-white">Message from server:{data.msg}</div>
        {/if}
        <div class="text-white">
            If you haven't been redirected yet, <a class="text-blue-400" href="/profile">click here</a>
        </div>
    </div>
</div>
