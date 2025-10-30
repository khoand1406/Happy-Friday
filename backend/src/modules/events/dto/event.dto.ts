export interface EventResponse {
  id: number;
  title: string;
  content: string;
  startdate: Date;
  enddate: Date;
  creatorid: string;
}

export interface EventDetailResponse {
  id: number;
  title: string;
  content: string;
  startDate: Date;
  endDate: Date;
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
  avatarUrl: string;
  jobTitle: string|null;
}

interface Invite {
  user_id: string;
  name: string;
  avatarUrl: string;
  email: string;
  jobTitle: string|null;
  department_name: string
  role_dep: string
  status: boolean;
  joined_at: Date | null;
}

export interface CreateEventRequest {
  title: string;
  content: string;
  startDate: string; // ISO string
  endDate: string;
  creatorId: string;
  invitees: string[]; // array of user ids
}

export interface CreateEventResponse {
  id: number;
  title: string;
  content: string;
  startDate: string; // ISO string
  endDate: string;
  creatorId: string;
}

export interface UpdateEventRequest {
  title?: string;
  content?: string;
  startDate: string;
  endDate: string;
  invitees?: string[];
}
