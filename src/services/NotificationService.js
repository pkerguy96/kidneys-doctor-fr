import { APIClient } from "./Http";
export const NotificationApiClient = new APIClient("/notification");
export const markAsReadApiClient = new APIClient("/notifications");
