import { BaseURl, PROJECTS, PROJECT_DETAIL, PROJECT_STATUS, PROJECT_UPDATES } from "../constraint/ApiConstraint";
import ApiHelper from "../helper/ApiHelper";

export type ProjectItem = {
  id: number;
  name: string;
  description: string;
  status: string;
  start_date?: string;
  end_date?: string;
};

export type ProjectDetailResponse = {
  project: ProjectItem;
  members: any[];
  updates: any[];
};

export type Paginated<T> = { items: T[]; total: number };

export const getProjects = async (params?: { page?: number; perpage?: number; status?: string; search?: string; }) => {
  const api = new ApiHelper(BaseURl);
  const query = new URLSearchParams();
  if (params?.page) query.append('page', String(params.page));
  if (params?.perpage) query.append('perpage', String(params.perpage));
  if (params?.status) query.append('status', params.status);
  if (params?.search) query.append('search', params.search);
  const endpoint = query.toString() ? `${PROJECTS}?${query.toString()}` : PROJECTS;
  const res = await api.get(endpoint);
  return res as Promise<Paginated<ProjectItem>>;
};

export const getProjectDetail = async (id: number | string) => {
  const api = new ApiHelper(BaseURl);
  return api.get(PROJECT_DETAIL(id)) as Promise<ProjectDetailResponse>;
};

export const createProject = async (payload: { name: string; description: string; status: string; start_date?: string; end_date?: string; }) => {
  const api = new ApiHelper(BaseURl);
  return api.post(PROJECTS, payload) as Promise<ProjectItem>;
};

export const updateProject = async (id: number | string, payload: Partial<{ name: string; description: string; status: string; start_date: string; end_date: string; }>) => {
  const api = new ApiHelper(BaseURl);
  return api.patch(PROJECT_DETAIL(id), payload);
};

export const updateProjectStatus = async (id: number | string, status: string) => {
  const api = new ApiHelper(BaseURl);
  return api.post(PROJECT_STATUS(id), { status });
};

export const getProjectUpdates = async (id: number | string) => {
  const api = new ApiHelper(BaseURl);
  return api.get(PROJECT_UPDATES(id));
};

export const postProjectUpdate = async (id: number | string, payload: { title: string; content: string }) => {
  const api = new ApiHelper(BaseURl);
  return api.post(PROJECT_UPDATES(id), payload);
};

export const deleteProject = async (id: number | string) => {
  const api = new ApiHelper(BaseURl);
  return api.delete(PROJECT_DETAIL(id));
};

export const removeProjectMember = async (projectId: number | string, userId: string) => {
  const api = new ApiHelper(BaseURl);
  return api.delete(`/api/projects/${projectId}/members/${userId}`);
};

export const removeProjectUpdate = async (projectId: number | string, updateId: number | string) => {
  const api = new ApiHelper(BaseURl);
  return api.delete(`/api/projects/${projectId}/updates/${updateId}`);
};

export const updateProjectUpdate = async (projectId: number | string, updateId: number | string, payload: { title: string; content: string }) => {
  const api = new ApiHelper(BaseURl);
  return api.patch(`/api/projects/${projectId}/updates/${updateId}`, payload);
};


