<script lang="ts">
    import {UserProfileData} from "../../routes/GoogleLogin.svelte.ts";
    let { children , href } = $props();
    console.log(UserProfileData)
</script>

<a href={UserProfileData.loggedIn?href:"/profile"} target={UserProfileData.loggedIn?"_blank":""} rel="noopener noreferrer">{@render children()}</a>

<style>
    a {
    padding: 10px;
    background-color: #D9D9D9;
    border-color: var(--sliding-link-nuetral);
    border-width: 2px;
    display: flex; 
    align-items: center; 
    justify-content: center;
    width: 100%;
    position: relative;
    z-index: 1;
    border-style: solid;
    text-decoration: none;
    color: var(--text-light-mode);
    margin: 10px 0; 
    transition: 0.1s cubic-bezier(0.785, 0.135, 0.15, 0.86);
    transition-delay: 0s !important;
}

a::before {
    position: absolute;
    content: "";
    top: 0;
    left: 0;
    width: 0%;
    height: 100%;
    background: var(--sliding-link-nuetral);
    z-index: -1;
    transition: 0.2s cubic-bezier(0.785, 0.135, 0.15, 0.86);
}

a:hover::before {
    width: 100%;
    left: 0;
    right: unset;
}

a:hover {
    box-shadow:
        0 0 var(--sliding-link-nuetral),
        0 0 var(--border-light-mode);
    color: var(--text-dark-mode);
}

</style>