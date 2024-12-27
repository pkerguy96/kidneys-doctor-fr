import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, FormControl, TextField, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useSnackbarStore } from "../../zustand/useSnackbarStore";
import { AxiosError } from "axios";
import deleteItem from "../../hooks/deleteItem";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import getGlobal from "../../hooks/getGlobal";
import { CACHE_KEY_BloodTestPreference } from "../../constants";
import addGlobal from "../../hooks/addGlobal";
import LoadingSpinner from "../LoadingSpinner";
import { bloodTestprefApiClient } from "../../services/BloodTest";
const BloodTestSettings = () => {
    const { showSnackbar } = useSnackbarStore();
    const { data, refetch, isLoading } = getGlobal({}, CACHE_KEY_BloodTestPreference, bloodTestprefApiClient, undefined);
    const addmutation = addGlobal({}, bloodTestprefApiClient);
    const { control, handleSubmit, reset } = useForm();
    const onSubmit = async (data) => {
        await addmutation.mutateAsync({
            title: data.title,
            price: data.price,
            code: data.code,
            delai: data.delai,
        }, {
            onSuccess: () => {
                showSnackbar("L'Opération a été créé", "success");
                reset();
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
        const response = await deleteItem(key, bloodTestprefApiClient);
        if (response) {
            refetch();
            showSnackbar("La suppression de la Radiographie a réussi", "success");
        }
        else {
            showSnackbar("La suppression de la Radiographie a échoué", "error");
        }
    };
    if (isLoading)
        return _jsx(LoadingSpinner, {});
    return (_jsxs(Box, { className: "flex flex-col w-full h-full p-4 gap-4", component: "form", onSubmit: handleSubmit(onSubmit), children: [_jsx("p", { className: "font-light text-gray-600 text-md md:text-xl text-center", children: "Ajouter des analyses de laboratoire" }), _jsx("p", { className: " text-start font-thin  text-sm md:text-lg", children: "Entrez les informations des analyses." }), _jsxs(Box, { className: " flex flex-col md:flex-row gap-4 flex-wrap ", children: [_jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center ", children: [_jsx("label", { htmlFor: "nom", className: "w-full md:w-[160px]", children: "Titre:" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { defaultValue: "", name: "title", control: control, render: ({ field }) => (_jsx(TextField, { ...field, id: "title", label: "Titre" })) }) })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center ", children: [_jsx("label", { htmlFor: "nom", className: "w-full md:w-[160px]", children: "Code:" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { defaultValue: "", name: "code", control: control, render: ({ field }) => (_jsx(TextField, { ...field, id: "code", label: "Code" })) }) })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center", children: [_jsx("label", { htmlFor: "price", className: "w-full md:w-[160px]", children: "Prix:" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller
                                //@ts-ignore
                                , { 
                                    //@ts-ignore
                                    defaultValue: 0.0, name: "price", control: control, render: ({ field }) => (_jsx(TextField, { ...field, id: "price", type: "number", label: "Prix" })) }) })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center", children: [_jsx("label", { htmlFor: "price", className: "w-full md:w-[160px]", children: "D\u00E9lai:" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller
                                //@ts-ignore
                                , { 
                                    //@ts-ignore
                                    defaultValue: "", name: "delai", control: control, render: ({ field }) => (_jsx(TextField, { ...field, id: "delai", type: "text", label: "D\u00E9lai" })) }) })] }), _jsx(Box, { className: "flex ml-auto mt-4", children: _jsx(Button, { type: "submit", variant: "contained", className: "w-full md:w-max !px-8 !py-2 rounded-lg ", children: "Ajouter" }) })] }), _jsx(TableContainer, { className: "w-full max-h-[400px] flex-wrap overflow-auto border border-gray-300", children: _jsxs(Table, { "aria-label": "simple table", children: [_jsx(TableHead, { children: _jsxs(TableRow, { className: "bg-gray-300 !rounded-2xl\tsticky top-0 z-10", children: [_jsx(TableCell, { children: _jsx("strong", { children: "Titre" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Code" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Prix" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "D\u00E9lai" }) }), _jsx(TableCell, { className: "w-20" })] }) }), _jsx(TableBody, { children: data?.map((xray, index) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: xray.title }), _jsx(TableCell, { children: xray.code }), _jsxs(TableCell, { children: [xray.price, " MAD"] }), _jsx(TableCell, { children: xray.delai }), _jsx(TableCell, { className: "w-20", children: _jsx(Button, { onClick: () => onDelete(xray.id), className: "w-max mx-auto", variant: "outlined", color: "error", disabled: xray.id === undefined, children: _jsx(DeleteOutlineIcon, {}) }) })] }, index))) })] }) })] }));
};
const autocompleteStyles = {
    "& .MuiOutlinedInput-root": {
        backgroundColor: "white",
        borderColor: "rgba(0, 0, 0, 0.23)",
        "& fieldset": {
            borderColor: "rgba(0, 0, 0, 0.23)", // Ensures the border is visible when not focused
        },
        "&:hover fieldset": {
            borderColor: "dark", // Darker border on hover
        },
        "&.Mui-focused fieldset": {
            borderColor: "primary.main", // Border color on focus
        },
    },
};
export default BloodTestSettings;
