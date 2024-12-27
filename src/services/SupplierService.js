import { APIClient } from "./Http";
export const SupplierApiClient = new APIClient("/Supplier");
export const SupplierNamesApiClient = new APIClient("/showAllSuppliers");
export const SupplierProductApiClient = new APIClient("/Supplierproduct");
