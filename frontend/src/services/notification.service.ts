import { BaseURl, NOTIFICATIONS } from "../constraint/ApiConstraint"
import ApiHelper from "../helper/ApiHelper"
import type { NotificationResponse } from "../models/response/notification.response";

export const getNotifications= async(): Promise<NotificationResponse[]>=>{
    try {
        const apiHelper= new ApiHelper(BaseURl);
        const response= await apiHelper.get(NOTIFICATIONS);
        return response as NotificationResponse[]
    } catch (error) {
        throw error;
    }
}