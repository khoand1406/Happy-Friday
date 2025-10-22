export interface NotificationResponse{
    id: number,
    user_id: string,
    type: string,
    title: string,
    content: string,
    is_read: boolean,
    created_at: Date,
    eventId: number|0
}

export interface CreateNotificationRequest{
    user_id: string,
    type: string,
    title: string,
    content: string,
    is_read: boolean,
    created_at: Date
    eventId: number| 0
}