import { useMutation } from "@tanstack/react-query";
const addGlobal = (_Tname, service, options = {}) => {
    const mutation = useMutation((data) => service.Postall(data, options));
    return mutation;
};
export default addGlobal;
