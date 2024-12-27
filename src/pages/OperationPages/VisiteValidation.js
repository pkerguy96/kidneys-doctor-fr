import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Paper, Box, Typography, FormControl, TextField, Button, IconButton, Select, MenuItem, Tooltip, } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import AddIcon from "@mui/icons-material/Add";
import getGlobalById from "../../hooks/getGlobalById";
import { insertOpwithoutxray, origonalxrayApiClient, PatientXrayApiClient, } from "../../services/XrayService";
import { useLocation, useNavigate } from "react-router";
import LoadingSpinner from "../../components/LoadingSpinner";
import { CACHE_KEY_OperationPref, CACHE_KEY_ProductOperation, } from "../../constants";
import updateItem from "../../hooks/updateItem";
import addGlobal from "../../hooks/addGlobal";
import { useSnackbarStore } from "../../zustand/useSnackbarStore";
import getGlobal from "../../hooks/getGlobal";
import { OperationPrefApiClient } from "../../services/SettingsService";
import { useQueryClient } from "@tanstack/react-query";
import { productOperationApiClient } from "../../services/StockService";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import KeyboardBackspaceOutlinedIcon from "@mui/icons-material/KeyboardBackspaceOutlined";
const VisiteValidation = ({ onNext, onBack, }) => {
    const [operations, setOperations] = useState([]);
    const [consomables, setConsomables] = useState([]);
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbarStore();
    const queryClient = useQueryClient();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const operation_id = queryParams.get("operation_id");
    const patient_id = queryParams.get("id");
    const isdone = queryParams.get("isdone");
    const withxrays = queryParams.get("withxrays");
    const addmutation = addGlobal({}, insertOpwithoutxray);
    const updateMutation = updateItem({}, origonalxrayApiClient);
    const { data: consomableArrayList, isLoading: isLoading1 } = getGlobal({}, CACHE_KEY_ProductOperation, productOperationApiClient, undefined);
    const { data: extraData, refetch, isLoading: isloading2, } = getGlobal({}, CACHE_KEY_OperationPref, OperationPrefApiClient, undefined);
    const { data: xrayData, isLoading: isLoading3 } = operation_id
        ? getGlobalById({}, ["CACHE_KEY_Xray", operation_id.toString()], PatientXrayApiClient, undefined, parseInt(operation_id))
        : { data: [], isLoading: false };
    const addNewOperation = () => {
        setOperations((old) => [...old, { xray_type: "", price: 0 }]);
    };
    const addNewConomable = () => {
        setConsomables((old) => [...old, { consomable: "", qte: 0 }]);
    };
    const patchOperation = (index, value, type) => {
        setOperations((old) => old.map((op, idx) => {
            if (idx === index)
                op[type] = value;
            return op;
        }));
    };
    const patchConsomable = (index, value, type) => {
        setConsomables((old) => old.map((op, idx) => {
            if (idx === index)
                op[type] = value;
            return op;
        }));
    };
    const removeOperation = (index) => {
        setOperations((old) => old.filter((op, idx) => idx !== index));
    };
    const removeConsomable = (index) => {
        setConsomables((old) => old.filter((op, idx) => idx !== index));
    };
    const onSubmit = async (e) => {
        e.preventDefault();
        if (operations.length === 0) {
            showSnackbar("Vous devez remplir au moins une opération avant de soumettre", "error");
            return;
        }
        const validRows = operations.filter((row) => row.xray_type.trim() !== "");
        if (validRows.length === 0) {
            showSnackbar("Veuillez remplir le nom de l'opération avant de soumettre", "error");
            return;
        }
        try {
            // Check if operation_id exists
            if (withxrays !== null) {
                const formData = {
                    operation_id: operation_id,
                    patient_id: patient_id,
                    treatment_isdone: isdone ?? 1,
                    consomables: consomables,
                    rows: operations.map((e) => {
                        if (e.id)
                            if (String(e.id).startsWith("pref-")) {
                                delete e.id; // Remove the id property if it starts with "pref-"
                            }
                            else {
                                e.id = String(e.id).replace(/^data-(\d+)$/, "$1"); // Keep only the number for "data-"
                            }
                        return e;
                    }),
                };
                // If operation_id exists, update the operation
                await updateMutation.mutateAsync({
                    data: formData,
                    id: Number(operation_id),
                }, {
                    onSuccess: (data) => {
                        queryClient.invalidateQueries({
                            queryKey: ["operation"],
                            exact: false,
                        });
                        showSnackbar("L'opération a été enregistrée avec succès", "success");
                        navigate("/Patients");
                    },
                    onError: (error) => {
                        const message = error.response?.data?.error;
                        showSnackbar(message, "error");
                    },
                });
            }
            else {
                const formData = {
                    patient_id: Number(patient_id),
                    treatment_isdone: isdone ?? 1,
                    consomables: consomables,
                    rows: operations,
                };
                await addmutation.mutateAsync(formData, {
                    onSuccess: (data) => {
                        queryClient.invalidateQueries({
                            queryKey: ["operation"],
                            exact: false,
                        });
                        showSnackbar("L'opération a été enregistrée avec succès", "success");
                        navigate("/Patients");
                    },
                    onError: (error) => {
                        const message = error.response?.data?.error;
                        showSnackbar(message, "error");
                    },
                });
            }
        }
        catch (error) {
            console.error("Unexpected error:", error);
        }
    };
    const xrayRows = useMemo(() => {
        return [...(xrayData || [])].map((item, index) => ({
            id: `data-${item.id || index}`,
            xray_type: item.xray_type || "",
            price: item.price || 0,
        }));
    }, [xrayData]);
    const extraRows = useMemo(() => {
        return [...(extraData || [])].map((pref, index) => ({
            id: `pref-${pref.id || index}`,
            xray_type: pref.operation_type || "",
            price: parseFloat(pref.price || "0"),
        }));
    }, [extraData]);
    const xrayString = JSON.stringify(xrayRows);
    useEffect(() => {
        setOperations([...xrayRows, ...extraRows]);
    }, [extraRows, xrayString]);
    if (isLoading1 || isloading2 || isLoading3)
        return _jsx(LoadingSpinner, {});
    return (_jsx(Paper, { className: "!p-6 w-full flex flex-col gap-4", children: _jsxs(Box, { component: "form", noValidate: true, autoComplete: "off", className: "flex gap-6 flex-col relative", onSubmit: onSubmit, children: [_jsx(Tooltip, { title: "Retour", children: _jsx(IconButton, { className: "!absolute -top-1 left-0", onClick: onBack, children: _jsx(KeyboardBackspaceOutlinedIcon, { color: "primary", className: "pointer-events-none", fill: "currentColor" }) }) }), _jsx(Box, { className: "flex justify-center", children: _jsx(Typography, { id: "modal-modal-title", component: "h2", className: "text-center !text-2xl font-bold", children: "Validation Globale" }) }), _jsxs(Box, { className: "flex gap-4 flex-col", children: [_jsxs(Box, { className: "flex justify-between items-center", children: [_jsx(Typography, { id: "modal-modal-title", component: "h2", className: "text-center !text-xl font-bold", children: "Validation Operations" }), _jsx(Button, { className: "!px-4 !py-2 !min-w-max !rounded-full", variant: "outlined", onClick: addNewOperation, children: _jsx(AddIcon, {}) })] }), _jsx(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center", children: _jsx(TableContainer, { component: Paper, elevation: 0, className: "border border-gray-300", children: _jsxs(Table, { sx: { minWidth: 650 }, "aria-label": "simple table", children: [_jsx(TableHead, { className: "bg-gray-200", children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Operation" }), _jsx(TableCell, { width: 300, children: "Prix" }), _jsx(TableCell, { width: 60, align: "center", children: "Action" })] }) }), _jsx(TableBody, { children: operations.length ? (operations.map((field, index) => (_jsxs(TableRow, { className: "border-t border-gray-300", children: [_jsx(TableCell, { component: "th", scope: "row", children: _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(TextField, { ...field, id: `xray_type_${field.id}`, type: "text", value: field.xray_type, onChange: (event) => patchOperation(index, event.target.value, "xray_type") }) }) }), _jsx(TableCell, { children: _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(TextField, { ...field, id: `price_${field.id}`, type: "number", value: field.price, onChange: (event) => patchOperation(index, event.target.value, "price") }) }) }), _jsx(TableCell, { children: _jsx(IconButton, { onClick: () => removeOperation(index), children: _jsx(DeleteOutlineIcon, { color: "error", className: "pointer-events-none", fill: "currentColor" }) }) })] }, field.id)))) : (_jsx(TableRow, { className: "border-t border-gray-300", children: _jsx(TableCell, { colSpan: 3, align: "center", className: "!text-gray-600 p-4", children: _jsx("p", { className: "text-lg", children: "D\u00E9sol\u00E9, aucune operation pour le moment." }) }) })) })] }) }) }), _jsxs(Box, { className: "flex justify-between items-center", children: [_jsx("h2", { className: "font-semibold text-base text-start", children: "Montant Total" }), _jsxs("span", { className: "font-semibold text-sm text-end", children: [operations.reduce((carry, current) => carry + +current.price, 0), " ", "MAD"] })] })] }), _jsxs(Box, { className: "flex gap-4 flex-col", children: [_jsxs(Box, { className: "flex justify-between items-center", children: [_jsx(Typography, { id: "modal-modal-title", component: "h2", className: "text-center !text-xl font-bold", children: "Validation Consomables" }), _jsx(Button, { className: "!px-4 !py-2 !min-w-max !rounded-full", variant: "outlined", onClick: addNewConomable, children: _jsx(AddIcon, {}) })] }), _jsx(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center", children: _jsx(TableContainer, { component: Paper, elevation: 0, className: "border border-gray-300", children: _jsxs(Table, { sx: { minWidth: 650 }, "aria-label": "simple table", children: [_jsx(TableHead, { className: "bg-gray-200", children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Consommable" }), _jsx(TableCell, { width: 300, children: "Quantit\u00E9" }), _jsx(TableCell, { width: 60, align: "center", children: "Action" })] }) }), _jsx(TableBody, { children: consomables.length ? (consomables.map((field, index) => (_jsxs(TableRow, { className: "border-t border-gray-300", children: [_jsx(TableCell, { component: "th", scope: "consomables", children: _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Select, { labelId: "demo-select-small-label", id: `consomables.consomable_${index}`, value: field.consomable, onChange: (event) => patchConsomable(index, event.target.value, "consomable"), children: consomableArrayList &&
                                                                    consomableArrayList.length > 0 ? (consomableArrayList.map((consumable) => (_jsx(MenuItem, { value: consumable.id, children: consumable.product_name }, consumable.id)))) : (_jsx(MenuItem, { value: "none", disabled: true, children: _jsx("em", { children: "Aucun consommable trouv\u00E9" }) })) }) }) }), _jsx(TableCell, { children: _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(TextField, { id: `consomables.qte_${index}`, type: "number", value: field.qte, onChange: (event) => patchConsomable(index, event.target.value, "qte") }) }) }), _jsx(TableCell, { children: _jsx(IconButton, { onClick: () => removeConsomable(index), children: _jsx(DeleteOutlineIcon, { color: "error", className: "pointer-events-none", fill: "currentColor" }) }) })] }, "consomable." + index)))) : (_jsx(TableRow, { className: "border-t border-gray-300", children: _jsx(TableCell, { colSpan: 3, align: "center", className: "!text-gray-600 p-4", children: _jsx("p", { className: "text-lg", children: "D\u00E9sol\u00E9, aucun consomable pour le moment." }) }) })) })] }) }) }), _jsxs(Box, { className: "flex justify-between items-center", children: [_jsx("h2", { className: "font-semibold text-base text-start", children: "Quantit\u00E9 Total" }), _jsxs("span", { className: "font-semibold text-sm text-end", children: [consomables.reduce((carry, current) => carry + +current.qte, 0), " ", "Pi\u00E8ces"] })] })] }), _jsx(Box, { className: "flex", children: _jsx(Button, { type: "submit", variant: "contained", className: "w-full md:w-max !px-10 !py-3 rounded-lg !ms-auto", children: "Enregistrer" }) })] }) }));
};
export default VisiteValidation;
