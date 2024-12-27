import { APIClient } from "./Http";
export const waitingRoomApiClient = new APIClient("Waitingroom");
export const incrementPatientApiClient = new APIClient("incrementPatient");
export const decrementPatientApiClient = new APIClient("decrementPatient");
export const FetchPatientsWaitingRoom = new APIClient("PatientsWaitingRoom");
export const FetchWaitingList = new APIClient("GetWaitingList");
export const tvWaitingListApiClient = new APIClient("tvwaitinglist");
export const clearPatientCounterApiClient = new APIClient("resetPatientCounter");
