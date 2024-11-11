
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

type TooltipPayload = {
    payload: ChartData;
};

type TooltipWithProviderPayload = {
    payload: ChartWithProviderData;
};

type TooltipBlockPayload = {
    payload: ChartBlockData;
};

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
