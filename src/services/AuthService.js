import { APIClient } from "./Http";
export const AuthServiceClient = new APIClient("/login");
export const ChangePasswordApiClient = new APIClient("/changePassword");
export const ChangePasswordServiceClient = new APIClient("/reset");
export const ResetPasswordServiceClient = new APIClient("/resetlink");
export const AuthProfileServiceClient = new APIClient("/Admin/update/profile");
