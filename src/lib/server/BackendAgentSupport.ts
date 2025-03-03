import { tick } from "svelte";
import { get, post, patch, del } from "./Backend.ts";
import type { CategoryType, ProblemTicket } from "./BackendTypes.ts";
import { addTicketToDB, getTicketBy_ID, getTicketsBy_Category, getTicketsFrom_Email, getUnsolved_Tickets, setTicket_Solved } from "./database.ts";

export async function createTicket(ticket: ProblemTicket) {
    const res = await post('support-ticket/', ticket);
    if (res.success == false) { return false; }
    return addTicketToDB(ticket)
}

export async function getTicketsFromEmail(email: string) {
    const res= await get('')
    return getTicketsFrom_Email(email)
}
export async function getUnsolvedTickets() {
    return getUnsolved_Tickets()
}

export async function getTicketByTicketID(id: string) {
    return getTicketBy_ID(id);
}
export async function getTicketsByCategory(category: CategoryType) {
    return getTicketsBy_Category(category);
}
export async function setTicketStatus(ticketID: string, solved: boolean, comment: string) {
    setTicket_Solved(ticketID, solved, comment);
}
