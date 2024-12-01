interface ChartData {
    date: string;
    total: number;
    successCount: number;
    failureCount: number;
    averageTime: number;
}

interface ChartWithProviderData {
    date: string;
    successCount: number;
    successCountWithProvider: number;
}

interface ChartBlockData {
    date: string;
    blockedUsersCount: number;
}

interface ChartLocationData {
    country: string;
    amount: number;
}

interface CharTwitsData{
    date: string;
    total: number;
}

interface ChartHashtagData {
    date: string;
    hashtag: string;
    amount: number;
}

type TooltipPayload = {
    payload: ChartData;
};

type TooltipWithProviderPayload = {
    payload: ChartWithProviderData;
};

type TooltipBlockPayload = {
    payload: ChartBlockData;
};

type TooltipLocationPayload = {
    payload: ChartLocationData;
}

type TooltipTwitsPayload = {
    payload: CharTwitsData;
}

type TooltipHashtagPayload = {
    payload: ChartHashtagData;
}

export interface TooltipProps {
    active: boolean;
    payload: TooltipPayload[] | undefined;
}

export interface TooltipWithProviderProps {
    active: boolean;
    payload: TooltipWithProviderPayload[] | undefined;
}

export interface TooltipBlockProps {
    active: boolean;
    payload: TooltipBlockPayload[] | undefined;
}

export interface TooltipLocationProps {
    active: boolean;
    payload: TooltipLocationPayload[] | undefined;

}

export interface TooltipTwitsProps {
    active: boolean;
    payload: TooltipTwitsPayload[] | undefined;
}

export interface  TooltipHashtagProps {
    active: boolean;
    payload: TooltipHashtagPayload[] | undefined;
}
