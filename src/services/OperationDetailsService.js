import { APIClient } from "./Http";
const operationDetailsApiClient = new APIClient("/getByOperationId");
export const deleteoperationdetailsApiclient = new APIClient("/deletePaymentDetail");
export default operationDetailsApiClient;
