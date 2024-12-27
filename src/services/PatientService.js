import { APIClient } from "./Http";
const patientAPIClient = new APIClient("/Patient");
export const patientTinyDataAPIClient = new APIClient("/patientTinyData");
export default patientAPIClient;
