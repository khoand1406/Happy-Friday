export interface InviteResponse{
    id: number
    userid: string
    eventId: number
    status:boolean
    joined_at: Date | null
    title: string
    content: string
    startDate: Date
    endDate: Date
    creatorId: string
    name: string
    avatarUrl: string
}