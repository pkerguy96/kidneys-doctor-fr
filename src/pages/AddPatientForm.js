import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Autocomplete, Box, Button, Chip, FormControl, InputLabel, MenuItem, Paper, Select, TextField, Typography, } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAddPatientMutation } from "../hooks/addPatient";
import { calculateAge } from "../utils/dateUtils";
import { useSnackbarStore } from "../zustand/useSnackbarStore";
import updatePatient from "../hooks/updatePatient";
import { Allergies, CACHE_KEY_PATIENTS, Maladies, referral, } from "../constants";
import patientAPIClient from "../services/PatientService";
import { AxiosError } from "axios";
import getGlobalById from "../hooks/getGlobalById";
import { useQueryClient } from "@tanstack/react-query";
const AddPatient = () => {
    const queryClient = useQueryClient();
    const [age, setAge] = useState(0);
    const { id } = useParams();
    const { showSnackbar } = useSnackbarStore();
    const navigate = useNavigate();
    const { handleSubmit, control, setValue, register, formState: { errors }, } = useForm({
        defaultValues: {
            nom: "",
            prenom: "",
            cin: "",
            date: "",
            sex: "",
            address: "",
            phoneNumber: "",
            mutuelle: "",
            agecalc: "",
            note: "",
            allergy: [],
            disease: [],
            referral: [],
        },
    });
    let PatientData;
    if (id) {
        const queryResult = getGlobalById({}, [CACHE_KEY_PATIENTS[0], id], patientAPIClient, undefined, parseInt(id));
        PatientData = queryResult.data;
    }
    const isAddMode = !id;
    useEffect(() => {
        if (!isAddMode) {
            Object.keys(PatientData ?? {}).forEach((key) => setValue(key, PatientData[key] ?? ""));
            if (PatientData?.date) {
                setAge(calculateAge(PatientData.date));
            }
        }
    }, [PatientData, id]);
    // Specify Patient as the generic type for useForm
    const addPatientMutation = useAddPatientMutation(() => { });
    const updatePatientMutation = updatePatient(() => { });
    const onSubmit = async (data) => {
        console.log(data);
        try {
            try {
                if (isAddMode) {
                    await createUser(data);
                }
                else {
                    await updateUser(data);
                }
                queryClient.invalidateQueries(CACHE_KEY_PATIENTS, { exact: false });
                navigate("/Patients");
            }
            catch (error) {
                const message = error instanceof AxiosError
                    ? error.response?.data?.message
                    : error.message;
                showSnackbar(message, "error");
            }
        }
        catch (error) {
            const message = error instanceof AxiosError
                ? error.response?.data?.message
                : error.message;
            showSnackbar(message, "error");
        }
    };
    const updateUser = async (data) => {
        await updatePatientMutation.mutateAsync({ data, id }, {
            onSuccess: () => {
                showSnackbar("Patient modifié avec succès.", "success");
            },
            onError: (error) => {
                const message = error instanceof AxiosError
                    ? error.response?.data?.message
                    : error.message;
                showSnackbar(message, "warning");
            },
        });
    };
    const createUser = async (formData) => {
        await addPatientMutation.mutateAsync(formData, {
            onSuccess: () => {
                showSnackbar("Patient ajouté avec succès.", "success");
            },
            onError: (error) => {
                const message = error instanceof AxiosError
                    ? error.response?.data?.message
                    : error.message;
                showSnackbar(message, "warning");
            },
        });
    };
    // Watch the 'date' field and calculate age whenever it changes
    register("date", {
        onChange: (e) => {
            setAge(calculateAge(e.target.value));
        },
    });
    return (_jsx(Paper, { className: "p-4", children: _jsxs(Box, { component: "form", noValidate: true, autoComplete: "off", onSubmit: handleSubmit(onSubmit), className: "w-full flex flex-col gap-6", children: [_jsx(Box, { className: "flex justify-center", children: _jsx(Typography, { id: "modal-modal-title", component: "h2", className: "text-center !text-2xl font-bold", children: isAddMode ? "Ajouter un patient" : "Modifier le patient" }) }), _jsxs(Box, { className: "w-full flex flex-col gap-4", children: [_jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2", children: [_jsx("label", { htmlFor: "nom", className: "w-full md:w-[200px]", children: "Nom:" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "nom", control: control, rules: { required: "Le champ Nom est requis." }, defaultValue: PatientData ? PatientData.nom : "", render: ({ field }) => (_jsx(TextField, { ...field, id: "nom", label: "Nom", error: !!errors.nom, helperText: errors.nom?.message })) }) })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center", children: [_jsx("label", { htmlFor: "nom", className: "w-full md:w-[200px]", children: "Prenom:" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "prenom", control: control, rules: { required: "Le champ Prenom est requis." }, render: ({ field }) => (_jsx(TextField, { ...field, id: "outlined-required", label: "Prenom", error: !!errors.prenom, helperText: errors.prenom?.message })) }) })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center", children: [_jsxs(Box, { className: "w-full md:flex-1 flex flex-col gap-2 md:flex-row md:flex-wrap items-center", children: [_jsx("label", { htmlFor: "date", className: "w-full md:w-[200px]", children: "Date de naissance:" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "date", control: control, rules: {
                                                    required: "Le champ Date est requis.",
                                                    validate: (value) => {
                                                        const selectedDate = new Date(value);
                                                        const currentDate = new Date();
                                                        return (selectedDate <= currentDate ||
                                                            "La date ne peut pas être dans le futur.");
                                                    },
                                                }, render: ({ field }) => (_jsx(TextField, { type: "date", ...field, id: "outlined-required", error: !!errors.date, helperText: errors.date?.message })) }) })] }), _jsxs(Box, { className: "w-full md:w-[300px] flex flex-col gap-2 md:flex-row md:flex-wrap items-center", children: [_jsx("label", { htmlFor: "agecalc", className: "w-full md:w-[100px]", children: "age calcule:" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "agecalc", control: control, render: ({ field }) => (_jsx(TextField, { ...field, id: "outlined-required", disabled: true, value: age })) }) })] })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center", children: [_jsx("label", { htmlFor: "cin", className: "w-full md:w-[200px]", children: "Cin:" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "cin", control: control, render: ({ field }) => (_jsx(TextField, { ...field, id: "outlined-required", label: "Cin", error: !!errors.cin, helperText: errors.cin?.message })) }) })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center", children: [_jsx("label", { htmlFor: "sex", className: "w-full md:w-[200px]", children: "Sex:" }), _jsxs(FormControl, { className: "w-full md:flex-1", children: [_jsx(InputLabel, { id: "demo-select-small-label", children: "Sex" }), _jsx(Controller, { name: "sex", control: control, rules: { required: "Le champ Sex est requis." }, render: ({ field }) => (_jsxs(Select, { ...field, labelId: "demo-select-small-label", id: "demo-select-small", label: "sex", error: !!errors.sex, children: [_jsx(MenuItem, { value: "male", children: "Male" }), _jsx(MenuItem, { value: "female", children: "Female" })] })) })] })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center", children: [_jsx("label", { htmlFor: "address", className: "w-full md:w-[200px]", children: "Adresse:" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "address", control: control, rules: { required: "Le champ Address est requis." }, render: ({ field }) => (_jsx(TextField, { ...field, id: "outlined-required", label: "Adresse", error: !!errors.address, helperText: errors.address?.message })) }) })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center", children: [_jsx("label", { htmlFor: "phoneNumber", className: "w-full md:w-[200px]", children: "Telephone:" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "phoneNumber", control: control, rules: { required: "Le champ Telephone est requis." }, render: ({ field }) => (_jsx(TextField, { ...field, id: "outlined-required", label: "Phone Number", error: !!errors.phoneNumber, helperText: errors.phoneNumber?.message })) }) })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center", children: [_jsx("label", { htmlFor: "mutuelle", className: "w-full md:w-[200px]", children: "Mutuelle:" }), _jsxs(FormControl, { className: "w-full md:flex-1", children: [_jsx(InputLabel, { id: "demo-select-small-label", children: "Mutuelle" }), _jsx(Controller, { name: "mutuelle", control: control, rules: { required: "Le champ Mutuelle est requis." }, render: ({ field }) => (_jsxs(Select, { ...field, labelId: "demo-select-small-label", id: "demo-select-small", label: "mutuelle", error: !!errors.mutuelle, children: [_jsx(MenuItem, { value: "none", children: _jsx("em", { children: "Aucune" }) }), _jsx(MenuItem, { value: "Mamdat", children: "Mamdat" }), _jsx(MenuItem, { value: "CNIA SAADA", children: "CNIA SAADA" }), _jsx(MenuItem, { value: "CNOPS", children: "CNOPS" }), _jsx(MenuItem, { value: "GENERAL", children: "GENERAL" }), _jsx(MenuItem, { value: "CNSS", children: "CNSS" }), _jsx(MenuItem, { value: "MFAR", children: "MFAR" }), _jsx(MenuItem, { value: "WATANIA", children: "WATANIA" }), _jsx(MenuItem, { value: "ZURICH", children: "ZURICH" }), _jsx(MenuItem, { value: "ATLANTA", children: "ATLANTA" }), _jsx(MenuItem, { value: "AXA", children: "AXA" }), _jsx(MenuItem, { value: "WAFA ASURANCE", children: "WAFA ASURANCE" })] })) })] })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center", children: [_jsx("label", { htmlFor: "note", className: "w-full md:w-[200px]", children: "allergies:" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "allergy", control: control, render: ({ field }) => (_jsx(Autocomplete, { className: "bg-white", multiple: true, id: "tags-filled", options: Allergies.map((option) => option.title), defaultValue: [], value: field.value || [], onChange: (event, newValue) => field.onChange(newValue), freeSolo: true, renderTags: (value, getTagProps) => value.map((option, index) => {
                                                const { key, ...tagProps } = getTagProps({ index });
                                                return (_jsx(Chip, { variant: "outlined", label: option, ...tagProps }, key));
                                            }), renderInput: (params) => (_jsx(TextField, { ...params, variant: "outlined", placeholder: "allergies", sx: autocompleteStyles })) })) }) }), " "] }), _jsx(Box, { children: _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center", children: [_jsx("label", { htmlFor: "note", className: "w-full md:w-[200px]", children: "Maladies:" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "disease", control: control, render: ({ field }) => (_jsx(Autocomplete, { className: "bg-white", multiple: true, id: "tags-filled", options: Maladies.map((option) => option.title), defaultValue: [], value: field.value || [], onChange: (event, newValue) => field.onChange(newValue), freeSolo: true, renderTags: (value, getTagProps) => value.map((option, index) => {
                                                    const { key, ...tagProps } = getTagProps({ index });
                                                    return (_jsx(Chip, { variant: "outlined", label: option, ...tagProps }, key));
                                                }), renderInput: (params) => (_jsx(TextField, { ...params, variant: "outlined", placeholder: "maladies", sx: autocompleteStyles })) })) }) })] }) }), _jsx(Box, { children: _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center", children: [_jsx("label", { htmlFor: "note", className: "w-full md:w-[200px]", children: "Source de provenance:" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "referral", control: control, render: ({ field }) => (_jsx(Autocomplete, { className: "bg-white", multiple: true, id: "tags-filled", options: referral.map((option) => option.title), defaultValue: [], value: field.value || [], onChange: (event, newValue) => field.onChange(newValue), freeSolo: true, renderTags: (value, getTagProps) => value.map((option, index) => {
                                                    const { key, ...tagProps } = getTagProps({ index });
                                                    return (_jsx(Chip, { variant: "outlined", label: option, ...tagProps }, key));
                                                }), renderInput: (params) => (_jsx(TextField, { ...params, variant: "outlined", placeholder: "Provenance", sx: autocompleteStyles })) })) }) })] }) }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center", children: [_jsx("label", { htmlFor: "note", className: "w-full md:w-[200px]", children: "Note:" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "note", control: control, render: ({ field }) => (_jsx(TextField, { ...field, id: "outlined-required", multiline: true, rows: 3, label: "Note", error: !!errors.note, helperText: errors.note?.message })) }) })] })] }), _jsx(Box, { className: "flex", children: _jsx(Button, { type: "submit", variant: "contained", className: "w-full md:w-max !px-10 !py-3 rounded-lg !ms-auto", children: "Enregistrer" }) })] }) }));
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
export default AddPatient;
