const deleteItem = async (id, service) => {
    try {
        await service.DeleteOne(id);
        return true; // Deletion was successful
    }
    catch (error) {
        return false; // Deletion failed
    }
};
export default deleteItem;
