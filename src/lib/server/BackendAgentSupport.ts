import { get, post, patch, del } from "./Backend.ts";
import type { ProblemTicket } from "./BackendTypes.ts";
import { addTicketToDB, getTicketByID, getTicketsFromEmail, setTicketSolved } from "./database.ts";

export async function createTicket(ticket:ProblemTicket){
    //post(`support-ticket/`,ticket)
    return addTicketToDB(ticket)
}

export async function getTicketsFrom_email(email:string) {
    return getTicketsFromEmail(email)
}

export async function getTicketByTicketID(id:string) {
    return getTicketByID(id);
}

export async function setTicketStatus(ticketID:string,solved:boolean) {
    setTicketSolved(ticketID,solved);
}