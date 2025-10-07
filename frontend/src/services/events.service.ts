import { AxiosError } from "axios";

export const getEvents= async(startDate: string, endDate: string): Promise<any>=>{
    try{
        console.log("Fetching events from", startDate, "to", endDate);
    }catch(error){
        if(error instanceof AxiosError){
            throw new Error(error.response?.data.message || "Failed to fetch events");
        }
        throw error;
    }
}

export const getEventDetail= async(eventId: number): Promise<any>=>{
    try {
        console.log("Fetching details for event ID:", eventId);
    } catch (error) {
        if(error instanceof AxiosError){
            throw new Error(error.response?.data.message || "Failed to fetch event details");
        }
        throw error;
    }
}

export const createEvent= async(eventData: {content: string, description?: string, startDate: string, endDate: string}): Promise<any>=>{
    try {
        console.log("Creating event with data:", eventData);
    } catch (error) {
        
    }
}

export const rejectEvent= async(eventId: number): Promise<void>=>{
    try {
        console.log("Rejecting event ID:", eventId);
    } catch (error) {
        
    }}