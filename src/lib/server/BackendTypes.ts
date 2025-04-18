import type { DateTime } from "@auth/core/providers/kakao";

export type EventType =
    'cultural' | 'e_sports' | 'experiences'
    | 'finance' | 'hackathon' | 'other' | 'robotics'
    | 'sports' | 'technical';
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
export interface Workshop {
    id: string;
    name: string;
    description: string;
    venue: string;
    club: string;
    date_from: string; // Using ISO string format
    date_to: string; // Using ISO string format
    image_url?: string | null;
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
    description: string,
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
export interface EventImages {
    thumbnail: string;
    background: string;
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
export interface UpdateSolsticeUser {
    first_name: string;
    last_name: string;
    email_address: string;
    phone_number: string | null;
    mahe_registration_number: number | null;
    pass_id: string | null;
}

export interface SolsticeTeamContent {
    [key: string]: SolsticeUser[];
}

export interface SolsticeEventRegRow {
    team_name: string,
    player_name: string,
    player_email: string,
    player_phno: string,
    player_reg: string,
    is_captain: boolean
}

export type CategoryType = 'Special request' |
    "Website" |
    "Passes" |
    "Payment" |
    "Other" |
    "Organisation" |
    "Contests/ Contest results" |
    'Event';
export type CategoryTypeServer =
    'contest' | 'event' | 'organization' | 'other' |
    'passes' | 'payment' | 'special_request' | 'website';

export interface ProblemTicket {
    name: string;
    description: string;
    college_name: string;
    problem: string;
    category: CategoryTypeServer;
    phone_number: string;
    id: string;
    email_address: string;
    timestamp: string;
    solved: boolean;
    solved_email_address: string | null,
    comment: string | null
}
export interface ProblemTicketNEW {
    name: string;
    description: string;
    college_name: string;
    problem: string;
    category: CategoryTypeServer;
    phone_number: string;
    email_address: string;
    timestamp: string;
    solved: boolean;
    solved_email_address: string | null,
    comment: string | null
}

/*
{
  "name": "string",
  "description": "string",
  "category": "contest",
  "timestamp": "2025-03-08T17:01:49.596Z",
  "solved": true,
  "college_name": "string",
  "email_address": "string",
  "phone_number": "string",
  "solved_email_address": "string",
  "comment": "string"
}
*/