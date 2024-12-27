import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Paper, Box, Typography, TextField, Button, Tooltip, IconButton, } from "@mui/material";
import { LocalizationProvider, DateTimePicker, } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import moment from "moment";
import { useRef, useState } from "react";
import { CACHE_KEY_PATIENTS } from "../../constants";
import getGlobalById from "../../hooks/getGlobalById";
import patientAPIClient from "../../services/PatientService";
import addGlobal from "../../hooks/addGlobal";
import appointmentAPIClient from "../../services/AppointmentService";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useSnackbarStore } from "../../zustand/useSnackbarStore";
import { AxiosError } from "axios";
import { useLocation, useNavigate } from "react-router";
import KeyboardBackspaceOutlinedIcon from "@mui/icons-material/KeyboardBackspaceOutlined";
const AppointmentStepPage = ({ onNext, onBack, }) => {
    const [selectedDateTime, setSelectedDateTime] = useState(moment());
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const patient_id = queryParams.get("id");
    const { showSnackbar } = useSnackbarStore();
    const noteRef = useRef(null);
    const dateTimePickerRef = useRef(null);
    if (!patient_id) {
        throw new Error("Patient ID is required and must not be null");
    }
    const { data, isLoading } = getGlobalById({}, [CACHE_KEY_PATIENTS[0], patient_id], patientAPIClient, undefined, parseInt(patient_id));
    const Addmutation = addGlobal({}, appointmentAPIClient);
    if (isLoading)
        return _jsx(LoadingSpinner, {});
    const handleDateTimeChange = (value, _context) => {
        if (value !== null) {
            setSelectedDateTime(value);
        }
        else {
            return;
        }
    };
    const onsubmit = async (e) => {
        e.preventDefault();
        // Frontend validation for the date field
        if (!selectedDateTime) {
            showSnackbar("Veuillez sélectionner une date.", "error");
            return;
        }
        const formData = {
            patient_id: parseInt(patient_id),
            date: selectedDateTime.format("YYYY-MM-DDTHH:mm:ss"),
            note: noteRef?.current?.value,
        };
        await Addmutation.mutateAsync(formData, {
            onSuccess: () => {
                const currentParams = new URLSearchParams(location.search);
                currentParams.set("isdone", "0");
                navigate(`${location.pathname}?${currentParams.toString()}`, {
                    replace: true,
                });
                onNext();
            },
            onError: (error) => {
                const message = error instanceof AxiosError
                    ? error.response?.data?.message
                    : error.message;
                showSnackbar(message, "error");
            },
        });
    };
    return (_jsx("div", { children: _jsxs(Paper, { className: "!p-6 w-full flex flex-col gap-6", children: [_jsxs(Box, { className: "flex justify-center relative", children: [_jsx(Tooltip, { title: "Retour", children: _jsx(IconButton, { className: "!absolute -top-1 left-0", onClick: onBack, children: _jsx(KeyboardBackspaceOutlinedIcon, { color: "primary", className: "pointer-events-none", fill: "currentColor" }) }) }), _jsx(Typography, { id: "modal-modal-title", component: "h2", className: "text-center !text-2xl font-bold", children: "Ajouter un rendez-vous ?" })] }), _jsxs(Box, { className: "flex gap-4 flex-col", children: [_jsx(TextField, { fullWidth: true, id: "name", value: `${data.nom} ${data.prenom}`, disabled: true }), _jsx(LocalizationProvider, { dateAdapter: AdapterMoment, children: _jsx(DateTimePicker, { value: selectedDateTime, ampm: false, onChange: handleDateTimeChange, inputRef: dateTimePickerRef }) }), _jsx(TextField, { inputRef: noteRef, id: "large-text", label: "Note", multiline: true, rows: 4, variant: "outlined", fullWidth: true })] }), _jsxs(Box, { className: "flex justify-between flex-row content-center", children: [_jsx(Button, { className: "w-full md:w-max !px-10 !py-3 rounded-lg ", variant: "outlined", onClick: () => {
                                onNext();
                            }, children: _jsx("p", { className: "text-sm ", children: "Passer" }) }), _jsx(Button, { onClick: onsubmit, variant: "contained", className: "w-full md:w-max !px-10 !py-3 rounded-lg !ms-auto", children: "Confirmer" })] })] }) }));
};
export default AppointmentStepPage;
