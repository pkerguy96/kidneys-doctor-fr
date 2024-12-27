import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, FormControl, InputLabel, MenuItem, Paper, Select, TextField, Typography, } from "@mui/material";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import addGlobal from "../../hooks/addGlobal";
import { SupplierApiClient } from "../../services/SupplierService";
import { useSnackbarStore } from "../../zustand/useSnackbarStore";
import { useLocation, useNavigate } from "react-router";
import getGlobalById from "../../hooks/getGlobalById";
import { CACHE_KEY_Suppliers } from "../../constants";
import updateItem from "../../hooks/updateItem";
import { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
const AddSupplier = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const supplierId = params.get("supplierId");
    const addMutation = addGlobal({}, SupplierApiClient);
    const { showSnackbar } = useSnackbarStore();
    const updateMutation = updateItem({}, SupplierApiClient);
    let SupplierData;
    if (supplierId) {
        const queryResult = getGlobalById({}, [CACHE_KEY_Suppliers[0], supplierId], SupplierApiClient, undefined, parseInt(supplierId));
        SupplierData = queryResult.data;
    }
    const isAddMode = !SupplierData;
    const { control, formState: { errors }, handleSubmit, setValue, } = useForm({
        defaultValues: {
            address: "",
            phone: "",
            email: "",
            contact_person: "",
            company_name: "",
            supply_type: "",
            tax_id: "",
            status: "active",
            note: "",
        },
    });
    const onSubmit = async (data) => {
        try {
            if (!supplierId) {
                await addMutation.mutateAsync(data, {
                    onSuccess: () => {
                        queryClient.invalidateQueries({
                            queryKey: CACHE_KEY_Suppliers,
                            exact: false,
                        });
                        navigate("/Supplier");
                        showSnackbar("Fournisseur ajouté avec succès", "success");
                    },
                    onError: () => {
                        showSnackbar("Le fournisseur n'a pas pu être créé", "error");
                    },
                });
            }
            else {
                await updateUser({ data, supplierId });
            }
        }
        catch (error) { }
    };
    const updateUser = async (updateData) => {
        const { data, supplierId } = updateData;
        if (!supplierId) {
            showSnackbar("L'identifiant du fournisseur est manquant.", "error");
            return;
        }
        await updateMutation.mutateAsync({ data, id: parseInt(supplierId) }, // Ensure ID is included in the API call
        {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: CACHE_KEY_Suppliers,
                    exact: false,
                });
                navigate("/Supplier");
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
            Object.keys(SupplierData ?? {}).forEach((key) => setValue(key, SupplierData[key] ?? ""));
        }
    }, [supplierId, SupplierData]);
    return (_jsx(Paper, { className: "p-4", children: _jsxs(Box, { component: "form", noValidate: true, autoComplete: "off", onSubmit: handleSubmit(onSubmit), className: "w-full flex flex-col gap-6", children: [_jsx(Box, { className: "flex justify-center", children: _jsx(Typography, { id: "modal-modal-title", component: "h2", className: "text-center !text-2xl font-bold", children: "Ajouter un fournisseur" }) }), _jsxs(Box, { className: "w-full flex flex-col gap-4", children: [_jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2", children: [_jsx("label", { htmlFor: "nom", className: "w-full md:w-[200px]", children: "Nom de l'entreprise" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "company_name", control: control, render: ({ field }) => (_jsx(TextField, { ...field, id: "company_name", label: "Nom de l'entreprise", error: !!errors.company_name, helperText: errors.company_name?.message })) }) })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2", children: [_jsx("label", { htmlFor: "nom", className: "w-full md:w-[200px]", children: "Personne de contact" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "contact_person", control: control, render: ({ field }) => (_jsx(TextField, { ...field, id: "contact_person", label: "Personne de contact", error: !!errors.contact_person, helperText: errors.contact_person?.message })) }) })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2", children: [_jsx("label", { htmlFor: "nom", className: "w-full md:w-[200px]", children: "Adresse" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "address", control: control, render: ({ field }) => (_jsx(TextField, { ...field, id: "address", label: "Adresse", error: !!errors.address, helperText: errors.address?.message })) }) })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2", children: [_jsx("label", { htmlFor: "nom", className: "w-full md:w-[200px]", children: "T\u00E9l\u00E9phone" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "phone", control: control, render: ({ field }) => (_jsx(TextField, { type: "tel", ...field, id: "phone", label: "T\u00E9l\u00E9phone", error: !!errors.phone, helperText: errors.phone?.message })) }) })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2", children: [_jsx("label", { htmlFor: "nom", className: "w-full md:w-[200px]", children: "E-mail" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "email", control: control, render: ({ field }) => (_jsx(TextField, { ...field, id: "email", label: "E-mail", error: !!errors.email, helperText: errors.email?.message })) }) })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2", children: [_jsx("label", { htmlFor: "nom", className: "w-full md:w-[200px]", children: "Type de fourniture" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "supply_type", control: control, render: ({ field }) => (_jsx(TextField, { ...field, id: "supply_type", label: "Type de fourniture", error: !!errors.supply_type, helperText: errors.supply_type?.message })) }) })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2", children: [_jsx("label", { htmlFor: "nom", className: "w-full md:w-[200px]", children: "Ice" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "tax_id", control: control, render: ({ field }) => (_jsx(TextField, { ...field, id: "tax_id", label: "Ice", error: !!errors.tax_id, helperText: errors.tax_id?.message })) }) })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2", children: [_jsx("label", { htmlFor: "status", className: "w-full md:w-[200px]", children: "Statut" }), _jsxs(FormControl, { className: "w-full md:flex-1", children: [_jsx(InputLabel, { id: "status-label", children: "Statut" }), _jsx(Controller, { name: "status", control: control, render: ({ field }) => (_jsxs(Select, { ...field, id: "status", labelId: "status-label", label: "Statut", error: !!errors.status, children: [_jsx(MenuItem, { value: "active", children: "Actif" }), _jsx(MenuItem, { value: "inactive", children: "Inactif" })] })) })] })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2", children: [_jsx("label", { htmlFor: "nom", className: "w-full md:w-[200px]", children: "Note" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "note", control: control, render: ({ field }) => (_jsx(TextField, { ...field, id: "outlined-required", multiline: true, rows: 3, label: "Note", error: !!errors.note, helperText: errors.note?.message })) }) })] })] }), _jsx(Box, { className: "flex", children: _jsx(Button, { type: "submit", variant: "contained", className: "w-full md:w-max !px-10 !py-3 rounded-lg !ms-auto", children: "Enregistrer" }) })] }) }));
};
export default AddSupplier;
