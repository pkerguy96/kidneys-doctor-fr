import { createElement as _createElement } from "react";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, FormControl, TextField, Button, TableContainer, Table, TableHead, TableRow, TableCell, TableBody, Autocomplete, IconButton, } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { useSnackbarStore } from "../../zustand/useSnackbarStore";
import { AxiosError } from "axios";
import deleteItem from "../../hooks/deleteItem";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import getGlobal from "../../hooks/getGlobal";
import { CACHE_KEY_ExamenCategory, CACHE_KEY_ExamenPreferences, } from "../../constants";
import addGlobal from "../../hooks/addGlobal";
import LoadingSpinner from "../LoadingSpinner";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { categoryExamenApiClient, deleteExamenCategoryApiClient, ExamenPreferenceApiClient, } from "../../services/ExamenService";
const ExamenDemanderSettings = () => {
    const { showSnackbar } = useSnackbarStore();
    const { data, refetch, isLoading } = getGlobal({}, CACHE_KEY_ExamenPreferences, ExamenPreferenceApiClient, undefined);
    const { data: categorys, isLoading: isLoading2, refetch: refetch2, } = getGlobal({}, CACHE_KEY_ExamenCategory, categoryExamenApiClient, undefined);
    const addmutation = addGlobal({}, ExamenPreferenceApiClient);
    const { control, handleSubmit, reset } = useForm();
    const onSubmit = async (data) => {
        await addmutation.mutateAsync({
            xray_category: data.xray_category,
            Examen_type: data.Examen_type,
            price: data.price,
        }, {
            onSuccess: () => {
                showSnackbar("L'Opération a été créé", "success");
                reset();
                refetch();
                refetch2();
            },
            onError: (error) => {
                const message = error instanceof AxiosError
                    ? error.response?.data?.message
                    : error.message;
                showSnackbar(message, "error");
            },
        });
    };
    const categoryDelete = async (key) => {
        const response = await deleteItem(key, deleteExamenCategoryApiClient);
        if (response) {
            refetch2();
            showSnackbar("La catégorie supprimée avec succès", "success");
        }
        else {
            showSnackbar("La suppression de catégorie a échoué", "error");
        }
    };
    const onDelete = async (key) => {
        const response = await deleteItem(key, ExamenPreferenceApiClient);
        if (response) {
            refetch();
            showSnackbar("La suppression de la Radiographie a réussi", "success");
        }
        else {
            showSnackbar("La suppression de la Radiographie a échoué", "error");
        }
    };
    if (isLoading || isLoading2)
        return _jsx(LoadingSpinner, {});
    return (_jsxs(Box, { className: "flex flex-col w-full h-full p-4 gap-4", component: "form", onSubmit: handleSubmit(onSubmit), children: [_jsx("p", { className: "font-light text-gray-600 text-md md:text-xl text-center", children: "Ajouter un Examen" }), _jsx("p", { className: " text-start font-thin  text-sm md:text-lg", children: "Veuillez entrer les d\u00E9tails de l\u2019examen" }), _jsxs(Box, { className: " flex flex-col md:flex-row gap-4 flex-wrap ", children: [_jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center ", children: [_jsx("label", { htmlFor: "nom", className: "w-full md:w-[160px]", children: "Cat\u00E9gorie:" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "xray_category", control: control, render: ({ field }) => (_jsx(Autocomplete, { freeSolo: true, options: categorys ?? [], value: typeof field.value === "string"
                                            ? field.value
                                            : categorys?.find((c) => c.name === field.value) || "", onChange: (event, newValue) => {
                                            if (typeof newValue === "string") {
                                                field.onChange(newValue);
                                            }
                                            else if (newValue && newValue.name) {
                                                field.onChange(newValue.name);
                                            }
                                            else {
                                                field.onChange("");
                                            }
                                        }, onInputChange: (event, inputValue) => {
                                            field.onChange(inputValue);
                                        }, getOptionLabel: (option) => {
                                            if (typeof option === "string")
                                                return option;
                                            return option.name || "";
                                        }, renderOption: (props, option) => (_createElement("li", { ...props, key: typeof option === "string" ? option : option.id },
                                            _jsxs("div", { className: "flex justify-between items-center w-full", children: [_jsx("span", { children: typeof option === "string" ? option : option.name }), typeof option !== "string" && (_jsx(IconButton, { size: "small", color: "error", onClick: (event) => {
                                                            event.stopPropagation();
                                                            categoryDelete(option.id);
                                                        }, children: _jsx(DeleteOutlineOutlinedIcon, {}) }))] }))), renderInput: (params) => (_jsx(TextField, { ...params, variant: "outlined", placeholder: "S\u00E9lectionnez ou saisissez une cat\u00E9gorie" })), noOptionsText: "Aucune cat\u00E9gorie disponible" })) }) })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center ", children: [_jsx("label", { htmlFor: "nom", className: "w-full md:w-[160px]", children: "Radiographie:" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { defaultValue: "", name: "Examen_type", control: control, render: ({ field }) => (_jsx(TextField, { ...field, id: "Examen_type", label: "Radiographie" })) }) })] }), _jsx(Box, { className: "flex ml-auto mt-4", children: _jsx(Button, { type: "submit", variant: "contained", className: "w-full md:w-max !px-8 !py-2 rounded-lg ", children: "Ajouter" }) })] }), _jsx(TableContainer, { className: "w-full max-h-[400px] flex-wrap overflow-auto border border-gray-300", children: _jsxs(Table, { "aria-label": "simple table", children: [_jsx(TableHead, { children: _jsxs(TableRow, { className: "bg-gray-300 !rounded-2xl\tsticky top-0 z-10", children: [_jsx(TableCell, { children: _jsx("strong", { children: "Nom de la cat\u00E9gorie" }) }), _jsx(TableCell, { children: _jsx("strong", { children: "Nom de la radiographie" }) }), _jsx(TableCell, { className: "w-20" })] }) }), _jsx(TableBody, { children: data?.map((xray, index) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: xray.category }), _jsx(TableCell, { children: xray.Examen_type }), _jsx(TableCell, { className: "w-20", children: _jsx(Button, { onClick: () => onDelete(xray.id), className: "w-max mx-auto", variant: "outlined", color: "error", disabled: xray.id === undefined, children: _jsx(DeleteOutlineIcon, {}) }) })] }, index))) })] }) })] }));
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
export default ExamenDemanderSettings;
