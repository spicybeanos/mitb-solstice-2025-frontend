import { tick } from "svelte";
import { get, post, patch, del } from "./Backend.ts";
import type { CategoryType, ProblemTicket } from "./BackendTypes.ts";
import { addTicketToDB, getTicketBy_ID, getTicketsBy_Category, getTicketsFrom_Email, getUnsolved_Tickets, setTicket_Solved } from "./database.ts";

export async function createTicket(ticket: ProblemTicket) {
    const res = await post('support-ticket/', ticket);
    if (res.success == false) { return false; }
}

export async function getTicketsFromEmail(email: string) {
    const res = await get(`support-ticket/email_address/ids?email_address=${encodeURIComponent(email)}`);
    if (res.success == true) {
        const ids = res.result as string[];
        let tickets: ProblemTicket[] = []
        for (const i of ids) {
            const t = await getTicketByTicketID(i);
            if (t != null) {
                tickets.push(t)
            }
        }

        return tickets;
    } else {
        return [];
    }
}
export async function getAllTickets() {
    const res = await get(`support-ticket/`);
    if (res.success) {
        return res.result as ProblemTicket[];
    } else {
        console.log(`Could not get all tickets : ${res.error}`)
        return null;
    }
}
export async function getUnsolvedTickets() {
    const ticks = await getAllTickets();
    if (ticks == null) { return []; }
    let un = [];
    for (const t of ticks) {
        if (t.solved == false) {
            un.push(t)
        }
    }
    return un;
}

export async function getTicketByTicketID(id: string) {
    const res = await get(`support-ticket/${id}`);
    if (res.success) { return res.result as ProblemTicket; } else { return null; }
}
export async function getTicketsByCategory(category: CategoryType) {
    const res = await get(`support-ticket/category/ids?category=${encodeURIComponent(category)}`);
    if (res.success == true) {
        const ids = res.result as string[];
        let ticks = [];
        for (const i of ids) {
            const t = await getTicketByTicketID(i);
            if (t != null) {
                ticks.push(t);
            }
        }
        return ticks;
    }
}
export async function setTicketStatus(ticketID: string, solved: boolean, comment: string) {
    
}
