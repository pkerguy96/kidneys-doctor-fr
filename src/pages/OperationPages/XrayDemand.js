import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
//@ts-nocheck
import { Autocomplete, Box, Button, Chip, FormControl, Paper, TextField, Typography, } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { BodySides, CACHE_KEY_XrayPreferences, ViewTypes, } from "../../constants";
import { useLocation, useNavigate } from "react-router";
import AddIcon from "@mui/icons-material/Add";
import addGlobal from "../../hooks/addGlobal";
import { xrayApiClient } from "../../services/XrayService";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useSnackbarStore } from "../../zustand/useSnackbarStore";
import getGlobal from "../../hooks/getGlobal";
import { XrayPreferenceApiClient, } from "../../services/SettingsService";
import LoadingSpinner from "../../components/LoadingSpinner";
import { useQueryClient } from "@tanstack/react-query";
import useOperationStore from "../../zustand/usePatientOperation";
const XrayDemand = ({ onNext }) => {
    const { addOrUpdateOperation, findPatientById } = useOperationStore();
    const queryClient = useQueryClient();
    const { showSnackbar } = useSnackbarStore();
    const addMutation = addGlobal({}, xrayApiClient, undefined);
    const { data, refetch, isLoading } = getGlobal({}, CACHE_KEY_XrayPreferences, XrayPreferenceApiClient, undefined);
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const patient_id = queryParams.get("id");
    const [xrays, setXrays] = useState([]);
    const patient = findPatientById(patient_id);
    if (!patient_id) {
        return (_jsx(Typography, { variant: "h6", color: "error", align: "center", children: "Quelque chose s'est mal pass\u00E9, veuillez refaire les \u00E9tapes, si cela ne fonctionne pas, signalez ce bug au d\u00E9veloppeur." }));
    }
    const { handleSubmit, control, formState: { errors }, getValues, setValue, reset, } = useForm();
    const onSubmit = async (data) => {
        const dataWithId = { ...xrays, patient_id };
        const payload = {
            patient_id,
            xrays,
            note: data.note, // Optional note
        };
        await addMutation.mutateAsync(payload, {
            onSuccess: (data) => {
                const operationId = data.data;
                navigate(`?id=${patient_id}&operation_id=${operationId}`, {
                    replace: true,
                });
                queryClient.invalidateQueries({
                    queryKey: ["Waitinglist"],
                    exact: false,
                });
                addOrUpdateOperation(operationId, patient_id);
                onNext();
            },
        });
    };
    const addRow = () => {
        const { body_side, view_type, xray_type } = getValues();
        if (!xray_type || !xray_type.length) {
            showSnackbar("Choisissez au moins une radiographie", "error");
            return;
        }
        if (!view_type || !view_type.length) {
            showSnackbar("Choisissez au moins un Type de vue", "error");
            return;
        }
        setXrays([...xrays, { body_side, view_type, xray_type, id: xrays.length }]);
        reset({ xray_type: [], view_type: [], body_side: [] });
    };
    const removeXRay = (id) => {
        setXrays((old) => old.filter((e) => e.id !== id));
    };
    useEffect(() => {
        if (patient) {
            const url = `/Patients/Xray?operation_id=${patient.operationId}&id=${patient.patientId}`;
            navigate(url, {
                replace: true,
            });
            //  window.history.replaceState(null, "", url);
            onNext(); // Proceed to the next step
        }
    }, [patient]);
    if (isLoading)
        return _jsx(LoadingSpinner, {});
    return (_jsx(Paper, { className: "!p-6 w-full flex flex-col gap-4", children: _jsxs(Box, { component: "form", noValidate: true, autoComplete: "off", onSubmit: handleSubmit(onSubmit), className: "flex flex-col gap-4", children: [_jsx(Box, { className: "lg:col-span-3 flex justify-between", children: _jsx(Typography, { id: "modal-modal-title", variant: "h6", component: "h2", children: "Radiographie demand\u00E9e" }) }), _jsxs(Box, { className: "flex gap-4 flex-wrap flex-col lg:flex-row lg:items-center", children: [_jsx(Box, { className: "w-full lg:w-0 lg:flex-1 flex flex-col gap-2 md:flex-row md:flex-wrap items-center", children: _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "xray_type", control: control, render: ({ field }) => (_jsx(Autocomplete, { className: "bg-white", multiple: true, id: "tags-filled", options: data.map((option) => option.xray_type), defaultValue: [], value: field.value || [], onChange: (event, newValue) => field.onChange(newValue), freeSolo: true, renderTags: (value, getTagProps) => value.map((option, index) => {
                                            const { key, ...tagProps } = getTagProps({ index });
                                            return (_jsx(Chip, { variant: "outlined", label: option, ...tagProps }, key));
                                        }), renderInput: (params) => (_jsx(TextField, { ...params, variant: "outlined", label: "Type de radiographie", sx: autocompleteStyles })) })) }) }) }), _jsx(Box, { className: "w-full lg:w-0 lg:flex-1 flex flex-col gap-2 md:flex-row md:flex-wrap items-center", children: _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "view_type", control: control, render: ({ field }) => (_jsx(Autocomplete, { className: "bg-white", multiple: true, id: "tags-filled", options: ViewTypes.map((option) => option.title), defaultValue: [], value: field.value || [], onChange: (event, newValue) => field.onChange(newValue), freeSolo: true, renderTags: (value, getTagProps) => value.map((option, index) => {
                                            const { key, ...tagProps } = getTagProps({ index });
                                            return (_jsx(Chip, { variant: "outlined", label: option, ...tagProps }, key));
                                        }), renderInput: (params) => (_jsx(TextField, { ...params, variant: "outlined", label: "Type de vue", sx: autocompleteStyles })) })) }) }) }), _jsx(Box, { className: "w-full lg:w-0 lg:flex-1 flex flex-col gap-2 md:flex-row md:flex-wrap items-center", children: _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "body_side", control: control, render: ({ field }) => (_jsx(Autocomplete, { className: "bg-white", multiple: true, id: "tags-filled", options: BodySides.map((option) => option.title), defaultValue: [], value: field.value || [], onChange: (event, newValue) => field.onChange(newValue), freeSolo: true, renderTags: (value, getTagProps) => value.map((option, index) => {
                                            const { key, ...tagProps } = getTagProps({ index });
                                            return (_jsx(Chip, { variant: "outlined", label: option, ...tagProps }, key));
                                        }), renderInput: (params) => (_jsx(TextField, { ...params, variant: "outlined", label: "C\u00F4t\u00E9 du corps", sx: autocompleteStyles })) })) }) }) }), _jsx(Button, { sx: { borderRadius: 16 }, variant: "outlined", className: "block !py-2", onClick: addRow, children: _jsx(AddIcon, {}) })] }), _jsx(Box, { children: _jsxs(Table, { children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Radiographie" }), _jsx(TableCell, { children: "Vue" }), _jsx(TableCell, { children: "C\u00F4t\u00E9" }), _jsx(TableCell, { style: { width: 100 }, align: "center", children: "Action" })] }) }), _jsx(TableBody, { children: xrays.map((row) => (_jsxs(TableRow, { children: [_jsx(TableCell, { component: "th", scope: "row", children: row.xray_type.join(", ") }), _jsx(TableCell, { children: row.view_type?.join(", ") }), _jsx(TableCell, { children: row.body_side?.join(", ") ?? "" }), _jsx(TableCell, { children: _jsx(Button, { onClick: () => removeXRay(row.id), children: _jsx(DeleteOutlineIcon, { color: "error", className: "pointer-events-none", fill: "currentColor" }) }) })] }, row.id))) })] }) }), _jsx(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center", children: _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "note", control: control, render: ({ field }) => (_jsx(TextField, { ...field, id: "outlined-required", multiline: true, rows: 3, label: "Note", error: !!errors.note, helperText: errors.note?.message })) }) }) }), _jsxs(Box, { className: "flex justify-between flex-row mt-5 content-center", children: [_jsx(Button, { className: "w-full md:w-max !px-10 !py-3 rounded-lg ", variant: "outlined", onClick: () => {
                                onNext();
                            }, children: _jsx("p", { className: "text-sm ", children: "Passer" }) }), _jsx(Button, { type: "submit", variant: "contained", className: "w-full md:w-max !px-10 !py-3 rounded-lg !ms-auto", children: "Enregistrer" })] })] }) }));
};
//TODO make this global
const autocompleteStyles = {
    "& .MuiOutlinedInput-root": {
        backgroundColor: "white",
        borderColor: "rgba(0, 0, 0, 0.23)",
        "& fieldset": {
            borderColor: "rgba(0, 0, 0, 0.23)",
        },
        "&:hover fieldset": {
            borderColor: "dark",
        },
        "&.Mui-focused fieldset": {
            borderColor: "primary.main",
        },
    },
};
export default XrayDemand;
