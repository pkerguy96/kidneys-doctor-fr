import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Paper, Box, FormControl, TextField, Button, Typography, } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { SearchHospitalApiClient, } from "../../services/OutsourceOperationService";
import addGlobal from "../../hooks/addGlobal";
import { hospitalOperationApiClient } from "../../services/HospitalService";
import { useSnackbarStore } from "../../zustand/useSnackbarStore";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import PatientSearchAutocomplete from "../../components/PatientSearchAutocomplete";
import { useMemo } from "react";
const AddOutsourceOperation = () => {
    const queryClient = useQueryClient();
    const { showSnackbar } = useSnackbarStore();
    const navigate = useNavigate();
    const defaultValues = useMemo(() => ({
        patient: null,
        hospital: null,
        operation_type: "",
        description: "",
        operation_date: new Date().toISOString().split("T")[0],
        total_price: 0,
        amount_paid: 0,
        fee: 0,
    }), []);
    const addmutation = addGlobal({}, hospitalOperationApiClient);
    const { control, handleSubmit, formState: { errors }, } = useForm({
        defaultValues,
    });
    const onSubmit = async (data) => {
        const transformedData = {
            operation_id: null,
            hospital_id: data.hospital?.id || 0,
            patient_id: data.patient?.id || 0,
            operation_type: data.operation_type,
            description: data.description,
            operation_date: data.operation_date,
            total_price: Number(data.total_price),
            amount_paid: Number(data.amount_paid),
            fee: Number(data.fee),
        };
        try {
            await addmutation.mutateAsync(transformedData, {
                onSuccess: () => {
                    showSnackbar("Opération créée avec succès", "success");
                    queryClient.invalidateQueries(["CACHE_KEY_Hospitaloperations"]);
                    navigate("/External");
                },
                onError: (Error) => {
                    console.log(Error.response.data.message);
                    showSnackbar(Error.response.data.message, "error");
                },
            });
        }
        catch (error) { }
    };
    return (_jsx(Paper, { className: "p-4", children: _jsxs(Box, { component: "form", noValidate: true, autoComplete: "off", onSubmit: handleSubmit(onSubmit), className: "w-full flex flex-col gap-6", children: [_jsx(Box, { className: "flex justify-center", children: _jsx(Typography, { id: "modal-modal-title", component: "h2", className: "text-center !text-2xl font-bold", children: "Ajouter une op\u00E9ration" }) }), _jsxs(Box, { className: "w-full flex flex-col gap-4", children: [_jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2", children: [_jsx("label", { htmlFor: "patient", className: "w-full md:w-[200px]", children: "Patient" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "patient", control: control, rules: { required: "Veuillez sélectionner un patient." }, render: ({ field }) => (_jsx(PatientSearchAutocomplete, { setPatient: field.onChange, showExternalLabel: false })) }) })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2", children: [_jsx("label", { htmlFor: "hospital", className: "w-full md:w-[200px]", children: "Clinique" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "hospital", control: control, rules: { required: "Veuillez sélectionner un clinique." }, render: ({ field }) => (_jsx(PatientSearchAutocomplete, { label: "Rechercher un clinique", setPatient: field.onChange, showExternalLabel: false, ApiClient: SearchHospitalApiClient, empty: "Aucun clinique trouvé" })) }) })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2", children: [_jsx("label", { htmlFor: "operation_type", className: "w-full md:w-[200px]", children: "Type d'op\u00E9ration" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "operation_type", control: control, rules: { required: "Veuillez entrer le type d'opération." }, render: ({ field }) => (_jsx(TextField, { ...field, id: "operation_type", label: "Type d'op\u00E9ration", error: !!errors.operation_type, helperText: errors.operation_type?.message })) }) })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2", children: [_jsx("label", { htmlFor: "description", className: "w-full md:w-[200px]", children: "Description" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "description", control: control, rules: { required: "Veuillez entrer une description." }, render: ({ field }) => (_jsx(TextField, { ...field, id: "description", label: "Description", error: !!errors.description, helperText: errors.description?.message })) }) })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2", children: [_jsx("label", { htmlFor: "date", className: "w-full md:w-[200px]", children: "Date" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "operation_date", control: control, rules: { required: "Veuillez sélectionner une date." }, render: ({ field }) => (_jsx(TextField, { ...field, id: "operation_date", type: "date", error: !!errors.operation_date, helperText: errors.operation_date?.message })) }) })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2", children: [_jsx("label", { htmlFor: "total_price", className: "w-full md:w-[200px]", children: "Prix \u200B\u200Btotal" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "total_price", control: control, rules: { required: "Veuillez entrer le prix." }, render: ({ field }) => (_jsx(TextField, { ...field, id: "total_price", label: "Prix", type: "number", error: !!errors.total_price, helperText: errors.total_price?.message })) }) })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2", children: [_jsx("label", { htmlFor: "total_price", className: "w-full md:w-[200px]", children: "Les honoraires" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "fee", control: control, rules: { required: "Veuillez entrer le prix." }, render: ({ field }) => (_jsx(TextField, { ...field, id: "fee", label: "honoraires", type: "number", error: !!errors.fee, helperText: errors.fee?.message })) }) })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2", children: [_jsx("label", { htmlFor: "amount_paid", className: "w-full md:w-[200px]", children: "Montant pay\u00E9" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "amount_paid", control: control, rules: { required: "Veuillez entrer le prix." }, render: ({ field }) => (_jsx(TextField, { ...field, id: "amount_paid", label: "Prix", type: "number", error: !!errors.amount_paid, helperText: errors.amount_paid?.message })) }) })] })] }), _jsx(Box, { className: "flex", children: _jsx(Button, { type: "submit", variant: "contained", className: "w-full md:w-max !px-10 !py-3 rounded-lg !ms-auto", children: "Enregistrer" }) })] }) }));
};
export default AddOutsourceOperation;
