import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Modal, Box, Typography, TextField, Button, IconButton, } from "@mui/material";
import ClearIcon from "@mui/icons-material/Clear";
import DeleteIcon from "@mui/icons-material/Delete";
import { APIClient } from "../services/Http";
import { AxiosError } from "axios";
import { CACHE_KEY_APPOINTMENTS } from "../constants";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbarStore } from "../zustand/useSnackbarStore";
const AppointmentConfirmation = ({ open, onClose, data, }) => {
    const queryClient = useQueryClient();
    const { showSnackbar } = useSnackbarStore();
    const [date, time] = data?.date.split("T");
    const deleteAppointement = async () => {
        try {
            const apiclient = new APIClient("Appointment");
            await apiclient.DeleteOne(data?.id);
            queryClient.invalidateQueries(CACHE_KEY_APPOINTMENTS);
            showSnackbar("Le rendez-vous est supprimé", "warning");
        }
        catch (error) {
            const message = error instanceof AxiosError
                ? error.response?.data?.message
                : error.message;
            showSnackbar(message, "error");
        }
    };
    return (_jsx(_Fragment, { children: _jsx(Modal, { open: open, onClose: onClose, "aria-labelledby": "modal-modal-title", "aria-describedby": "modal-modal-description", className: "flex justify-center items-center", children: _jsxs(Box, { sx: { width: 400, bgcolor: "background.paper", p: 2 }, className: "flex flex-col items-center gap-3 rounded-lg border-0", children: [_jsxs(Box, { className: " w-full flex flex-row justify-between", children: [_jsx(Typography, { id: "modal-modal-title", variant: "h6", component: "h2", children: "D\u00E9tails du rendez-vous" }), _jsx(IconButton, { onClick: () => onClose(), children: _jsx(ClearIcon, {}) })] }), _jsx(TextField, { fullWidth: true, label: "patient_name", id: "patient_name-text", value: data?.patient_name, disabled: true }), _jsx(TextField, { id: "large-text", label: "date", value: `${date}  ${time}`, disabled: true, fullWidth: true }), _jsx(TextField, { id: "large-text", label: "Note", multiline: true, value: data?.note ?? "", rows: 4, variant: "outlined", disabled: true, fullWidth: true }), _jsx(Box, { className: " mx-4 w-full flex gap-4 justify-center\t ", children: _jsx(Button, { variant: "contained", color: "error", size: "small", startIcon: _jsx(DeleteIcon, {}), onClick: deleteAppointement, children: "Supprimer" }) })] }) }) }));
};
export default AppointmentConfirmation;
