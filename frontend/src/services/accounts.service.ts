import ApiHelper from "../helper/ApiHelper";
import axios from "axios";
import { BaseURl, ACCOUNTS, ACCOUNT_DELETE, ACCOUNT_DISABLE, ACCOUNT_ENABLE, ACCOUNT_RESET_PASSWORD, ACCOUNT_UPDATE, ACCOUNT_BAN } from "../constraint/ApiConstraint";

export interface AccountItem {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  role_id?: number;
  department_id?: number;
  created_at?: string;
}

export interface CreateAccountRequest {
  email: string;
  password: string;
  full_name?: string;
  phone?: string;
  role_id?: number;
  department_id?: number;
}

export interface UpdateAccountRequest {
  full_name?: string;
  phone?: string;
  role_id?: number;
  department_id?: number;
}

const api = new ApiHelper(BaseURl);

export type Paginated<T> = { items: T[]; total: number };

export const listAccounts = async (page = 1, perpage = 10): Promise<Paginated<AccountItem>> => {
  const res = await api.get(`${ACCOUNTS}`, { page, perpage });
  return res as Paginated<AccountItem>;
};

export const createAccount = async (payload: CreateAccountRequest): Promise<AccountItem> => {
  const res = await api.postJson(`${ACCOUNTS}`, payload);
  return res as AccountItem;
};

export const updateAccount = async (id: string, payload: UpdateAccountRequest): Promise<AccountItem> => {
  const token = localStorage.getItem("accessToken");
  const res = await axios.patch(`${BaseURl}${ACCOUNT_UPDATE(id)}`, payload, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data as AccountItem;
};

export const updateAccountByEmail = async (email: string, payload: UpdateAccountRequest): Promise<AccountItem> => {
  const token = localStorage.getItem("accessToken");
  const res = await axios.patch(`${BaseURl}${ACCOUNTS}/by-email`, { email, ...payload }, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data as AccountItem;
};

export const enableAccount = async (id: string): Promise<any> => {
  return api.postJson(`${ACCOUNT_ENABLE(id)}`, {});
};

export const disableAccount = async (id: string): Promise<any> => {
  return api.postJson(`${ACCOUNT_DISABLE(id)}`, {});
};

export const banAccount = async (id: string, hours: number): Promise<any> => {
  return api.postJson(`${ACCOUNT_BAN(id)}`, { hours });
};

export const resetPassword = async (id: string, newPassword: string): Promise<any> => {
  return api.postJson(`${ACCOUNT_RESET_PASSWORD(id)}`, { newPassword });
};

export const deleteAccount = async (id: string): Promise<any> => {
  const token = localStorage.getItem("accessToken");
  const res = await axios.delete(`${BaseURl}${ACCOUNT_DELETE(id)}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const importAccounts = async (accounts: CreateAccountRequest[]): Promise<{
  success: number;
  failed: number;
  errors: string[];
}> => {
  const token = localStorage.getItem("accessToken");
  const res = await axios.post(`${BaseURl}${ACCOUNTS}/import`, { accounts }, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const scheduleDepartmentTransfer = async (payload: { user_id: string; to_department_id: number; effective_date: string; }) => {
  const token = localStorage.getItem("accessToken");
  const res = await axios.post(`${BaseURl}${ACCOUNTS}/transfer/schedule`, payload, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
};

export const applyDueTransfers = async () => {
  const token = localStorage.getItem("accessToken");
  const res = await axios.post(`${BaseURl}${ACCOUNTS}/transfer/apply-due`, {}, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data as { applied: number };
};


