import type { DateTime } from "@auth/core/providers/kakao";

export type EventType = 'cultural' | 'e_sports' | 'experiences' | 'finance' | 'hackathon' | 'other' | 'robotics' | 'sports' | 'technical';
export function isValidEvent(type: string): boolean {
    switch (type) {
        case 'cultural':
        case 'e_sports':
        case 'experiences':
        case 'finance':
        case 'hackathon':
        case 'other':
        case 'robotics':
        case 'sports':
        case 'technical':
            return true
            break;

        default:
            return false;
            break;
    }
}
export interface SolsticeEventInfo {
    name: string,
    description: string | null,
    type: EventType,
    team_members: number | null,
    start: DateTime | null,
    venue: string | null,
    id: string,
    organizer_id: UserID | null
}
export interface UpdateEvent {
    name: string,
    description:string,
    type: EventType,
    team_members: number | null,
    start: DateTime,
    venue: string,
    organizer_id: string | null
}

export interface SolsticePassInfo {
    name: string;
    description: string | null;
    cost: string;
    id: string;
}

export interface SolsticeTeamInfo {
    name: string;
    host_id: UserID;
    id: string;
}
export type UserID = string;
export interface SolsticeUser {
    first_name: string;
    last_name: string;
    email_address: string;
    phone_number: string | null;
    mahe_registration_number: number | null;
    pass_id: string | null;
    id: UserID;
}

export interface SolsticeEventRegRow{
    team_name:string,
    player_name:string,
    player_email:string,
    player_phno:string,
    player_reg:string,
    is_captain:boolean
}

export type CategoryType = 'Special request' |
    "Website" |
    "Passes" |
    "Payment" |
    "Other" |
    "Organisation" |
    "Contests/ Contest results" |
    'Event';
export interface ProblemTicket {
    name: string;
    description: string;
    college: string;
    problem: string;
    category: CategoryType;
    phone: string;
    ticketID: string;
    email: string;
    timestamp: string;
    solved: boolean;
    solved_by_email: string | null,
    comment:string | null
}