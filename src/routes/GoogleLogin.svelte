<script lang="ts">
  import { onMount } from "svelte";
  import { UserProfileData } from "./GoogleLogin.svelte.ts";
  import type { User } from "@auth/sveltekit";
  let { cookieJwt } = $props();
  import { isSigningOut } from "./GoogleLogin.svelte.ts";

  interface UserProfile {
    name: string;
    email: string;
    picture: string;
    sub: string;
    email_verified: boolean;
  }

  let g_user_profile: UserProfile | null = $state(null);

  interface GoogleSignInResponse {
    credential: string;
  }

  function handleGoogleSignIn(response: GoogleSignInResponse) {
    if (!isSigningOut.status) {
      const jwt = response.credential;

      const base64Url = jwt.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );

      fetch("/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: jwt, action: "login" }),
      }).then((res) => {
        if (res.ok) {
          res.json().then((gup: UserProfile) => {
            g_user_profile = gup;
            if (gup != undefined || gup != null) {
              UserProfileData.name = gup.name;
              UserProfileData.email = gup.email;
              UserProfileData.picture = gup.picture;
              UserProfileData.loggedIn = true;

              fetch(`/profile/reg?email=${encodeURIComponent(gup.email)}`, {
                method: "GET",
              }).then((reg) => {
                if (reg.ok) {
                  reg.json().then((rn) => {
                    UserProfileData.registered = true;
                    UserProfileData.userID = rn.message;
                  });
                }
              });
            }
          });
        }
      });
    }
  }

  onMount(() => {
    if (!isSigningOut.status) {
      fetch("/profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: cookieJwt, action: "login" }),
      }).then((result) => {
        if (result.ok) {
          result.json().then((gup: UserProfile) => {
            g_user_profile = gup;
            if (gup != undefined || gup != null) {
              UserProfileData.name = gup.name;
              UserProfileData.email = gup.email;
              UserProfileData.picture = gup.picture;
              UserProfileData.userID = gup.sub;
              UserProfileData.loggedIn = true;
            }
          });
          return;
        }
      });

      (window as any).google.accounts.id.initialize({
        client_id: "791276530561-516epk75ca30hk173asit5cp3ftfj0bj",
        callback: handleGoogleSignIn,
      });

      (window as any).google.accounts.id.renderButton(
        document.getElementById("google-signin-button"),
        { theme: "outline", size: "large" },
      );
    }
  });
</script>

{#if !UserProfileData.loggedIn}
  <div id="google-signin-button"></div>
{/if}
{#if UserProfileData.loggedIn}
  <p>Welcome, {UserProfileData.name}!</p>
  <p>Email: {UserProfileData.email}</p>
{/if}

<style>
  #google-signin-button {
    margin: 5px;
    cursor: pointer;
    border: solid;
    padding: 2px;
    border-width: 2px;
    border-color: black;
    border-radius: 10px;
    transform: translate(0, -4px);
    transition: all 0.1s;
    box-shadow: 0px 4px black;
  }
  #google-signin-button:hover {
    transform: translate(0, -6px);
    box-shadow: 0px 6px black;
  }
  #google-signin-button:active {
    transform: translate(0, 0px);
    box-shadow: 0px 0px black;
  }
</style>
