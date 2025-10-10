export interface EventResponse{
    id: number;
    title: string;
    content: string;
    startDate: Date;
    endDate: Date;
    creatorId: string;
}

export interface EventDetailResponse{
    id: number;
    title: string;
    content: string;
    startDate: Date;
    endDate: Date;
    creatorId: string;
    creator: UserBasicInfo;
    attendees: Invite[];
}

interface UserBasicInfo{
    id: string;
    name: string;
    avatarUrl: string;
}

interface Invite{
    user_id: string;
    name: string;
    avatarUrl: string;
    status: boolean;
    joined_at: Date | null;
}

export interface CreateEventRequest{
    title: string;
    content: string;
    startDate: Date;
    endDate: Date;
    creatorId: string
    invitees: string[]; // array of user ids
}

export interface CreateEventResponse{
    id: number;
    title: string;
    content: string;
    startDate: Date;
    endDate: Date;
    creatorId: string;
}

export interface UpdateEventRequest{
    title?: string;
    content?: string;
    startDate?: Date;
    endDate?: Date;
    invitees?: string[];
}