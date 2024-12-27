import { useQuery } from "@tanstack/react-query";
const getGlobalById = (_Tname, queryKey, service, opts, id) => {
    return useQuery({
        queryKey: queryKey,
        queryFn: () => service.getById(id),
        ...opts,
    });
};
export default getGlobalById;
