import { useQuery } from "@tanstack/react-query";
const getGlobal = (_Tname, queryKey, service, opts) => {
    return useQuery({
        queryKey: queryKey,
        queryFn: async () => {
            const data = await service.getall();
            return data;
        },
        ...opts,
    });
};
export default getGlobal;
