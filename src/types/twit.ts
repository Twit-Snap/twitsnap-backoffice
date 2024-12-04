import {UserType} from "@/types/user";

export type TwitType = {
    id: string;
    createdAt: string;
    user: UserType;
    content: string;
    entities: Entities;
    likes_count: number;
    isBlocked: boolean;
}

type Hashtag = {
    text: string;
}

export type Entities = {
    hashtags: Hashtag[];
}

