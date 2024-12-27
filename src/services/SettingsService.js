import { APIClient } from "./Http";
export const SettingsApiClient = new APIClient("DashboardKpiUserPref");
export const OperationPrefApiClient = new APIClient("OperationPreferences");
export const OperationsPrefApiClient = new APIClient("getOperationPrefs");
export const DeleteOperationsPrefApiClient = new APIClient("deleteOperationPrefs");
export const XrayPreferenceApiClient = new APIClient("XrayPreferences");
