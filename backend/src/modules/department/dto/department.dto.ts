export interface DepartmentResponse {
  department_id: number;
  department_name: string;
  leader: {
    user_id: string;
    name: string;
    phone: string;
    email: string;
    avatar_url: string;
  };
  members: MemberInfo[];
}

interface MemberInfo {
  user_id: string;
  name: string;
  phone: string;
  email: string;
  avatar_url: string;
}
