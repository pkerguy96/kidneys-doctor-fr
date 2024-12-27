import { APIClient } from "../services/Http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CACHE_KEY_NURSES } from "../constants";
const apiclient = new APIClient("/Nurse");
export const useAddNurseMutation = (onAdd) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            return await apiclient.Postall(data, undefined);
        },
        onMutate: async (newNurse) => {
            const previousNurses = queryClient.getQueryData(CACHE_KEY_NURSES) || [];
            queryClient.setQueryData(CACHE_KEY_NURSES, (nurses = []) => [
                newNurse,
                ...nurses,
            ]);
            onAdd();
            return { previousNurses };
        },
        // apiPatient  we get from backend , formPatient is the client side
        onSuccess: (apiPatient, formPatient) => {
            queryClient.setQueryData(CACHE_KEY_NURSES, (nurses) => nurses?.map((nurse) => {
                // @ts-ignore
                return nurse.cin === formPatient.cin ? apiPatient.data : nurse;
            }));
        },
        onError: (_error, _newNurse, context) => {
            if (!context)
                return;
            queryClient.setQueryData(CACHE_KEY_NURSES, context.previousNurses);
        },
    });
};
