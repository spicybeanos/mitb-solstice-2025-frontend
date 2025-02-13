import { backendURL } from "./Backend";

interface SolsticeUser {
    first_name: string;
    last_name: string;
    email_address: string;
    phone_number: string;
    mahe_registration_number: number;
    pass_id: string;
    id: string;
}
interface SolsticeUserPass{
    name: string,
    description: string,
    cost: string,
    id: string
}
export async function registerUser(user: SolsticeUser): Promise<SolsticeUser|null> {
    const res = await fetch(`${backendURL}/user`, {
        method: 'POST',
        headers:{
            "Content-type":"application/json"
        },
        body: JSON.stringify(user)
    });

    if (res.status === 200) {
        return (await res.json()) as SolsticeUser;
    }
    return null;
}
export async function getUserId(email:string) : Promise<string|null> {
    const res = await fetch(`${backendURL}/user/id?email_address=${encodeURIComponent(email)}`, {
        method: 'GET'
    });

    if (res.status === 200) {
        return (await res.json()) as string;
    }
    return null;
}
export async function getUserInfo(userId:string) : Promise<SolsticeUser|null> {
    const res = await fetch(`${backendURL}/user/${userId}`, {
        method: 'GET'
    });

    if (res.status === 200) {
        return (await res.json()) as SolsticeUser;
    }
    return null;
}
export async function getUserPassInfo(userId:string) : Promise<SolsticeUserPass | null> {
    const res = await fetch(`${backendURL}/user/${userId}/pass`, {
        method: 'GET',
    });

    if (res.status === 200) {
        return (await res.json()) as SolsticeUserPass;
    }
    return null;
}
export async function updateUserInfo(userId:string,info:SolsticeUser) : Promise<boolean> {
    const res = await fetch(`${backendURL}/user/${userId}`, {
        method: 'PATCH',
        headers:{
            "Content-type":"application/json"
        },
        body: JSON.stringify(info)
    });

    if (res.status === 200) {
        return true;
    }
    return false;
}