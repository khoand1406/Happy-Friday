import type { UserUpdateResponse } from "../models/response/user.response";

export interface UserProfileProps {
  name: string;
  email: string;
  phone: string;
  department_name: string | undefined;
  avatar_url: string ;
  projects: { project_id: number; project_name: string; description: number, status: string, project_role: string }[] | undefined;
  updateSubmit: (formData: FormData)=> Promise<UserUpdateResponse>
  
}
