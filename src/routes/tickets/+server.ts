import { getTicketsFromEmail } from "$lib/components/database";
import type { DateTime } from "@auth/core/providers/kakao";
import { json } from "@sveltejs/kit";

export interface Ticket {
    name: string,
    description: string,
    college: string,
    problem: string,
    category: string,
    phone: string,
    ticketID: string,
    email: string,
    timestamp: DateTime,
    solved:boolean
}

export function GET({ url }: { url: URL }) {
    const email = url.searchParams.get('email');

    if (!email) {
        return json({ success: false }, { status: 404 });
    }

    return json({ success: true, value: getTicketsFromEmail(email as string) }, { status: 201 });
}