import { AxiosError } from "axios";
import { BaseURl, UPDATE_PROFILE, USER_PROFILE } from "../constraint/ApiConstraint";
import ApiHelper from "../helper/ApiHelper"
import type { UserProfileResponse, UserUpdateResponse } from "../models/response/user.response"


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

export const updateUserProfile= async(formData: FormData): Promise<UserUpdateResponse>=> {
    try {
        const apiHelper= new ApiHelper(BaseURl);
        const response= await apiHelper.patchformdata(`${UPDATE_PROFILE}`, formData);
        
        return response as UserUpdateResponse;
    } catch (error) {
        if(error instanceof AxiosError){
            throw new AxiosError(error.message);
        }
        throw error;
    }
}