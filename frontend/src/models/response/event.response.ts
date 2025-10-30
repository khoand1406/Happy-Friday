export interface EventResponse{
    id: number;
    title: string;
    content: string;
    startdate: string;
    enddate: string;
    creatorid: string;
}

export interface EventDetailResponse{
    id: number;
    title: string;
    content: string;
    startDate: string;
    endDate: string;
    creatorId: string;
    creator: UserBasicInfo;
    attendees: Invite[];
}

interface UserBasicInfo {
  id: string;
  name: string;
  email: string
  department_name: string
  role_dep: string
  avatar_url: string;
  jobTitle: string|null
}

export interface Invite {
  user_id: string;
  name: string;
  avatar_url: string;
  email: string
  department_name: string
  role_dep: string
  status: boolean;
  joined_at: Date | null;
  jobTitle: string|null;
}

export interface CreateEventResponse{
    id: number;
    title: string;
    content: string;
    startDate: string;
    endDate: string;
    creatorId: string;
}

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