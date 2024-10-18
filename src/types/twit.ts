import {UserType} from "@/types/user";

export type TwitType = {
    id: string;
    createdAt: string;
    user: UserType;
    content: string;
    entities: Entities;
    likes_count: number;
}

type Hashtag = {
    text: string;
}

type Entities = {
    hashtags: Hashtag[];
}

