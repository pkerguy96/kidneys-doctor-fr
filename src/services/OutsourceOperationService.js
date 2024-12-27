import { APIClient } from "./Http";
const SearchPatientApiClient = new APIClient("/searchPatients");
export const SearchHospitalApiClient = new APIClient("/searchHospitals");
