const getUrls = async (id, service) => {
    try {
        const data = await service.getUrl(id);
        return data;
    }
    catch (error) {
        console.error("fetching failed:", error);
        return false;
    }
};
export default getUrls;
