export interface CreateEventRequest{
    title: string;
    content: string;
    startDate: string; // ISO string
  endDate: string;   
    invitees: string[]; // array of user ids
}



export interface UpdateEventRequest{
    title?: string;
    content?: string;
    startDate?: string;
    endDate?: string;
    invitees?: string[];
}