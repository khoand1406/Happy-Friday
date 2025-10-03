export interface UserProfileResponse{
    name: string;
    email: string;
    phone: string;
    department_name: string;
    avatar_url: string;
    projects: { project_id: number; project_name: string; description: number, status: string, project_role: string }[];
}

export interface UserUpdateResponse{
    id: string;
    created_at: Date
    name: string;
    phone: string;
    role_id: number;
    department_id: number;
    avatar_url: string;
}

export interface UserResponse{
    user_id: string;
    name: string;
    phone: string;
    email: string
    department_id: number;
    department_name: string
    avatar_url: string;
}