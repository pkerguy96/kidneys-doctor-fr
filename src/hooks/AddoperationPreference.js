import { useMutation, useQueryClient } from "@tanstack/react-query";
import { OperationPrefApiClient, } from "../services/SettingsService";
import { CACHE_KEY_OperationPref } from "../constants";
export const AddoperationPreference = (onAdd) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            return await OperationPrefApiClient.Postall(data, undefined);
        },
        onMutate: async (newData) => {
            const previousData = queryClient.getQueryData(CACHE_KEY_OperationPref) || [];
            queryClient.setQueryData(CACHE_KEY_OperationPref, (operations = []) => [...operations, newData]);
            onAdd();
            return { previousData };
        },
        onSuccess: (apiOperation, FormOperation) => {
            queryClient.setQueryData(CACHE_KEY_OperationPref, (operations) => operations?.map((operation) => {
                return operation.code === FormOperation.code
                    ? //@ts-ignore
                        apiOperation.data
                    : operation;
            }));
        },
        onError: (_error, _newOperation, context) => {
            if (!context)
                return;
            queryClient.setQueryData(CACHE_KEY_OperationPref, context.previousData);
        },
    });
};
