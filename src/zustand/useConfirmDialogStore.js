import { create } from "zustand";
const useConfirmDialogStore = create((set) => ({
    message: "",
    onSubmit: undefined,
    close: () => set({ onSubmit: undefined }),
}));
export default useConfirmDialogStore;
