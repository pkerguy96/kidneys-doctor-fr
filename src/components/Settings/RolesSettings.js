import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
//@ts-nocheck
import { Box, Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Typography, } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useCallback, useRef } from "react";
import addGlobal from "../../hooks/addGlobal";
import { CreateRoleApiClient, DeleteRoleApiClient, getUsersWithRolesClient, } from "../../services/RolesService";
import { useSnackbarStore } from "../../zustand/useSnackbarStore";
import { AxiosError } from "axios";
import getGlobal from "../../hooks/getGlobal";
import { CACHE_KEY_UsersRolePermission } from "../../constants";
import LoadingSpinner from "../LoadingSpinner";
import deleteItem from "../../hooks/deleteItem";
const RolesSettings = () => {
    const useref = useRef(null);
    const Addmutation = addGlobal({}, CreateRoleApiClient);
    const { data, isLoading, refetch } = getGlobal({}, CACHE_KEY_UsersRolePermission, getUsersWithRolesClient, undefined);
    const { showSnackbar } = useSnackbarStore();
    const onSubmit = async () => {
        const value = useref?.current?.value;
        if (value) {
            await Addmutation.mutateAsync({ rolename: value }, {
                onSuccess(data) {
                    showSnackbar(data?.message, "success");
                    refetch();
                },
                onError(error) {
                    const message = error instanceof AxiosError
                        ? error.response?.data?.message
                        : error.message;
                    showSnackbar(message, "error");
                },
            });
        }
        else {
            showSnackbar("fill the form first", "error");
        }
    };
    const deleteRole = useCallback(async ($id) => {
        const roledelte = await deleteItem($id, DeleteRoleApiClient);
        if (roledelte) {
            showSnackbar("Le rôle a été supprimé.", "info");
            refetch();
        }
        else {
            showSnackbar("Oups, quelque chose s'est mal passé.", "error");
        }
    }, []);
    if (isLoading)
        return _jsx(LoadingSpinner, {});
    return (_jsxs(Box, { className: "flex flex-col w-full gap-6", component: "form", children: [_jsx(Box, { className: "flex justify-center", children: _jsx(Typography, { id: "modal-modal-title", component: "h2", className: "text-center !text-2xl font-medium", children: "Gestion des R\u00F4les" }) }), _jsx(Box, { className: " flex flex-col md:flex-row gap-4 flex-wrap ", children: _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center ", children: [_jsx("label", { htmlFor: "nom", className: "w-full md:w-[200px]", children: "R\u00F4le:" }), _jsx(Box, { className: "w-full md:flex-1", children: _jsx(TextField, { inputRef: useref, name: "rolename", fullWidth: true, id: "outlined-basic", label: "Role", variant: "outlined" }) })] }) }), _jsx(Box, { className: "flex", children: _jsx(Button, { onClick: () => onSubmit(), variant: "contained", className: "w-full md:w-max !px-10 !py-3 rounded-lg !ms-auto", children: "Ajouter" }) }), _jsx(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2", children: _jsx(TableContainer, { component: Paper, elevation: 0, className: "border border-gray-300", children: _jsxs(Table, { sx: { minWidth: 650 }, "aria-label": "simple table", children: [_jsx(TableHead, { className: "bg-gray-200", children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Nom" }), _jsx(TableCell, { width: 300, children: "infirmi\u00E8re ayant ce r\u00F4le" }), _jsx(TableCell, { children: "Date" }), _jsx(TableCell, { width: 60, align: "center", children: "Action" })] }) }), _jsx(TableBody, { children: data?.length ? (data.map((row, index) => (_jsxs(TableRow, { className: "border-t border-gray-300", children: [_jsx(TableCell, { component: "th", scope: "row", children: row.rolename }), _jsx(TableCell, { component: "th", children: row.patients.map((patient, patientIndex) => (_jsxs("span", { children: [patient.nom, patientIndex !== row.patients.length - 1 && ", "] }, patientIndex))) }), _jsx(TableCell, { component: "th", children: row.created_at }), _jsx(TableCell, { children: _jsx(IconButton, { onClick: () => deleteRole(row.id), children: _jsx(DeleteOutlineIcon, { color: "error", className: "pointer-events-none", fill: "currentColor" }) }) })] }, index)))) : (_jsx(TableRow, { className: "border-t border-gray-300", children: _jsx(TableCell, { colSpan: 4, align: "center", className: "!text-gray-600 p-4", children: _jsx("p", { className: "text-lg", children: "D\u00E9sol\u00E9, aucun role pour le moment." }) }) })) })] }) }) })] }));
};
export default RolesSettings;
