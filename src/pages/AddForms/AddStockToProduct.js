import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Paper, Box, FormControl, TextField, InputLabel, Select, MenuItem, Button, Typography, } from "@mui/material";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import getGlobal from "../../hooks/getGlobal";
import { SupplierNamesApiClient, SupplierProductApiClient, } from "../../services/SupplierService";
import { CACHE_KEY_Products, CACHE_KEY_StockEntry, CACHE_KEY_StockEntryUpdate, CACHE_KEY_SupplierTinyData, } from "../../constants";
import LoadingSpinner from "../../components/LoadingSpinner";
import addGlobal from "../../hooks/addGlobal";
import { useSnackbarStore } from "../../zustand/useSnackbarStore";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import getGlobalById from "../../hooks/getGlobalById";
import updateItem from "../../hooks/updateItem";
import { AxiosError } from "axios";
const AddStockToProduct = () => {
    const queryParams = new URLSearchParams(location.search);
    const product_id = queryParams.get("id");
    const StockOperationId = queryParams.get("stockoperation");
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbarStore();
    const queryClient = useQueryClient();
    const { control, formState: { errors }, handleSubmit, setValue, } = useForm({
        defaultValues: {
            supplier_id: "",
            quantity: 0,
            sell_price: 0,
            buy_price: 0,
            expiry_date: new Date().toISOString().split("T")[0],
            invoice: "",
        },
    });
    const updateMutation = updateItem({}, SupplierProductApiClient);
    const { data, isLoading } = getGlobal({}, CACHE_KEY_SupplierTinyData, SupplierNamesApiClient, undefined);
    let SupplierProductData;
    if (StockOperationId) {
        const queryResult = getGlobalById({}, [CACHE_KEY_StockEntryUpdate[0], StockOperationId], SupplierProductApiClient, undefined, parseInt(StockOperationId));
        SupplierProductData = queryResult.data;
    }
    const isAddMode = !SupplierProductData;
    const addMutation = addGlobal({}, SupplierProductApiClient);
    const onSubmit = async (data) => {
        const formdata = {
            product_id: parseInt(product_id),
            ...data,
        };
        try {
            if (!StockOperationId) {
                await addMutation.mutateAsync(formdata, {
                    onSuccess: () => {
                        showSnackbar("Stock mis à jour avec succès", "success");
                        navigate("/Stock");
                        queryClient.invalidateQueries(CACHE_KEY_Products);
                        queryClient.invalidateQueries(CACHE_KEY_StockEntry);
                    },
                });
            }
            else {
                updateUser({ data, StockOperationId });
                queryClient.invalidateQueries(CACHE_KEY_Products);
                queryClient.invalidateQueries(CACHE_KEY_StockEntry);
            }
        }
        catch (error) { }
    };
    const updateUser = async (updateData) => {
        const { data, StockOperationId } = updateData;
        if (!StockOperationId) {
            showSnackbar("L'identifiant d'operation est manquant.", "error");
            return;
        }
        await updateMutation.mutateAsync({ data, id: parseInt(StockOperationId) }, // Ensure ID is included in the API call
        {
            onSuccess: () => {
                showSnackbar("Fournisseur modifié avec succès.", "success");
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
            Object.keys(SupplierProductData ?? {}).forEach((key) => setValue(key, SupplierProductData[key] ?? ""));
        }
    }, [StockOperationId, SupplierProductData]);
    if (isLoading)
        return _jsx(LoadingSpinner, {});
    return (_jsx(Paper, { className: "p-4", children: _jsxs(Box, { component: "form", noValidate: true, autoComplete: "off", onSubmit: handleSubmit(onSubmit), className: "w-full flex flex-col gap-6", children: [_jsx(Box, { className: "flex justify-center", children: _jsx(Typography, { id: "modal-modal-title", component: "h2", className: "text-center !text-2xl font-bold", children: "Ajouter du stock" }) }), _jsxs(Box, { className: "w-full flex flex-col gap-4", children: [_jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center", children: [_jsx("label", { htmlFor: "Fournisseur", className: "w-full md:w-[200px]", children: "Fournisseur" }), _jsxs(FormControl, { className: "w-full md:flex-1", children: [_jsx(InputLabel, { id: "demo-select-small-label", children: "Fournisseur" }), _jsx(Controller, { name: "supplier_id" // Use supplier_id instead of supplier_name
                                            , control: control, rules: { required: "Le champ fournisseur est requis." }, render: ({ field }) => (_jsx(Select, { ...field, labelId: "demo-select-small-label", id: "demo-select-small", label: "Fournisseur", error: !!errors.supplier_id, children: data && data.length > 0 ? (data.map((supplier) => (_jsx(MenuItem, { value: supplier.id, children: supplier.name }, supplier.id)))) : (_jsx(MenuItem, { value: "none", disabled: true, children: _jsx("em", { children: "Aucun fournisseur disponible" }) })) })) })] })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2", children: [_jsx("label", { htmlFor: "expiry_date", className: "w-full md:w-[200px]", children: "Date de p\u00E9remption" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "expiry_date", control: control, rules: { required: "Le champ date est requis." }, render: ({ field }) => (_jsx(TextField, { type: "date", ...field, id: "expiry_date", error: !!errors.expiry_date, helperText: errors.expiry_date?.message })) }) })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2", children: [_jsx("label", { htmlFor: "quantity", className: "w-full md:w-[200px]", children: "Quantit\u00E9 entrant" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "quantity", control: control, render: ({ field }) => (_jsx(TextField, { ...field, id: "quantity", label: "Quantit\u00E9", type: "number", error: !!errors.quantity, helperText: errors.quantity?.message })) }) })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2", children: [_jsx("label", { htmlFor: "price", className: "w-full md:w-[200px]", children: "Prix unitaire d'achat" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "buy_price", control: control, render: ({ field }) => (_jsx(TextField, { type: "number", ...field, id: "buy_price", label: "Prix d'achat", error: !!errors.buy_price, helperText: errors.buy_price?.message })) }) })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2", children: [_jsx("label", { htmlFor: "price", className: "w-full md:w-[200px]", children: "Prix unitaire de vente" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "sell_price", control: control, render: ({ field }) => (_jsx(TextField, { type: "number", ...field, id: "sell_price", label: "Prix de vente", error: !!errors.sell_price, helperText: errors.sell_price?.message })) }) })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2", children: [_jsx("label", { htmlFor: "price", className: "w-full md:w-[200px]", children: "Num\u00E9ro de facture" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "invoice", control: control, render: ({ field }) => (_jsx(TextField, { type: "text", ...field, id: "invoice", label: "Facture", error: !!errors.invoice, helperText: errors.invoice?.message })) }) })] })] }), _jsx(Box, { className: "flex", children: _jsx(Button, { type: "submit", variant: "contained", className: "w-full md:w-max !px-10 !py-3 rounded-lg !ms-auto", children: "Enregistrer" }) })] }) }));
};
export default AddStockToProduct;
