import { CACHE_KEY_OperationPref } from "../constants";
import { OperationsPrefApiClient, } from "../services/SettingsService";
import getGlobal from "./getGlobal";
export const useGlobalOperationPreference = () => {
    const { data, refetch, isLoading } = getGlobal({}, CACHE_KEY_OperationPref, OperationsPrefApiClient, undefined);
    return { data, refetch, isLoading };
};
