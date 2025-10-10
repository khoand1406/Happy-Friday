import { AxiosError } from "axios";
import { BaseURl, CHANGE_PASSWORD, MEMBER_LIST, MEMBERS, UPDATE_PROFILE, USER_PROFILE } from "../constraint/ApiConstraint";
import ApiHelper from "../helper/ApiHelper"
import type { UserBasicRespone, UserProfileResponse, UserResponse, UserUpdateResponse } from "../models/response/user.response"
import type { ChangePasswordRequest } from "../models/request/auth/auth.request";
import type { ChangePasswordResponse } from "../models/response/auth.response";


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

export const changePassword= async(model: ChangePasswordRequest): Promise<ChangePasswordResponse> => {
    try {
        const apiHelper= new ApiHelper(BaseURl);
        const response= await apiHelper.post(`${CHANGE_PASSWORD}`, model);
        return response as ChangePasswordResponse
    } catch (error) {
        if(error instanceof AxiosError){
            throw error;
        }
        
        throw error;
    }
}

export const getMemberByDep= async(depid: number): Promise<UserResponse[]>=>{
    try {
        const apiHelper= new ApiHelper(BaseURl);
        const response= await apiHelper.get(`${MEMBER_LIST(depid)}`);
        return response as UserResponse[];
    } catch (error) {
        if(error instanceof AxiosError){
            throw error;
        }
        throw error;
    }
}

export const getMembers= async(): Promise<UserBasicRespone[]>=> {
    try {
        const apiHelper= new ApiHelper(BaseURl);
        const response= await apiHelper.get(MEMBERS);
        return response;
    } catch (error) {
        if(error instanceof AxiosError){
            throw error;
        }
        throw error;
    }
}