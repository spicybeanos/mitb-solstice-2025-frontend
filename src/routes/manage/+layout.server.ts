import { verifyAndGetUser } from '$lib/server/Backend';
import { check_manage_Access } from '$lib/server/BackendAdmin.js';
import { generateChecksum } from '$lib/server/CacheMaster';
import { error, redirect } from '@sveltejs/kit';
import { CheckSquare } from 'lucide-svelte';

export async function load({ cookies }) {
    try {
        const jwt = cookies.get('authToken');
        const userJson = cookies.get('userInfo');
        const checksum = cookies.get('userChecksum');
        const canAccess = await check_manage_Access(jwt, userJson, checksum);
        if (userJson == null || checksum == null) {
            const user = await verifyAndGetUser(cookies.get('authToken'), userJson, checksum);
            if (user.result != null) {
                cookies.set('userInfo', JSON.stringify(user.result), {
                    httpOnly: false, // Accessible by frontend
                    secure: true,
                    sameSite: "strict",
                    path: "/",
                    maxAge:3600
                });
                cookies.set('userChecksum', generateChecksum(user.result), {
                    httpOnly: false, // Accessible by frontend
                    secure: true,
                    sameSite: "strict",
                    path: "/",
                    maxAge:3600
                });
            }
        }
        if (canAccess == false) { error(403, 'You do not have access to management functions') }
    } catch (err) {
        error(403, err as string);
    }
}