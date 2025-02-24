import type { DateTime } from "@auth/core/providers/kakao";

export type EventType = 'cultural' | 'e_sports' | 'experiences' | 'finance' | 'hackathon' | 'other' | 'pro_show' | 'robotics' | 'sports' | 'technical';
export function isValidEvent(type: string): boolean {
    switch (type) {
        case 'cultural':
        case 'e_sports':
        case 'experiences':
        case 'finance':
        case 'hackathon':
        case 'other':
        case 'pro_show':
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
    organizer_id: string | null
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
    host_id: string;
    id: string;
}

export interface SolsticeUser {
    first_name: string;
    last_name: string;
    email_address: string;
    phone_number: string | null;
    mahe_registration_number: number | null;
    pass_id: string | null;
    id: string;
}