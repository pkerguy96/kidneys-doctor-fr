import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
//@ts-nocheck
import { Box, Button, FormControl, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, IconButton, } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { AddoperationPreference } from "../../hooks/AddoperationPreference";
import { OperationPrefApiClient, } from "../../services/SettingsService";
import deleteItem from "../../hooks/deleteItem";
import { useSnackbarStore } from "../../zustand/useSnackbarStore";
import LoadingSpinner from "../LoadingSpinner";
import { AxiosError } from "axios";
import getGlobal from "../../hooks/getGlobal";
import { CACHE_KEY_OperationPref } from "../../constants";
import addGlobal from "../../hooks/addGlobal";
const OperationsListSettings = () => {
    const { showSnackbar } = useSnackbarStore();
    const { data, refetch, isLoading } = getGlobal({}, CACHE_KEY_OperationPref, OperationPrefApiClient, undefined);
    const { control, handleSubmit, reset } = useForm();
    const Addmutation = addGlobal({}, OperationPrefApiClient);
    const addOperationMutation = AddoperationPreference(() => {
        reset({
            name: "",
            price: 0.0,
            code: "",
        });
    });
    const onSubmit = async (data) => {
        await Addmutation.mutateAsync({
            code: data.code,
            price: data.price,
            operation_type: data.name,
        }, {
            onSuccess: () => {
                showSnackbar("L'Opération a été créé", "success");
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
        const response = await deleteItem(key, OperationPrefApiClient);
        if (response) {
            refetch();
            showSnackbar("La suppression d'Opération a réussi", "success");
        }
        else {
            showSnackbar("La suppression d'Opération a échoué", "error");
        }
    };
    if (isLoading)
        return _jsx(LoadingSpinner, {});
    return (_jsxs(Box, { className: "flex flex-col w-full gap-6", component: "form", onSubmit: handleSubmit(onSubmit), children: [_jsx(Box, { className: "flex justify-center", children: _jsx(Typography, { id: "modal-modal-title", component: "h2", className: "text-center !text-2xl font-medium", children: "Ajouter une op\u00E9ration" }) }), _jsxs(Box, { className: " flex flex-col md:flex-row gap-4 flex-wrap ", children: [_jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center ", children: [_jsx("label", { htmlFor: "nom", className: "w-full md:w-[200px]", children: "Op\u00E9ration:" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { defaultValue: "", name: "name", control: control, render: ({ field }) => (_jsx(TextField, { ...field, id: "name", label: "Op\u00E9ration" })) }) })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center", children: [_jsx("label", { htmlFor: "nom", className: "w-full md:w-[200px]", children: "Prix:" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller
                                //@ts-ignore
                                , { 
                                    //@ts-ignore
                                    defaultValue: 0.0, name: "price", control: control, render: ({ field }) => (_jsx(TextField, { ...field, id: "price", type: "number", label: "Prix" })) }) })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center", children: [_jsx("label", { htmlFor: "nom", className: "w-full md:w-[200px]", children: "Code:" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "code", defaultValue: "", control: control, render: ({ field }) => (_jsx(TextField, { ...field, id: "code", label: "Code" })) }) })] })] }), _jsx(Box, { className: "flex", children: _jsx(Button, { type: "submit", variant: "contained", className: "w-full md:w-max !px-10 !py-3 rounded-lg !ms-auto", children: "Ajouter" }) }), _jsx(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2", children: _jsx(TableContainer, { component: Paper, elevation: 0, className: "border border-gray-300", children: _jsxs(Table, { sx: { minWidth: 650 }, "aria-label": "simple table", children: [_jsx(TableHead, { className: "bg-gray-200", children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Nom" }), _jsx(TableCell, { width: 200, children: "code" }), _jsx(TableCell, { width: 200, children: "Prix" }), _jsx(TableCell, { width: 60, align: "center", children: "Action" })] }) }), _jsx(TableBody, { children: data?.length ? (data.map((row, index) => (_jsxs(TableRow, { className: "border-t border-gray-300", children: [_jsx(TableCell, { component: "th", scope: "row", children: row.operation_type }), _jsx(TableCell, { component: "th", children: row.code }), _jsx(TableCell, { component: "th", children: row.price }), _jsx(TableCell, { children: _jsx(IconButton, { onClick: () => onDelete(row.id), children: _jsx(DeleteOutlineIcon, { color: "error", className: "pointer-events-none", fill: "currentColor" }) }) })] }, index)))) : (_jsx(TableRow, { className: "border-t border-gray-300", children: _jsx(TableCell, { colSpan: 4, align: "center", className: "!text-gray-600 p-4", children: _jsx("p", { className: "text-lg", children: "D\u00E9sol\u00E9, aucune operation pour le moment." }) }) })) })] }) }) })] }));
};
export default OperationsListSettings;
