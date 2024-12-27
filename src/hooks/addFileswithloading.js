//@ts-nocheck
import { useMutation } from "@tanstack/react-query";
import axiosInstance from "../services/Http";
const addFileswithloading = (Tname, service) => {
    const mutation = useMutation((data) => axiosInstance.post(service.endpoint, data, {
        onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round(((progressEvent.loaded ?? 0) * 100) / (progressEvent.total ?? 1));
        },
    }));
    return mutation;
};
export default addFileswithloading;
