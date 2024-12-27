//@ts-nocheck
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { APIClient } from "../services/Http";
import { CACHE_KEY_PATIENTS } from "../constants";
const apiclient = new APIClient("/Patient");
const updatePatient = (onUpdate) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ data, id }) => {
            const response = await apiclient.UpdateAll(data, id);
            return response.data; // Return the updated patient data
        },
        onMutate: async ({ data, id }) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries(CACHE_KEY_PATIENTS);
            // Snapshot the previous value
            const previousPatients = queryClient.getQueryData(CACHE_KEY_PATIENTS);
            // Optimistically update to the new value
            queryClient.setQueryData(CACHE_KEY_PATIENTS, (patients = []) => patients.map((patient) => patient.id === +id ? { ...patient, ...data } : patient));
            onUpdate();
            // Return the snapshot value for rollback
            return { previousPatients };
        },
        onSuccess: (_updatedData) => {
            queryClient.getQueryData(CACHE_KEY_PATIENTS);
        },
        onError: (error, _newPatient, context) => {
            console.error("Mutation error:", error);
            if (context?.previousPatients) {
                queryClient.setQueryData(CACHE_KEY_PATIENTS, context.previousPatients);
            }
        },
    });
};
export default updatePatient;
