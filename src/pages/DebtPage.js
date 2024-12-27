import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Controller, useForm } from "react-hook-form";
import { useState } from "react";
import { Autocomplete, Box, Button, Chip, FormControl, Paper, TextField, Typography, } from "@mui/material";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import DebtTableComponant from "../components/Tables/DebtTableComponant";
import addGlobal from "../hooks/addGlobal";
import { PatientsDebtKpiClient, } from "../services/KpisService";
import { CACHE_KEY_Hospitals } from "../constants";
import getGlobal from "../hooks/getGlobal";
import { hospitalApiClient } from "../services/HospitalService";
import LoadingSpinner from "../components/LoadingSpinner";
import useUserRoles from "../zustand/UseRoles";
const DebtPage = () => {
    const { can } = useUserRoles();
    const [data, setData] = useState([]);
    const { data: hospitals, refetch, isLoading, } = getGlobal({}, CACHE_KEY_Hospitals, hospitalApiClient, undefined);
    const addMutation = addGlobal({}, PatientsDebtKpiClient, undefined);
    const hasAccess = can(["access_creance", "doctor"]);
    if (!hasAccess) {
        return (_jsx("div", { style: { textAlign: "center", color: "red", marginTop: "20px" }, children: "Vous n'avez pas la permission de consulter cette page." }));
    }
    const { handleSubmit, control, getValues, formState: { errors }, } = useForm();
    const todayDate = new Date().toISOString().split("T")[0];
    const onSubmit = async (formData) => {
        setData([]);
        await addMutation.mutateAsync(formData, {
            onSuccess: (response) => {
                const transformedData = response?.data?.map((item) => ({
                    name: item.name,
                    date: item.date,
                    operation_type: item.operation_type,
                    total_cost: `${item.total_cost.toFixed(2)} MAD`,
                    total_amount_paid: `${item.total_amount_paid.toFixed(2)} MAD`,
                    amount_due: `${item.amount_due.toFixed(2)} MAD`,
                }));
                setData(transformedData);
            },
        });
    };
    if (isLoading)
        return _jsx(LoadingSpinner, {});
    return (_jsx(Paper, { className: "p-4", children: _jsxs(Box, { component: "form", className: "w-full flex flex-col gap-6", autoComplete: "off", onSubmit: handleSubmit(onSubmit), children: [_jsx(Box, { className: "flex justify-center", children: _jsx(Typography, { id: "modal-modal-title", component: "h2", className: "text-center !text-2xl font-bold", children: "Page des cr\u00E9ances" }) }), _jsxs(Box, { className: "w-full flex flex-col md:flex-row gap-4 items-end flex-wrap", children: [_jsxs(Box, { className: "flex w-full md:w-0 items-start gap-1 flex-1 flex-col", children: [_jsx("label", { htmlFor: "date", children: "Date de d\u00E9but:" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "date", defaultValue: todayDate, control: control, render: ({ field }) => (_jsx(TextField, { required: true, type: "date", ...field, id: "date" })) }) })] }), _jsxs(Box, { className: "flex w-full md:w-0  items-start gap-1 flex-1 flex-col", children: [_jsx("label", { htmlFor: "date2", children: "Date de fin\u00A0:" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "date2", defaultValue: "", control: control, rules: {
                                            validate: (value) => {
                                                const startDate = new Date(getValues("date"));
                                                const currentDate = new Date(value);
                                                return (startDate <= currentDate ||
                                                    "La date de fin doit être après la date de début.");
                                            },
                                        }, render: ({ field }) => (_jsx(TextField, { required: true, type: "date", ...field, id: "date2", error: !!errors.date2, helperText: errors.date2
                                                ? errors.date2.message
                                                : "" })) }) })] }), _jsx(Box, { className: "flex w-full md:w-0 flex-row items-center flex-1 ", children: _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "hospitals", control: control, render: ({ field }) => (_jsx(Autocomplete, { className: "bg-white", multiple: true, id: "tags-filled", options: [
                                            { id: "tout", name: "tout" },
                                            ...hospitals.map((option) => ({
                                                id: option.id,
                                                name: option.name,
                                            })), // Use ID and name for hospitals
                                        ], getOptionLabel: (option) => option.name, defaultValue: [], value: field.value === "tout"
                                            ? [{ id: "tout", name: "tout" }]
                                            : hospitals.filter((option) => Array.isArray(field.value)
                                                ? field.value.includes(option.id)
                                                : false), isOptionEqualToValue: (option, value) => option.id === value.id, onChange: (event, newValue) => {
                                            // Handle the "tout" logic
                                            if (newValue.some((item) => item.id === "tout")) {
                                                field.onChange("tout"); // Set value to "tout"
                                            }
                                            else {
                                                field.onChange(newValue.map((item) => item.id)); // Send IDs only
                                            }
                                        }, freeSolo: true, renderTags: (value, getTagProps) => value.map((option, index) => {
                                            const { key, ...tagProps } = getTagProps({ index });
                                            return (_jsx(Chip, { variant: "outlined", label: option.name, ...tagProps }, key));
                                        }), renderInput: (params) => (_jsx(TextField, { ...params, variant: "outlined", placeholder: "Cliniques", sx: autocompleteStyles })) })) }) }) }), _jsx(Box, { className: "flex md:ml-auto", children: _jsx(Button, { type: "submit", variant: "outlined", startIcon: _jsx(SearchOutlinedIcon, {}), className: "w-full md:w-max !px-10 !py-4 rounded-lg !ml-auto", children: "Recherche" }) })] }), _jsx(DebtTableComponant, { data: data })] }) }));
};
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
export default DebtPage;
