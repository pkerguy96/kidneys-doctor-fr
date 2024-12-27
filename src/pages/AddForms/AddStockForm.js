import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, TextField, Typography, } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import addGlobal from "../../hooks/addGlobal";
import { StockApiClient } from "../../services/StockService";
import { useSnackbarStore } from "../../zustand/useSnackbarStore";
import { useLocation, useNavigate } from "react-router";
import getGlobalById from "../../hooks/getGlobalById";
import { CACHE_KEY_Products } from "../../constants";
import { useEffect } from "react";
import updateItem from "../../hooks/updateItem";
import { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
const AddStockForm = () => {
    const queryClient = useQueryClient();
    const { showSnackbar } = useSnackbarStore();
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const id = params.get("id");
    const addMutation = addGlobal({}, StockApiClient, undefined);
    const updateMutation = updateItem({}, StockApiClient);
    const { handleSubmit, control, formState: { errors }, setValue, } = useForm({
        defaultValues: {
            bar_code: "",
            product_name: "",
            product_family: "Aucune",
            product_nature: "",
            min_stock: 0,
            qte: 0,
        },
    });
    let productData;
    if (id) {
        const queryResult = getGlobalById({}, [CACHE_KEY_Products[0], id], StockApiClient, undefined, parseInt(id));
        productData = queryResult.data;
    }
    const isAddMode = !productData;
    const onSubmit = async (data) => {
        try {
            if (!id) {
                await addMutation.mutateAsync(data, {
                    onSuccess: (data) => {
                        navigate("/Stock");
                        showSnackbar(data.message, "success");
                        queryClient.invalidateQueries(CACHE_KEY_Products);
                    },
                });
            }
            else {
                await updateProduct({ data, id });
            }
        }
        catch (error) {
            const errorMessage = error?.response?.data?.message || "Une erreur s'est produite";
            showSnackbar(errorMessage, "error");
        }
    };
    const updateProduct = async (updateData) => {
        const { data, id } = updateData;
        if (!id) {
            showSnackbar("L'identifiant du fournisseur est manquant.", "error");
            return;
        }
        await updateMutation.mutateAsync({ data, id: parseInt(id) }, {
            onSuccess: () => {
                showSnackbar("Fournisseur modifié avec succès.", "success");
                navigate("/Stock");
            },
            onError: (error) => {
                const message = error instanceof AxiosError
                    ? error.response?.data?.message
                    : error.message;
                showSnackbar(message, "warning");
            },
        });
    };
    useEffect(() => {
        if (!isAddMode) {
            Object.keys(productData ?? {}).forEach((key) => setValue(key, productData[key] ?? ""));
        }
    }, [id, productData]);
    return (_jsx(Paper, { className: "p-4", children: _jsxs(Box, { component: "form", noValidate: true, autoComplete: "off", onSubmit: handleSubmit(onSubmit), className: "w-full flex flex-col gap-6", children: [_jsx(Box, { className: "flex justify-center", children: _jsx(Typography, { id: "modal-modal-title", component: "h2", className: "text-center !text-2xl font-bold", children: "Cr\u00E9er un produit" }) }), _jsxs(Box, { className: "w-full flex flex-col gap-4", children: [_jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2", children: [_jsx("label", { htmlFor: "nom", className: "w-full md:w-[200px]", children: "Code \u00E0 barres" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "bar_code", control: control, render: ({ field }) => (_jsx(TextField, { ...field, id: "bar_code", label: "Code \u00E0 barres", error: !!errors.bar_code, helperText: errors.bar_code?.message })) }) })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2", children: [_jsx("label", { htmlFor: "nom", className: "w-full md:w-[200px]", children: "D\u00E9signation du produit" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "product_name", control: control, rules: { required: "Le champ Désignation est requis." }, render: ({ field }) => (_jsx(TextField, { ...field, id: "product_name", label: "d\u00E9signation du produit", error: !!errors.product_name, helperText: errors.product_name?.message })) }) })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center", children: [_jsx("label", { htmlFor: "product_family", className: "w-full md:w-[200px]", children: "famille de produit" }), _jsxs(FormControl, { className: "w-full md:flex-1", children: [_jsx(InputLabel, { id: "demo-select-small-label", children: "famille de produit" }), _jsx(Controller, { name: "product_family", control: control, rules: { required: "Le champ  famille de produit est requis." }, render: ({ field }) => (_jsxs(Select, { ...field, labelId: "demo-select-small-label", id: "demo-select-small", label: "product_family", error: !!errors.product_family, children: [_jsx(MenuItem, { value: "Aucune", children: _jsx("em", { children: "Aucune" }) }), _jsx(MenuItem, { value: "M\u00E9dical", children: "M\u00E9dical" }), _jsx(MenuItem, { value: "Param\u00E9dical", children: "Param\u00E9dical" }), _jsx(MenuItem, { value: "Ost\u00E9osynth\u00E8se", children: "Ost\u00E9osynth\u00E8se" }), _jsx(MenuItem, { value: "Instruments", children: "Instruments" }), _jsx(MenuItem, { value: "Autres", children: "Autres" })] })) })] })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2", children: [_jsx("label", { htmlFor: "nom", className: "w-full md:w-[200px]", children: "Nature du produit" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "product_nature", control: control, render: ({ field }) => (_jsx(TextField, { ...field, id: "product_nature", label: "Nature du produit", error: !!errors.product_nature, helperText: errors.product_nature?.message })) }) })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2", children: [_jsx("label", { htmlFor: "nom", className: "w-full md:w-[200px]", children: "Min stock" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "min_stock", control: control, render: ({ field }) => (_jsx(TextField, { ...field, type: "number", id: "min_stock", label: "Stock minimum", error: !!errors.min_stock, helperText: errors.min_stock?.message })) }) })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2", children: [_jsx("label", { htmlFor: "nom", className: "w-full md:w-[200px]", children: "Quantit\u00E9 en stock" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "qte", control: control, render: ({ field }) => (_jsx(TextField, { ...field, type: "number", id: "qte", label: "Quantit\u00E9", error: !!errors.qte, helperText: errors.qte?.message })) }) })] })] }), _jsx(Box, { className: "flex", children: _jsx(Button, { type: "submit", variant: "contained", className: "w-full md:w-max !px-10 !py-3 rounded-lg !ms-auto", children: "Enregistrer" }) })] }) }));
};
export default AddStockForm;
