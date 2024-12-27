import { APIClient } from "./Http";
export const StockApiClient = new APIClient("/Stock");
export const productOperationApiClient = new APIClient("/getProductsForOperation");
export const productconsumedApiClient = new APIClient("/consumables");
