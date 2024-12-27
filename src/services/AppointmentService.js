import { APIClient } from "./Http";
const appointmentAPIClient = new APIClient("/Appointment");
export const paginatedAppointmentApiClient = new APIClient("/GetAppointmentPagated");
export default appointmentAPIClient;
