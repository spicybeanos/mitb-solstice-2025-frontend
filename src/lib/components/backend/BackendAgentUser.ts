import { backendURL } from "./Backend";

interface FalakUser {
    first_name: string;
    last_name: string;
    email_address: string;
    phone_number: string;
    mahe_registration_number: number;
    pass_id: string;
    id: string;
}
interface FalakUserPass{
    name: string,
    description: string,
    cost: string,
    id: string
}
export async function registerUser(user: FalakUser): Promise<FalakUser|null> {
    const res = await fetch(`${backendURL}/user`, {
        method: 'POST',
        body: JSON.stringify(user)
    });

    if (res.status === 200) {
        return (await res.json()) as FalakUser;
    }
    return null;
}
export async function getUserId(email:string) : Promise<string|null> {
    //wait for him to make the endpoint
    return null;
}
export async function getUserInfo(userId:string) : Promise<FalakUser|null> {
    const res = await fetch(`${backendURL}/user/${userId}`, {
        method: 'GET'
    });

    if (res.status === 200) {
        return (await res.json()) as FalakUser;
    }
    return null;
}
export async function getUserPassInfo(userId:string) : Promise<FalakUserPass | null> {
    const res = await fetch(`${backendURL}/user/${userId}/pass`, {
        method: 'GET',
    });

    if (res.status === 200) {
        return (await res.json()) as FalakUserPass;
    }
    return null;
}
export async function updateUserInfo(userId:string,info:FalakUser) : Promise<boolean> {
    const res = await fetch(`${backendURL}/user/${userId}`, {
        method: 'PATCH',
        body: JSON.stringify(info)
    });

    if (res.status === 200) {
        return true;
    }
    return false;
}