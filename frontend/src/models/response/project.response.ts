export interface ProjectResponse{
    project_id: number
    name: string
    description: string
    status: string
    start_date: Date
    end_date: Date
    current_role: string
    members: MemberRole[]
}

interface MemberRole{
    user_id: string
    project_role: string
}