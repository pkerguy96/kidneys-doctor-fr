import { createElement as _createElement } from "react";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, Table, TableBody, TableCell, TableContainer, TableHead, IconButton, TableRow, TextField, Typography, Autocomplete, Tooltip, } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import KeyboardBackspaceOutlinedIcon from "@mui/icons-material/KeyboardBackspaceOutlined";
import AddIcon from "@mui/icons-material/Add";
import { useCallback, useMemo, useState } from "react";
import addGlobal from "../../hooks/addGlobal";
import { DeleteradioApiClient, fetchxrayfirststep, updateParacliniqueApiClient, xrayApiClient, xraysWithCategoryApiClient, } from "../../services/XrayService";
import { useSnackbarStore } from "../../zustand/useSnackbarStore";
import { useNavigate } from "react-router";
import { CACHE_KEY_XraysWithCategory, CACHE_KEY_XraysWithCategoryBACK, } from "../../constants";
import getGlobal from "../../hooks/getGlobal";
import LoadingSpinner from "../../components/LoadingSpinner";
import getGlobalById from "../../hooks/getGlobalById";
import CheckAction from "../../components/CheckAction";
import deleteItem from "../../hooks/deleteItem";
import { useQueryClient } from "@tanstack/react-query";
const RadioPage = ({ onNext, onBack }) => {
    const [radiology, setRadiology] = useState("");
    const [fields, setFields] = useState([]);
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbarStore();
    const queryClient = useQueryClient();
    const queryParams = useMemo(() => new URLSearchParams(location.search), []);
    const patient_id = queryParams.get("id");
    const operation_id = queryParams.get("operation_id");
    const { data, isLoading } = getGlobal({}, CACHE_KEY_XraysWithCategory, xraysWithCategoryApiClient, undefined);
    const { data: HistoryXray, isLoading: isLoading2 } = operation_id
        ? getGlobalById({}, CACHE_KEY_XraysWithCategoryBACK, fetchxrayfirststep, { refetchOnWindowFocus: false }, parseInt(operation_id))
        : {};
    const addMutation = addGlobal({}, xrayApiClient, undefined);
    const updateMutation = addGlobal({}, updateParacliniqueApiClient);
    const radiologyChange = useCallback((value) => {
        setRadiology(value || "");
    }, []);
    const handleAddRow = useCallback(() => {
        if (!radiology)
            return;
        setFields((old) => [
            ...old,
            { type: radiology, name: "", price: 0, note: "" },
        ]);
        setRadiology("");
    }, [radiology]);
    const handleRemoveRow = useCallback((index) => {
        setFields((old) => old.filter((_current, _index) => _index !== index));
    }, []);
    const changeRadiologyName = useCallback((value, type, index) => {
        const price = data[type]?.find((e) => e.name === value)?.price || 0;
        const newRows = [...fields].map((e, _index) => {
            if (index === _index) {
                e.price = price;
                e.name = value;
            }
            return e;
        });
        setFields(newRows);
    }, [data, fields]);
    const changeRadiologyNote = useCallback((value, index) => {
        const newRows = [...fields].map((e, _index) => {
            if (index === _index) {
                e.note = value;
            }
            return e;
        });
        setFields(newRows);
    }, [fields]);
    const submit = async (e) => {
        e.preventDefault();
        const formatedxrays = [...fields].filter((carry) => carry.name);
        const formatedData = {
            patient_id: patient_id,
            operation_id: operation_id,
            xrays: formatedxrays,
        };
        if (create) {
            if (!formatedxrays.length) {
                showSnackbar("Veuillez choisir un type de radio", "error");
                return;
            }
            await addMutation.mutateAsync(formatedData, {
                onSuccess: (data) => {
                    queryClient.invalidateQueries(CACHE_KEY_XraysWithCategoryBACK);
                    navigate(`?id=${patient_id}&operation_id=${data.data}&withxrays`, {
                        replace: true,
                    });
                    onNext();
                },
                onError: (error) => {
                    console.log(error);
                },
            });
        }
        else {
            if (!formatedxrays.length) {
                await deleteItem(parseInt(operation_id), DeleteradioApiClient);
                queryClient.invalidateQueries(CACHE_KEY_XraysWithCategoryBACK);
                onNext();
                return;
            }
            await updateMutation.mutateAsync(formatedData, {
                onSuccess: (data) => {
                    queryClient.invalidateQueries(CACHE_KEY_XraysWithCategoryBACK);
                    navigate(`?id=${patient_id}&operation_id=${data.data}&withxrays`, {
                        replace: true,
                    });
                    onNext();
                },
                onError: (error) => {
                    console.log(error);
                },
            });
        }
    };
    const create = CheckAction(() => {
        setFields(HistoryXray.map((xray) => ({
            name: xray.xray_name,
            type: xray.xray_type,
            price: xray.price,
            note: "",
        })));
    }, HistoryXray);
    if (isLoading || isLoading2)
        return _jsx(LoadingSpinner, {});
    return (_jsx(Paper, { className: "!p-6 w-full flex flex-col gap-4", children: _jsxs(Box, { component: "form", noValidate: true, autoComplete: "off", onSubmit: submit, className: "flex flex-col gap-6 relative", children: [_jsx(Tooltip, { title: "Retour", children: _jsx(IconButton, { className: "!absolute -top-1 left-0", onClick: onBack, children: _jsx(KeyboardBackspaceOutlinedIcon, { color: "primary", className: "pointer-events-none", fill: "currentColor" }) }) }), _jsx(Box, { className: "flex justify-center", children: _jsx(Typography, { id: "modal-modal-title", component: "h2", className: "text-center !text-2xl font-bold", children: "Diagnostic demand\u00E9" }) }), _jsxs(Box, { className: "flex flex-col items-center gap-6 flex-wrap", children: [_jsxs(Box, { className: "w-full flex flex-wrap items-center gap-4", children: [_jsx(FormControl, { className: "flex-1", children: _jsx(Autocomplete, { className: "w-full", id: "demo-autocomplete-paraclinique", options: Object.keys(data), getOptionLabel: (option) => option, value: radiology || null, onChange: (_event, newValue) => {
                                            radiologyChange(newValue);
                                        }, renderInput: (params) => (_jsx(TextField, { ...params, label: "Paraclinique", variant: "outlined", placeholder: "Choisissez une option" })), renderOption: (props, option) => (_createElement("li", { ...props, key: `radio_${option}` }, option)), noOptionsText: _jsxs("div", { children: [_jsx("div", { style: { padding: "8px 16px" }, children: "Aucune donn\u00E9e disponible" }), _jsx("div", { style: {
                                                        color: "blue",
                                                        cursor: "pointer",
                                                        padding: "8px 16px",
                                                    }, onClick: () => navigate("/settings/xrays"), children: "Ajouter des donn\u00E9es" })] }) }) }), _jsx(Button, { className: "!px-4 !py-2 !min-w-max !rounded-full", variant: "outlined", onClick: handleAddRow, children: _jsx(AddIcon, {}) })] }), _jsx(Box, { className: "w-full flex flex-col gap-2", children: _jsx(TableContainer, { component: Paper, elevation: 0, className: "border border-gray-300", children: _jsxs(Table, { sx: { minWidth: 650 }, "aria-label": "simple table", children: [_jsx(TableHead, { className: "bg-gray-200", children: _jsxs(TableRow, { children: [_jsx(TableCell, { width: 300, children: "Operation" }), _jsx(TableCell, { children: "Note" }), _jsx(TableCell, { width: 60, align: "center", children: "Action" })] }) }), _jsx(TableBody, { children: fields.length > 0 ? (fields.map((carry, index) => (_jsxs(TableRow, { className: "border-t border-gray-300", children: [_jsx(TableCell, { children: _jsxs(FormControl, { className: "w-full", size: "medium", children: [_jsx(InputLabel, { id: `rows.${index}.name.label`, children: carry.type }), _jsx(Select, { labelId: `rows.${index}.name.label`, label: carry.type, id: `row.${index}.name`, value: carry.name, onChange: (e) => changeRadiologyName(e.target.value, carry.type, index), children: data[carry.type]?.map((radio, _index) => (_jsx(MenuItem, { value: radio.name, children: radio.name }, `radio_${_index}`))) })] }) }), _jsx(TableCell, { children: _jsx(FormControl, { className: "w-full md:flex-1", size: "medium", children: _jsx(TextField, { id: `note_${index}`, value: carry.note, onChange: (e) => changeRadiologyNote(e.target.value, index) }) }) }), _jsx(TableCell, { align: "center", children: _jsx(IconButton, { onClick: () => handleRemoveRow(index), children: _jsx(DeleteOutlineIcon, { color: "error", className: "pointer-events-none", fill: "currentColor" }) }) })] }, index)))) : (_jsx(TableRow, { className: "border-t border-gray-300", children: _jsx(TableCell, { colSpan: 3, align: "center", children: "D\u00E9sol\u00E9, aucun diagnostic pour le moment." }) })) })] }) }) })] }), _jsxs(Box, { className: "flex justify-between flex-row content-center", children: [_jsx(Button, { className: "w-full md:w-max !px-10 !py-3 rounded-lg ", variant: "outlined", onClick: () => {
                                onNext();
                            }, children: _jsx("p", { className: "text-sm ", children: "Passer" }) }), _jsx(Button, { type: "submit", variant: "contained", className: "w-full md:w-max !px-10 !py-3 rounded-lg !ms-auto", children: "Enregistrer" })] })] }) }));
};
export default RadioPage;
