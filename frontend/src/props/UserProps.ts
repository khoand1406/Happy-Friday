export interface UserProfileProps {
  name: string;
  email: string;
  phone: string;
  department_name: string;
  avatar_url: string;
  projects: { project_id: number; project_name: string; description: number, status: string, project_role: string }[];
  
}
