import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Paper, Box, Typography, FormControl, Autocomplete, TextField, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, } from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CACHE_KEY_BloodtestList, CACHE_KEY_OperationBloodTest, } from "../../constants";
import addGlobal from "../../hooks/addGlobal";
import { bloodTestApiClient, bloodTestpreflistApiClient, editBloodTestOperation, } from "../../services/BloodTest";
import { useLocation } from "react-router";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import getGlobal from "../../hooks/getGlobal";
import LoadingSpinner from "../../components/LoadingSpinner";
import usePrint from "../PrintGlobal";
import KeyboardBackspaceOutlinedIcon from "@mui/icons-material/KeyboardBackspaceOutlined";
import getGlobalById from "../../hooks/getGlobalById";
import { deletebloodtestApiClient, fetchBloodTestOperation, } from "../../services/XrayService";
import CheckAction from "../../components/CheckAction";
import deleteItem from "../../hooks/deleteItem";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbarStore } from "../../zustand/useSnackbarStore";
const BloodTest = ({ onNext, onBack }) => {
    const location = useLocation();
    const [analyse, setAnalyse] = useState(NaN);
    const [fields, setFields] = useState([]);
    const queryParams = new URLSearchParams(location.search);
    const patient_id = queryParams.get("id");
    const operationId = queryParams.get("operation_id");
    const [row, setRow] = useState();
    const { handleSubmit } = useForm();
    const { print, Printable } = usePrint();
    const queryClient = useQueryClient();
    const { showSnackbar } = useSnackbarStore();
    const addMutation = addGlobal({}, bloodTestApiClient);
    const updateMutation = addGlobal({}, editBloodTestOperation);
    const { data: BoneDoctorBloodTests, isLoading } = getGlobal({}, CACHE_KEY_BloodtestList, bloodTestpreflistApiClient, undefined);
    const { data: BloodTestHistory, isLoading: isLoading2 } = operationId
        ? getGlobalById({}, CACHE_KEY_OperationBloodTest, fetchBloodTestOperation, { refetchOnWindowFocus: false }, parseInt(operationId))
        : {};
    if (!patient_id) {
        return (_jsx(Typography, { variant: "h6", color: "error", align: "center", children: "Quelque chose s'est mal pass\u00E9, veuillez refaire les \u00E9tapes, si cela ne fonctionne pas, signalez ce bug au d\u00E9veloppeur." }));
    }
    const handleAddRow = () => {
        if (Number.isNaN(analyse))
            return;
        setFields((old) => [...old, BoneDoctorBloodTests[analyse]]);
        setAnalyse(NaN);
    };
    const handleRemoveRow = (index) => {
        setFields((old) => old.filter((_current, _index) => _index !== index));
    };
    const onSubmit = async () => {
        const formatedData = {
            patient_id: patient_id,
            operation_id: operationId ? parseInt(operationId) : null,
            blood_test: fields,
        };
        try {
            if (create) {
                if (!fields.length) {
                    showSnackbar("Veuillez choisir une analyse", "error");
                    return;
                }
                addMutation.mutateAsync(formatedData, {
                    onSuccess: (data) => {
                        queryClient.invalidateQueries(CACHE_KEY_OperationBloodTest);
                        setRow(data.data);
                    },
                    onError: (error) => {
                        console.log(error);
                    },
                });
            }
            else {
                if (!fields.length) {
                    await deleteItem(parseInt(operationId), deletebloodtestApiClient);
                    queryClient.invalidateQueries(CACHE_KEY_OperationBloodTest);
                    onNext();
                    return;
                }
                updateMutation.mutateAsync(formatedData, {
                    onSuccess: (data) => {
                        queryClient.invalidateQueries(CACHE_KEY_OperationBloodTest);
                        setRow(data.data);
                    },
                    onError: (error) => {
                        console.log(error);
                    },
                });
            }
        }
        catch (error) { }
    };
    useEffect(() => {
        if (!row)
            return;
        print(() => {
            onNext();
        });
    }, [row]);
    const create = CheckAction(() => {
        setFields(BloodTestHistory.map((bloodTest) => ({
            delai: bloodTest.delai ?? "",
            code: bloodTest.code ?? "",
            price: bloodTest.price ?? "",
            title: bloodTest.title ?? "",
        })));
    }, BloodTestHistory);
    if (isLoading || isLoading2)
        return _jsx(LoadingSpinner, {});
    return (_jsxs(Paper, { className: "!p-6 w-full flex flex-col gap-4", children: [_jsxs(Box, { component: "form", noValidate: true, autoComplete: "off", onSubmit: handleSubmit(onSubmit), className: "flex gap-6 flex-col relative", children: [_jsx(Tooltip, { title: "Retour", children: _jsx(IconButton, { className: "!absolute -top-1 left-0", onClick: onBack, children: _jsx(KeyboardBackspaceOutlinedIcon, { color: "primary", className: "pointer-events-none", fill: "currentColor" }) }) }), _jsx(Box, { className: "flex justify-center", children: _jsx(Typography, { id: "modal-modal-title", component: "h2", className: "text-center !text-2xl font-bold", children: "S\u00E9lection d'analyses" }) }), _jsx(Box, { className: "flex gap-4 flex-col", children: _jsxs(Box, { className: "w-full flex flex-wrap items-center gap-4", children: [_jsx(FormControl, { className: "flex-1", children: _jsx(Autocomplete, { className: "w-full", id: "demo-autocomplete-helper", options: BoneDoctorBloodTests, getOptionLabel: (option) => option.title, value: BoneDoctorBloodTests[analyse] || null, onChange: (_event, newValue) => {
                                            setAnalyse(newValue ? BoneDoctorBloodTests.indexOf(newValue) : NaN);
                                        }, renderInput: (params) => (_jsx(TextField, { ...params, label: "Analyses", variant: "outlined", placeholder: "Choisissez une analyse" })) }) }), _jsx(Button, { className: "!px-4 !py-2 !min-w-max !rounded-full", variant: "outlined", onClick: handleAddRow, children: _jsx(AddIcon, {}) })] }) }), _jsx(Box, { className: "w-full flex flex-col gap-2", children: _jsx(TableContainer, { component: Paper, elevation: 0, className: "border border-gray-300", children: _jsxs(Table, { sx: { minWidth: 650 }, "aria-label": "simple table", children: [_jsx(TableHead, { className: "bg-gray-200", children: _jsxs(TableRow, { children: [_jsx(TableCell, { width: 100, children: "Code" }), _jsx(TableCell, { children: "Analyse" }), _jsx(TableCell, { width: 200, children: "Prix" }), _jsx(TableCell, { width: 200, children: "D\u00E9lai" }), _jsx(TableCell, { width: 60, align: "center", children: "Action" })] }) }), _jsx(TableBody, { children: fields.length ? (fields.map((carry, index) => (_jsxs(TableRow, { className: "border-t border-gray-300", children: [_jsx(TableCell, { children: carry.code }), _jsx(TableCell, { children: carry.title }), _jsxs(TableCell, { children: [carry.price, " ", carry.price ? "MAD" : "n/a"] }), _jsx(TableCell, { children: carry.delai === null || carry.delai === ""
                                                        ? "n/a"
                                                        : carry.delai }), _jsx(TableCell, { children: _jsx(IconButton, { onClick: () => handleRemoveRow(index), children: _jsx(DeleteOutlineIcon, { color: "error", className: "pointer-events-none", fill: "currentColor" }) }) })] }, index)))) : (_jsx(TableRow, { className: "border-t border-gray-300", children: _jsx(TableCell, { colSpan: 5, align: "center", className: "!text-gray-600 p-4", children: _jsx("p", { className: "text-lg", children: "D\u00E9sol\u00E9, aucun analyse pour le moment." }) }) })) })] }) }) }), _jsxs(Box, { className: "flex justify-between flex-row content-center", children: [_jsx(Button, { className: "w-full md:w-max !px-10 !py-3 rounded-lg ", variant: "outlined", onClick: () => {
                                    onNext();
                                }, children: _jsx("p", { className: "text-sm ", children: "Passer" }) }), _jsx(Button, { type: "submit", variant: "contained", className: "w-full md:w-max !px-10 !py-3 rounded-lg !ms-auto", children: "Enregistrer" })] })] }), _jsx(Printable, { name: row?.nom + " " + row?.prenom, items: fields, render: (item, index) => (_jsx("div", { children: _jsxs("h3", { className: "font-bold", children: [index + 1, "- ", item.title] }) }, index)) })] }));
};
export default BloodTest;
