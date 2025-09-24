import { BaseURl, LOGIN } from "../constraint/ApiConstraint";
import ApiHelper from "../helper/ApiHelper";
import type { AuthRequest } from "../models/request/auth/auth.request";
import type { AuthResponse } from "../models/response/auth.response";

export const authenticated = async (
  req: AuthRequest
): Promise<AuthResponse | null> => {
  const apiHelper = new ApiHelper(BaseURl);
  try {
    const response = await apiHelper.postJson(`${LOGIN}`, req);
    
    if (response?.access_token) {
      return response as AuthResponse;
    }
    return null;
  } catch (error) {
    console.error("Authentication error:", error);
    throw new Error("Error: "+ error)
  }
};