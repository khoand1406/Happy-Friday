import { AxiosError } from "axios";
import { BaseURl, DEPARTMENT_DETAIL, DEPARTMENT_LIST, LIST_DEP } from "../constraint/ApiConstraint"
import ApiHelper from "../helper/ApiHelper"
import type { DepartmentRes, DepartmentResponse } from "../models/response/dep.response";

export const getDepartments = async() : Promise<DepartmentRes[]>=>{
    try {
        const apiHelper= new ApiHelper(BaseURl);
        const response= await apiHelper.get(`${DEPARTMENT_LIST}`)
        return response;
    } catch (error) {
        if(error instanceof AxiosError){
            throw new Error(error.response?.data.message || "Failed to fetch departments");
        }
        throw error;
    }
}

export const getDepartment= async(id: number):Promise<DepartmentRes[]>=>{
    try {
        const apiHelper= new ApiHelper(BaseURl);
        const response= await apiHelper.get(DEPARTMENT_DETAIL(id));
        return response as DepartmentRes[]
    } catch (error) {
        if(error instanceof AxiosError){
            throw new Error(error.response?.data.message || "Failed to fetch departments");
        }
        throw error;
    }
}

export const getDepartmentList= async():Promise<DepartmentResponse[]>=> {
    try{
        const apiHelper= new ApiHelper(BaseURl);
        const response= await apiHelper.get(`${LIST_DEP}`);
        return response as DepartmentResponse[]
    }catch(error){
        if(error instanceof AxiosError){
            throw new Error(error.response?.data.message || "Failed to fetch departments");
        }
        throw error;
    }
}