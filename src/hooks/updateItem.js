import { useMutation } from "@tanstack/react-query";
const updateItem = (_Tname, service) => {
    const mutation = useMutation((params) => {
        const { id, data } = params;
        return service.UpdateAll(data, id);
    });
    return mutation;
};
export default updateItem;
