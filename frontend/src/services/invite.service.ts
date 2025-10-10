import { AxiosError } from "axios";
import { BaseURl } from "../constraint/ApiConstraint";
import ApiHelper from "../helper/ApiHelper";
import type { InviteResponse } from "../models/response/event.response";

export const getInvites = async (): Promise<InviteResponse[]> => {
  try {
    const apiHelper = new ApiHelper(BaseURl);
    const response = await apiHelper.get("/invites");
    return response as InviteResponse[];
  } catch (error) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || "Failed to fetch invites");
    }
    throw error;
  }
};
