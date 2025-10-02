import { IsNotEmpty, IsPhoneNumber } from "class-validator";


export class UpdateUserProfileDTO{
    @IsNotEmpty()
    name: string

    @IsNotEmpty()
    @IsPhoneNumber("VN", {message: "Invalid phone number format"})
    phone: string

    avatar_url:string| undefined
}

export class UserProfileResponse{
    name: string;
    email: string;
    phone: string;
    department_name: string;
    avatar_url: string;
    projects: { project_id: number; project_name: string; description: number, status: string, project_role: string }[];
}