import { useQuery } from "@tanstack/react-query";
const getGlobalv2 = (_Tname, queryKey, service, page = 0, // Default page number
pageSize = 10, searchQuery, // Default page size
opts, filters) => {
    const paginatedQueryKey = [...queryKey, page, pageSize, searchQuery, filters]; // Append page and pageSize to the query key
    return useQuery({
        queryKey: paginatedQueryKey,
        queryFn: async () => {
            const response = await service.getalls(page, pageSize, searchQuery, filters);
            return response;
        },
        keepPreviousData: true,
        ...opts,
    });
};
export default getGlobalv2;
