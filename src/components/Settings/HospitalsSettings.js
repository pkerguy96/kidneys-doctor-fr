import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, FormControl, TextField, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, IconButton, Paper, Typography, } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { CACHE_KEY_Hospitals } from "../../constants";
import getGlobal from "../../hooks/getGlobal";
import { hospitalApiClient } from "../../services/HospitalService";
import LoadingSpinner from "../LoadingSpinner";
import { useSnackbarStore } from "../../zustand/useSnackbarStore";
import deleteItem from "../../hooks/deleteItem";
import addGlobal from "../../hooks/addGlobal";
import { AxiosError } from "axios";
const HospitalsSettings = () => {
    const { showSnackbar } = useSnackbarStore();
    const addMutation = addGlobal({}, hospitalApiClient);
    const { data, refetch, isLoading } = getGlobal({}, CACHE_KEY_Hospitals, hospitalApiClient, undefined);
    const { control, formState: { errors }, handleSubmit, } = useForm({
        defaultValues: {
            name: "",
            address: "",
            contact_info: "",
        },
    });
    const onSubmit = async (data) => {
        await addMutation.mutateAsync(data, {
            onSuccess: () => {
                showSnackbar("Clinique a été créé", "success");
                refetch();
            },
            onError: (error) => {
                const message = error instanceof AxiosError
                    ? error.response?.data?.message
                    : error.message;
                showSnackbar(message, "error");
            },
        });
    };
    const onDelete = async (key) => {
        const response = await deleteItem(key, hospitalApiClient);
        if (response) {
            refetch();
            showSnackbar("La suppression de clinique a réussi", "success");
        }
        else {
            showSnackbar("La suppression de clinique a échoué", "error");
        }
    };
    if (isLoading)
        return _jsx(LoadingSpinner, {});
    return (_jsxs(Box, { className: "flex flex-col w-full gap-6", component: "form", onSubmit: handleSubmit(onSubmit), children: [_jsx(Box, { className: "flex justify-center", children: _jsx(Typography, { id: "modal-modal-title", component: "h2", className: "text-center !text-2xl font-medium", children: "Ajouter une clinique" }) }), _jsxs(Box, { className: " flex flex-col md:flex-row gap-4 flex-wrap", children: [_jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center ", children: [_jsx("label", { htmlFor: "name", className: "w-full md:w-[200px]", children: "Nom de clinique:" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { defaultValue: "", name: "name", control: control, render: ({ field }) => (_jsx(TextField, { ...field, id: "name", label: "h\u00F4pital" })) }) })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center", children: [_jsx("label", { htmlFor: "address", className: "w-full md:w-[200px]", children: "Adresse:" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "address", control: control, render: ({ field }) => (_jsx(TextField, { ...field, id: "address", type: "text", label: "Adresse" })) }) })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center", children: [_jsx("label", { htmlFor: "nom", className: "w-full md:w-[200px]", children: "Telephone:" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "contact_info", defaultValue: "", control: control, render: ({ field }) => (_jsx(TextField, { ...field, id: "contact_info", label: "Telephone" })) }) })] })] }), _jsx(Box, { className: "flex", children: _jsx(Button, { type: "submit", variant: "contained", className: "w-full md:w-max !px-10 !py-3 rounded-lg !ms-auto", children: "Ajouter" }) }), _jsx(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2", children: _jsx(TableContainer, { component: Paper, elevation: 0, className: "border border-gray-300", children: _jsxs(Table, { sx: { minWidth: 650 }, "aria-label": "simple table", children: [_jsx(TableHead, { className: "bg-gray-200", children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Nom" }), _jsx(TableCell, { children: "Adresse" }), _jsx(TableCell, { children: "Telephone" }), _jsx(TableCell, { width: 60, align: "center", children: "Action" })] }) }), _jsx(TableBody, { children: data?.length ? (data.map((row, index) => (_jsxs(TableRow, { className: "border-t border-gray-300", children: [_jsx(TableCell, { component: "th", scope: "row", children: row.name }), _jsx(TableCell, { component: "th", children: row.address }), _jsx(TableCell, { component: "th", children: row.contact_info }), _jsx(TableCell, { children: _jsx(IconButton, { onClick: () => onDelete(row.id), children: _jsx(DeleteOutlineIcon, { color: "error", className: "pointer-events-none", fill: "currentColor" }) }) })] }, index)))) : (_jsx(TableRow, { className: "border-t border-gray-300", children: _jsx(TableCell, { colSpan: 4, align: "center", className: "!text-gray-600 p-4", children: _jsx("p", { className: "text-lg", children: "D\u00E9sol\u00E9, aucune clinique pour le moment." }) }) })) })] }) }) })] }));
};
export default HospitalsSettings;
