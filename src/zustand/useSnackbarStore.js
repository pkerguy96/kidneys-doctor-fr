import { create } from "zustand";
export const useSnackbarStore = create((set) => ({
    isOpen: false,
    message: "",
    severity: "info",
    showSnackbar: (message, severity = "info") => {
        set({
            isOpen: true,
            message,
            severity,
        });
    },
    hideSnackbar: () => {
        set({
            isOpen: false,
            message: "",
            severity: "info",
        });
    },
}));
