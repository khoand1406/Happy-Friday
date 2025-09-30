import { AxiosError } from "axios";
import { BaseURl, USER_PROFILE } from "../constraint/ApiConstraint";
import ApiHelper from "../helper/ApiHelper"
import type { UserProfileResponse } from "../models/response/user.response"

export const getUserProfile= async(): Promise<UserProfileResponse> => {
    try {
        const apiHelper= new ApiHelper(BaseURl);
        const response= await apiHelper.get(`${USER_PROFILE}`);
        return response as UserProfileResponse;
    } catch (error) {
        if(error instanceof AxiosError){
            throw new AxiosError(error.message);
        }
        throw error;
    }
}