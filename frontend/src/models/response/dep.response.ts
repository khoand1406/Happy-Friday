export interface DepartmentResponse {
    id: number;
    name: string;
    memberCount: number;
    leader: {
        id: string,
        name: string,
        avatarUrl: string | null
        role: string
    }
}

