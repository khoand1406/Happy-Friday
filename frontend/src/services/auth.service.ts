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

export const getAzureProfile= async(accessToken: string)=>{
  const res = await fetch("https://graph.microsoft.com/v1.0/me", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const profile = await res.json();

  // Lấy ảnh đại diện (cần gọi endpoint khác)
  const photoRes = await fetch("https://graph.microsoft.com/v1.0/me/photo/$value", {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  const blob = await photoRes.blob();
  const avatarUrl = URL.createObjectURL(blob);

  return { name: profile.displayName, email: profile.mail, avatarUrl };
}