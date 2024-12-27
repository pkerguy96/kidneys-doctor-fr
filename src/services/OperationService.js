import { APIClient } from "./Http";
const operationApiClient = new APIClient("/Operation");
export const noteoperationApiClient = new APIClient("/storeOpNote");
export const incompletedOperationsApiClient = new APIClient("/recurringOperation");
export const finishtreatmentApiClient = new APIClient("/finishtreatment");
export const modifytreatmentApiClient = new APIClient("/modifyoperationtreatment");
export const PayementVerificationApiClient = new APIClient("PayementVerificationCheckout");
export default operationApiClient;
