import { AxiosError } from "axios";
import { BaseURl, DEPARTMENT_LIST } from "../constraint/ApiConstraint"
import ApiHelper from "../helper/ApiHelper"
import type { DepartmentResponse } from "../models/response/dep.response";

export const getDepartments = async() : Promise<DepartmentResponse[]>=>{
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