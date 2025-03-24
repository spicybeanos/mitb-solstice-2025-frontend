<script lang="ts">
    import { UserProfileData } from "../../routes/GoogleLogin.svelte.ts";
    let { children, href } = $props();
    console.log(UserProfileData);
</script>

<a
    href={UserProfileData.loggedIn ? href : "/profile"}
    target={UserProfileData.loggedIn ? "_blank" : ""}
    rel="noopener noreferrer">{@render children()}</a
>

<style>
    a {
        padding: clamp(6px, 1.25vh, 10px) clamp(16px, 3vw, 24px);
        background-color: #efe2e3;
        border-color: var(--sliding-link-nuetral);
        border-width: 2px;
        display: flex;
        align-items: center;
        justify-content: center;
        width: clamp(200px, 120%, 300px);
        position: relative;
        z-index: 1;
        border-style: solid;
        text-decoration: none;
        color: var(--text-light-mode);
        margin: 5px auto;
        transition: 0.1s cubic-bezier(0.785, 0.135, 0.15, 0.86);
        transition-delay: 0s !important;
        border-radius: clamp(8px, 1vw, 14px);
        font-size: clamp(1rem, 2.5vw, 1.25rem);
        font-weight: 600;
        min-height: 40px;
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
        border-radius: clamp(8px, 1vw, 14px);
    }

    a:hover::before {
        width: 100%;
        left: 0;
        right: unset;
        border-radius: clamp(8px, 1vw, 14px);
    }

    a:hover {
        box-shadow:
            0 0 var(--sliding-link-nuetral),
            0 0 var(--border-light-mode);
        color: var(--text-dark-mode);
    }

    @media screen and (max-width: 768px) {
        a {
            width: clamp(180px, 95%, 250px);
            padding: 6px 16px;
            min-height: 36px;
            font-size: clamp(0.95rem, 2vw, 1.1rem);
        }
    }

    @media screen and (max-width: 480px) {
        a {
            width: clamp(160px, 80%, 200px);
            padding: 5px 12px;
            font-size: 0.875rem;
            min-height: 32px;
            font-size: 0.95rem;
        }
    }
</style>
