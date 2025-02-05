export const UserProfileData = $state({
    name: '', email: '', picture: '', loggedIn: false, userID: ''
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
                result.json().then((gup) => {
                    UserProfileData.name = gup.name;
                    UserProfileData.email = gup.email;
                    UserProfileData.picture = gup.picture;
                    UserProfileData.loggedIn = true;
                });
                return true;
            } else {
                return false;
            }
        }
        catch {
            return false;
        }
    }


}