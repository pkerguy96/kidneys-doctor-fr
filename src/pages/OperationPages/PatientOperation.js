import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
//@ts-nocheck
import { Box, Button, Checkbox, FormControl, FormHelperText, InputLabel, MenuItem, Paper, Select, TextField, Typography, } from "@mui/material";
import { useState, useMemo } from "react";
import { useLocation } from "react-router";
import "../../styles.css";
import LoadingSpinner from "../../components/LoadingSpinner";
import { Controller, useForm } from "react-hook-form";
import FormControlLabel from "@mui/material/FormControlLabel";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Bones } from "../../constants";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import { Link } from "react-router-dom";
import addGlobal from "../../hooks/addGlobal";
import operationApiClient from "../../services/OperationService";
import { useSnackbarStore } from "../../zustand/useSnackbarStore";
import useGlobalStore from "../../zustand/useGlobalStore";
import v6 from "../../assets/v6.svg";
const getColor = (colors) => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16);
    if (colors.includes(randomColor))
        return getColor(colors);
    return "#" + randomColor;
};
const PatientOperation = ({ onNext }) => {
    const [table, setTable] = useState([]);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const patient_id = queryParams.get("id");
    const { showSnackbar } = useSnackbarStore();
    const setIds = useGlobalStore((state) => state.setIds);
    const resetIds = useGlobalStore((state) => state.resetIds);
    const addMutation = addGlobal({}, operationApiClient);
    const validatePrix = useMemo(() => {
        return (value) => {
            const totalPrice = table.reduce((accumulator, currentValue) => {
                return accumulator + currentValue.price;
            }, 0);
            if (totalPrice <= 0) {
                return showSnackbar("le prix doit etre un nombre positive.", "error");
            }
            if (totalPrice < value) {
                return "le montant payé ne doit pas dépasser le prix";
            }
            return true;
        };
    }, [table]);
    /*   const { data, isLoading } = getGlobal(
      {} as OnlyPatientData,
      [CACHE_KEY_PATIENTS[0]],
      patientAPIClient,
      undefined
    ); */
    const isLoading = false;
    /*   var { data: OperationList, isLoading: isloading2 } =
      useGlobalOperationPreference(); */
    var isloading2 = false;
    var OperationList = [
        {
            name: "operation 1",
            price: 100,
            code: 1,
        },
        {
            name: "operation 2",
            price: 100,
            code: 2,
        },
        {
            name: "operation 3",
            price: 100,
            code: 3,
        },
    ];
    const colors = [];
    const [bones, setBones] = useState([]);
    const [color, setColor] = useState(getColor(colors));
    const { handleSubmit, getValues, setValue, control, watch } = useForm({});
    const isFullyPaid = watch("fullyPaid");
    if (isLoading) {
        return _jsx(LoadingSpinner, {});
    }
    const onSubmit = async (data) => {
        const cleanedData = {
            patient_id: patient_id,
            is_paid: data?.fullyPaid,
            note: data?.note,
            amount_paid: data?.paidAmount,
            operations: table,
        };
        const validatedData = [...table, cleanedData];
        try {
            await addMutation.mutateAsync(cleanedData, {
                onSuccess: () => {
                    onNext();
                },
            });
        }
        catch (error) {
            console.log("madaztch");
        }
    };
    function toggleStrokeColor(code) {
        var _bones = [];
        if (bones.includes(code))
            _bones = bones.filter((e) => e !== code);
        else
            _bones = [...bones, code];
        setBones(_bones);
    }
    return (_jsx(Paper, { children: _jsxs(FormControl, { component: "form", className: "!p-6 w-full flex flex-col gap-4", onSubmit: handleSubmit(onSubmit), children: [_jsx(Box, { className: "flex flex-col justify-center gap-4", children: _jsxs(Box, { className: "flex flex-col md:flex-row md:items-center md:justify-between ", children: [_jsx(Typography, { className: "px-2 flex justify-center text-xl font-bold  text-gray-400", variant: "h6", children: "Veuillez s\u00E9lectionner les os que vous souhaitez op\u00E9rer" }), _jsx(Button, { component: Link, 
                                /* to={`/Patients/Details/${id}`} */
                                variant: "contained", color: "primary", children: "Historique des op\u00E9rations" })] }) }), _jsxs(Box, { className: "w-full grid grid-cols-1 grid-rows-1 gap-4 lg:grid-cols-12 lg:my-4 items-start", children: [_jsxs(Box, { className: "mx-auto my-auto relative lg:col-span-5", children: [_jsx("img", { src: v6, alt: "patient", className: "block select-none mx-auto", style: {
                                        height: "auto",
                                        width: "100%", // Set the desired width
                                    } }), _jsx("svg", { className: "absolute left-1/2 -translate-x-1/2 inset-0", width: "100%", height: "100%", viewBox: "0 0 483 1913", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: Bones.map((b, i) => (_jsx("polygon", { className: "cursor-pointer", strokeWidth: 6, fill: "transparent", points: b.points, transform: b.transform, ...(!table.find((e) => e.bones.includes(b.code))
                                            ? {
                                                onClick: () => toggleStrokeColor(b.code),
                                                stroke: bones.includes(b.code) ? color : "",
                                            }
                                            : {
                                                stroke: table.find((e) => e.bones.includes(b.code)).color ||
                                                    "",
                                            }) }, i))) })] }), _jsxs(Box, { className: "w-full flex flex-col gap-4 lg:col-span-7 sticky top-16", children: [_jsx(Typography, { className: "text-2xl font-bold text-center text-[#1976d2] ", variant: "h5", children: "Formulaire d'op\u00E9ration." }), _jsx(FormControl, { children: _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-end md:items-center", children: [_jsxs(Box, { className: "w-full md:flex-1 md:w-0", children: [_jsx(InputLabel, { id: "select-type-label-o", children: "Type" }), _jsx(Controller, { name: "operation", defaultValue: "", control: control, render: ({ field, fieldState }) => (_jsxs(Box, { className: "flex flex-col", children: [_jsx(Select, { ...field, labelId: "select-type-label-o", id: "select-type-helper", label: "Type", children: !isloading2 &&
                                                                        OperationList.map((item) => (_jsx(MenuItem, { value: item.code, children: item.name }, item.code))) }), _jsx(FormHelperText, { error: !!fieldState.error, children: fieldState.error?.message })] })) })] }), _jsx(Button, { className: "w-max", sx: { borderRadius: 16 }, variant: "outlined", endIcon: _jsx(AddIcon, {}), onClick: (e) => {
                                                    const selectedOperation = getValues("operation");
                                                    const valid = !table.find((e) => e.code === selectedOperation);
                                                    if (valid && selectedOperation && bones.length) {
                                                        const op = OperationList.find((e) => e.code === selectedOperation);
                                                        setTable([
                                                            ...table,
                                                            {
                                                                ...op,
                                                                bones: bones,
                                                                color: color,
                                                            },
                                                        ]);
                                                        setValue("operation", "");
                                                        setBones([]);
                                                        colors.push(color);
                                                        setColor(getColor(colors));
                                                    }
                                                    else {
                                                        showSnackbar("Veuillez sélectionner des dents avant d'ajouter une opération", "error");
                                                    }
                                                }, children: "Ajouter" })] }) }), _jsx(TableContainer, { className: "w-full max-h-[400px] flex-wrap overflow-auto border border-gray-300", children: _jsxs(Table, { "aria-label": "simple table", children: [_jsx(TableHead, { children: _jsxs(TableRow, { className: "bg-gray-300 !rounded-2xl\tsticky top-0 z-10", children: [_jsx(TableCell, { children: _jsx("strong", { children: "Operation name" }) }), _jsx(TableCell, { className: "w-64", children: _jsx("strong", { children: "Price" }) })] }) }), _jsx(TableBody, { children: table.map((item, index) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: _jsxs("div", { className: "flex items-center flex-wrap gap-2", children: [_jsx("span", { className: "block w-2 h-2 rounded-full", style: { background: item.color } }), _jsx("span", { className: "block text-base font-semibold", children: item.name })] }) }), _jsx(TableCell, { className: "w-64", children: _jsxs(Box, { className: "w-full flex flex-wrap items-center gap-2", children: [_jsx(Controller, { name: `operations[${index}]`, control: control, defaultValue: "", render: ({ field, fieldState }) => (_jsx(TextField, { ...field, value: item.price || "", className: "w-0 flex-1", label: "Montant pay\u00E9", variant: "outlined", helperText: fieldState.error ? (_jsx("span", { style: { color: "red" }, children: fieldState.error.message })) : (""), type: "number", onChange: (e) => {
                                                                                setTable(table.map((o) => {
                                                                                    if (o.code === item.code) {
                                                                                        o.price = +e.target.value;
                                                                                        field.onChange(e);
                                                                                    }
                                                                                    return o;
                                                                                }));
                                                                            } })) }), _jsx(Button, { className: "w-max", variant: "outlined", color: "error", onClick: () => {
                                                                            setTable(table.filter((o) => o.code !== item.code));
                                                                        }, children: _jsx(DeleteOutlineIcon, {}) })] }) })] }, index))) })] }) }), _jsxs(Box, { className: "w-full flex flex-wrap items-center -mt-4 font-black text-sm", children: [_jsx("span", { className: "block flex-1 p-4", children: "Total Price:" }), _jsxs("span", { className: "block w-64 p-4 ps-8", children: [table.reduce((a, e) => a + e.price, 0), " MAD"] })] }), _jsxs(Box, { className: "flex flex-col justify-center gap-4", children: [_jsxs(Box, { className: "flex flex-col sm:flex-row sm:flex-wrap gap-4", children: [_jsx(Controller, { name: "paidAmount", control: control, rules: {
                                                        validate: validatePrix,
                                                    }, defaultValue: "", render: ({ field, fieldState }) => (_jsxs(Box, { className: "flex-1", children: [_jsx(TextField, { ...field, disabled: isFullyPaid, id: "paidAmount", label: "Montant pay\u00E9", variant: "outlined", type: "number", fullWidth: true }), _jsx(FormHelperText, { error: !!fieldState.error, children: fieldState.error?.message })] })) }), _jsx(Controller, { name: "fullyPaid", control: control, defaultValue: false, render: ({ field }) => (_jsx(FormControlLabel, { className: "w-max block", control: _jsx(Checkbox, { ...field }), label: _jsx(Typography, { variant: "body2", children: "Enti\u00E8rement pay\u00E9" }) })) })] }), _jsx(Controller, { name: "note", control: control, defaultValue: "", render: ({ field }) => (_jsx(TextField, { ...field, id: "large-text", label: "Note", multiline: true, rows: 4, variant: "outlined", fullWidth: true })) }), _jsx(Box, { className: "flex mt-4", children: _jsx(Button, { type: "submit", variant: "contained", className: "w-full md:w-max !px-10 !py-3 rounded-lg !ms-auto", children: "Enregistrer" }) })] })] })] })] }) }));
};
export default PatientOperation;
