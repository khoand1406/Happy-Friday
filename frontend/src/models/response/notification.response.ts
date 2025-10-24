export interface NotificationResponse{
    id: number,
    user_id: string,
    type: string,
    title: string,
    content: string,
    is_read: boolean,
    created_at: Date,
    eventId: number
    status: boolean
}