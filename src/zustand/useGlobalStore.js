import { create } from "zustand";
const useGlobalStore = create((set) => ({
    id: "",
    ordonanceId: "",
    operationId: "",
    setIds: (id, ordonanceId, operationId) => set((state) => ({ ...state, id, ordonanceId, operationId })),
    resetIds: () => set((state) => ({
        ...state,
        id: "",
        ordonanceId: "",
        operationId: "",
    })),
}));
export default useGlobalStore;
