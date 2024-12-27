import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
//@ts-nocheck
import { Paper, Box, Typography, FormControl, Autocomplete, TextField, Button, MenuItem, Select, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip, } from "@mui/material";
import { useState } from "react";
import { CACHE_KEY_ExamenWithCategory, CACHE_KEY_PatienttinyData, } from "../../constants";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useNavigate } from "react-router";
import AddIcon from "@mui/icons-material/Add";
import getGlobalById from "../../hooks/getGlobalById";
import { patientTinyDataAPIClient } from "../../services/PatientService";
import getGlobal from "../../hooks/getGlobal";
import { ExamenPreferencewithCategoriesApiClient } from "../../services/ExamenService";
import LoadingSpinner from "../../components/LoadingSpinner";
import KeyboardBackspaceOutlinedIcon from "@mui/icons-material/KeyboardBackspaceOutlined";
import usePrint from "../PrintGlobal";
const ExamenDemander = ({ onNext, onBack, }) => {
    const [examen, setExamen] = useState("");
    const [fields, setFields] = useState([]);
    const [note, setNote] = useState("");
    const queryParams = new URLSearchParams(location.search);
    const patient_id = queryParams.get("id");
    const navigate = useNavigate();
    const { print, Printable } = usePrint();
    const { data } = getGlobalById({}, CACHE_KEY_PatienttinyData, patientTinyDataAPIClient, undefined, parseInt(patient_id));
    const { data: printables, isLoading } = getGlobal({}, CACHE_KEY_ExamenWithCategory, ExamenPreferencewithCategoriesApiClient, undefined);
    const examenChange = (value) => {
        setExamen(value);
    };
    const handleAddRow = () => {
        if (!examen)
            return;
        setFields((old) => [...old, { name: examen, type: "" }]);
        setExamen("");
    };
    const handleRemoveRow = (index) => {
        setFields((old) => old.filter((current, _index) => _index !== index));
    };
    const changeExamenType = (value, index) => {
        const newRows = [...fields].map((e, _index) => {
            if (index === _index) {
                e.type = value;
            }
            return e;
        });
        setFields(newRows);
    };
    //TODO: make this dynamic so the back can work
    const submit = async (e) => {
        e.preventDefault();
        if (!fields.length)
            return;
        print(() => {
            onNext();
        });
    };
    if (isLoading)
        return _jsx(LoadingSpinner, {});
    return (_jsxs(Paper, { className: "!p-6 w-full flex flex-col gap-4", children: [_jsxs(Box, { component: "form", noValidate: true, autoComplete: "off", onSubmit: submit, className: "flex flex-col gap-6 relative", children: [_jsx(Tooltip, { title: "Retour", children: _jsx(IconButton, { className: "!absolute -top-1 left-0", onClick: onBack, children: _jsx(KeyboardBackspaceOutlinedIcon, { color: "primary", className: "pointer-events-none", fill: "currentColor" }) }) }), _jsx(Box, { className: "flex justify-center", children: _jsx(Typography, { id: "modal-modal-title", component: "h2", className: "text-center !text-2xl font-bold", children: "Examens demand\u00E9e" }) }), _jsx(Box, { className: "w-full flex flex-col gap-2", children: _jsx(Box, { className: "w-full flex flex-col gap-2", children: _jsx(TextField, { id: "outlined-required", onChange: (e) => setNote(e.target.value), multiline: true, rows: 3, label: "Note" }) }) }), _jsxs(Box, { className: "flex flex-col items-center gap-4 flex-wrap", children: [_jsxs(Box, { className: "w-full flex flex-wrap items-center gap-4", children: [_jsx(FormControl, { className: "flex-1", children: _jsx(Autocomplete, { className: "w-full", id: "demo-autocomplete-examen", options: Object.entries(printables).flatMap(([header, prints]) => prints.map((print) => ({ group: header, label: print }))), groupBy: (option) => option.group, getOptionLabel: (option) => option.label, value: examen ? { group: "", label: examen } : null, onChange: (event, newValue) => {
                                                if (newValue) {
                                                    examenChange(newValue.label);
                                                }
                                            }, renderInput: (params) => (_jsx(TextField, { ...params, label: "Examen", variant: "outlined", placeholder: "Choisissez un examen" })), noOptionsText: _jsxs("div", { children: [_jsx("div", { style: { padding: "8px 16px" }, children: "Aucune donn\u00E9e disponible" }), _jsx("div", { style: {
                                                            color: "blue",
                                                            cursor: "pointer",
                                                            padding: "8px 16px",
                                                        }, onClick: () => navigate("/Settings/Examen"), children: "Ajouter des donn\u00E9es" })] }) }) }), _jsx(Button, { className: "!px-4 !py-2 !min-w-max !rounded-full", variant: "outlined", onClick: handleAddRow, children: _jsx(AddIcon, {}) })] }), _jsx(Box, { className: "w-full flex flex-col gap-2", children: _jsx(TableContainer, { component: Paper, elevation: 0, className: "border border-gray-300", children: _jsxs(Table, { sx: { minWidth: 650 }, "aria-label": "simple table", children: [_jsx(TableHead, { className: "bg-gray-200", children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Name" }), _jsx(TableCell, { width: 300, children: "Type" }), _jsx(TableCell, { width: 60, align: "center", children: "Action" })] }) }), _jsx(TableBody, { children: fields.length ? (fields.map((carry, index) => (_jsxs(TableRow, { className: "border-t border-gray-300", children: [_jsx(TableCell, { children: carry.name }), _jsx(TableCell, { children: _jsx(FormControl, { className: "w-full", size: "medium", children: _jsx(Select, { labelId: `rows.${index}.type.label`, id: `row.${index}.type`, value: carry.type, onChange: (e) => changeExamenType(e.target.value, index), children: [
                                                                        "Sans Injection (C-)",
                                                                        "Avec Injection (C+)",
                                                                    ].map((radio, _index) => (_jsx(MenuItem, { value: radio, children: radio }, `radio_${_index}`))) }) }) }), _jsx(TableCell, { children: _jsx(IconButton, { onClick: () => handleRemoveRow(index), children: _jsx(DeleteOutlineIcon, { color: "error", className: "pointer-events-none", fill: "currentColor" }) }) })] }, index)))) : (_jsx(TableRow, { className: "border-t border-gray-300", children: _jsx(TableCell, { colSpan: 3, align: "center", className: "!text-gray-600 p-4", children: _jsx("p", { className: "text-lg", children: "D\u00E9sol\u00E9, aucun examen pour le moment." }) }) })) })] }) }) })] }), _jsxs(Box, { className: "flex justify-between flex-row content-center", children: [_jsx(Button, { className: "w-full md:w-max !px-10 !py-3 rounded-lg ", variant: "outlined", onClick: () => {
                                    onNext();
                                }, children: _jsx("p", { className: "text-sm ", children: "Passer" }) }), _jsx(Button, { type: "submit", variant: "contained", className: "w-full md:w-max !px-10 !py-3 rounded-lg !ms-auto", children: "Enregistrer" })] })] }), _jsx(Printable, { name: data?.nom + " " + data?.prenom, items: fields, renderTop: () => _jsx("div", { className: "font-semibold", children: note }), render: (item, index) => (_jsx("div", { children: _jsxs("h3", { className: "font-bold", children: [index + 1, "- ", item.name, " ", item.type] }) }, index)) })] }));
};
export default ExamenDemander;
