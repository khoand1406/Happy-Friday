import { AxiosError } from "axios";
import { BaseURl, SEARCH } from "../constraint/ApiConstraint";
import ApiHelper from "../helper/ApiHelper";
import type { SearchResponse } from "../models/response/search.response";

export const getSearchResult= async(searchQuery: string):Promise<SearchResponse[]> => {
    try {
        const apiHelper= new ApiHelper(BaseURl);
        const response= await apiHelper.get(SEARCH, {searchQuery});
        return response as SearchResponse[];
    } catch (error) {
        if(error instanceof AxiosError){
            throw new AxiosError(error.message);
        }
        throw error;
    }
}