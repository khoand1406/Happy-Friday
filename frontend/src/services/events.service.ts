import { AxiosError } from "axios";
import type { CreateEventResponse, EventDetailResponse, EventResponse } from "../models/response/event.response";
import ApiHelper from "../helper/ApiHelper";
import { ACCEPT_EVENT, BaseURl, CREATE_EVENT, DELETE_EVENT, EVENT_DETAIL, EVENTS, REJECT_EVENT, UPDATE_EVENT } from "../constraint/ApiConstraint";
import type { CreateEventRequest, UpdateEventRequest } from "../models/request/event.request";

export const getEvents= async(startDate: string, endDate: string): Promise<EventResponse[]>=>{
    try{
        const apiHelper= new ApiHelper(BaseURl);
        const response= await apiHelper.get(EVENTS,{startDate, endDate});
        return response as EventResponse[]
    }catch(error){
        if(error instanceof AxiosError){
            throw new Error(error.response?.data.message || "Failed to fetch events");
        }
        throw error;
    }
}

export const getEventDetail= async(eventId: number): Promise<EventDetailResponse>=>{
    try {
        const apiHelper= new ApiHelper(BaseURl);
        const response= await apiHelper.get(EVENT_DETAIL(eventId));
        return response as EventDetailResponse;
    } catch (error) {
        if(error instanceof AxiosError){
            throw new Error(error.response?.data.message || "Failed to fetch event details");
        }
        throw error;
    }
}

export const createEvent= async(payload: CreateEventRequest): Promise<CreateEventResponse>=>{
    try {
        const apiHelper= new ApiHelper(BaseURl);
        const response= await apiHelper.post(CREATE_EVENT, payload);
        return response as CreateEventResponse;
    } catch (error) {
        if(error instanceof AxiosError){
            throw new Error(error.response?.data.message || "Failed to create event");
        }
        throw error;
    }
}

export const updateEvent= async(payload: UpdateEventRequest, eventId: number): Promise<any>=>{
    try {
        const apiHelper= new ApiHelper(BaseURl);
        const response= await apiHelper.patchJson(UPDATE_EVENT(eventId), payload);
        return response;
    } catch (error) {
        if(error instanceof AxiosError){
            throw new Error(error.response?.data.message || "Failed to reject event");
        }
        throw error;
    }
}

export const deleteEvent= async(eventId: number): Promise<any>=>{
    try {
        const apiHelper= new ApiHelper(BaseURl);
        const response= await apiHelper.delete(DELETE_EVENT(eventId));
        return response;
    } catch (error) {
        if(error instanceof AxiosError){
            throw new Error(error.response?.data.message || "Failed to delete event");
        }
        throw error;
    }
}

export const rejectEvent= async(eventId: number): Promise<any>=>{
    try {
        const apiHelper= new ApiHelper(BaseURl);
        const response= await apiHelper.patchJson(REJECT_EVENT(eventId), {});
        return response;
    } catch (error) {
        if(error instanceof AxiosError){
            throw new Error(error.response?.data.message || "Failed to reject event");
        }
        throw error;
    }
}

export const acceptEvent= async(eventId:number):Promise<any>=>{
    try {
        const apiHelper= new ApiHelper(BaseURl);
        const response= await apiHelper.patchJson(ACCEPT_EVENT(eventId), {});
        return response;
    } catch (error) {
        if(error instanceof AxiosError){
            throw new Error(error.response?.data.message || "Failed to accept event");
        }
        throw error;
    }
}