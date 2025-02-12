export const UserProfileData = $state({
    name: '', email: '', picture: '', loggedIn: false, userID: '', registered: false
})
export const isSigningOut = $state({ status: false });

export async function checkLoggedIn(cookieJwt: string | undefined) {

    if (!isSigningOut.status) {
        if (cookieJwt == undefined) { return false; }
        if (cookieJwt === undefined) { return false; }
        if (cookieJwt === null) { return false; }
        if (cookieJwt == null) { return false; }
        if (cookieJwt === '') { return false; }
        if (cookieJwt == '') { return false; }

        try {
            let result = await fetch("/profile", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token: cookieJwt, action: 'login' }),
            });
            if (result.ok) {
                const gup = await result.json()
                UserProfileData.name = gup.name;
                UserProfileData.email = gup.email;
                UserProfileData.picture = gup.picture;
                UserProfileData.loggedIn = true;


                const reg = await fetch(`/profile/reg?email=${encodeURIComponent(gup.email)}`,{method:'GET'});

                if(reg.ok){
                    const rn = await reg.json();
                    UserProfileData.registered=true;
                    UserProfileData.userID=rn.message;
                }

                return true;
            }

            return false;
        }
        catch {
            return false;
        }
    }


}