import { jsx as _jsx } from "react/jsx-runtime";
import { useSnackbarStore } from "../zustand/useSnackbarStore";
import { Snackbar, Alert } from "@mui/material";
const SnackBarComponentv2 = () => {
    const { isOpen, message, severity, hideSnackbar } = useSnackbarStore();
    return (_jsx(Snackbar, { open: isOpen, autoHideDuration: 3000, onClose: hideSnackbar, anchorOrigin: {
            vertical: "top",
            horizontal: "right",
        }, children: _jsx(Alert, { elevation: 6, variant: "filled", onClose: hideSnackbar, severity: severity, children: message }) }));
};
export default SnackBarComponentv2;
