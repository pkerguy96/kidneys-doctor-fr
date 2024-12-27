import { APIClient } from "../services/Http";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CACHE_KEY_PATIENTS } from "../constants";
const apiclient = new APIClient("/Patient");
//TODO : modify inptu date mm/yy to french
export const useAddPatientMutation = (onAdd) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data) => {
            return await apiclient.Postall(data, undefined);
        },
        onMutate: async (newPatient) => {
            const previousPatients = queryClient.getQueryData(CACHE_KEY_PATIENTS) || [];
            queryClient.setQueryData(CACHE_KEY_PATIENTS, (patients = []) => [newPatient, ...patients]);
            onAdd();
            return { previousPatients };
        },
        // apiPatient  we get from backend , formPatient is the client side
        onSuccess: (apiPatient, formPatient) => {
            queryClient.setQueryData(CACHE_KEY_PATIENTS, (patients) => patients?.map((patient) => {
                // @ts-ignore
                return patient.cin === formPatient.cin ? apiPatient.data : patient;
            }));
        },
        onError: (_error, _newPatient, context) => {
            if (!context)
                return;
            queryClient.setQueryData(CACHE_KEY_PATIENTS, context.previousPatients);
        },
    });
};
