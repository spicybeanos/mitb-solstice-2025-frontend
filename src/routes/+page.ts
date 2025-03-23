import type { SolsticeEventInfo } from '$lib/server/BackendTypes';

export interface PageData {
    feature: SolsticeEventInfo[];
    medias: {
        success: boolean;
        result: any[];
    };
}