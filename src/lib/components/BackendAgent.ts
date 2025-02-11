export const backendURL = "www.example.com";

interface DBUser {
    first_name: string;
    last_name: string;
    email_address: string;
    phone_number: string;
    mahe_registration_number: number;
    pass_id: string;
    id: string;
}

export async function registerEmail(email: string, user: DBUser) {
    const res = await fetch(`${backendURL}/user`, {
        method: 'POST',
        body: JSON.stringify(user)
    });

    if (res.status === 200) {
        return true;
    }
    return false;
}
export async function getUserId(email:string) {
    //wait for him to make the endpoint
}
export async function getUserInfo(userId:string) {
    const res = await fetch(`${backendURL}/user/${userId}`, {
        method: 'GET',
    });

    if (res.status === 200) {
        return true;
    }
    return false;
}