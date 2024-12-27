import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Paper, Box, FormControl, TextField, InputLabel, Select, MenuItem, Button, FormControlLabel, Checkbox, Typography, } from "@mui/material";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useAddNurseMutation } from "../hooks/addNurse";
import { calculateAge } from "../utils/dateUtils";
import { useSnackbarStore } from "../zustand/useSnackbarStore";
import { AxiosError } from "axios";
const AddNurseForm = () => {
    const { showSnackbar } = useSnackbarStore();
    const [age, setAge] = useState(0);
    const navigate = useNavigate();
    const customErrorMessages = {
        nom: {
            required: "Le champ Nom est requis.", // Customize the required error message for "nom" field
        },
        prenom: {
            required: "Le champ Prenom est requis.", // Customize the required error message for "nom" field
        },
        cin: {
            required: "Le champ Cin est requis.", // Customize the required error message for "nom" field
        },
        date: {
            required: "Le champ Date est requis.", // Customize the required error message for "nom" field
        },
        recruitment_date: {
            required: "Le champ Date est requis.", // Customize the required error message for "nom" field
        },
        termination_date: {
            required: "Le champ Date est requis.", // Customize the required error message for "nom" field
        },
        sex: {
            required: "Le champ Sex est requis.", // Customize the required error message for "nom" field
        },
        address: {
            required: "Le champ Address est requis.", // Customize the required error message for "nom" field
        },
        phone_number: {
            required: "Le champ Telephone est requis.", // Customize the required error message for "nom" field
        },
        email: {
            required: "Le champ Email est requis.", // Customize the required error message for "nom" field
        },
        password: {
            required: "Le champ Mot de pass est requis.", // Customize the required error message for "nom" field
        },
    };
    const { handleSubmit, control, register, watch, reset, formState: { errors }, } = useForm({
        defaultValues: {
            nom: "",
            prenom: "",
            cin: "",
            date: "",
            sex: "",
            address: "",
            phone_number: "",
            email: "",
            password: "",
            agecalc: "",
            checkbox: false,
            recruitment_date: "",
            termination_date: "",
        },
    });
    const addPatientMutation = useAddNurseMutation(() => {
        reset({
            nom: "",
            prenom: "",
            cin: "",
            date: "",
            sex: "",
            address: "",
            phone_number: "",
            email: "",
            password: "",
            agecalc: "",
        });
    });
    const onSubmit = async (data) => {
        if (!data.checkbox && data.termination_date < data.recruitment_date) {
            showSnackbar("Date de résiliation est avant la date d'embauche", "error");
        }
        const { agecalc, ...newData } = data;
        try {
            await addPatientMutation.mutateAsync(newData, {
                onSuccess: () => {
                    showSnackbar("Infirmière ajoutée avec succès.", "success");
                    navigate("/Nurses");
                },
                onError: (Error) => {
                    console.log(Error);
                    showSnackbar("Something went wrong.", "error");
                },
            });
        }
        catch (error) {
            const message = error instanceof AxiosError
                ? error.response?.data?.message
                : error.message;
            showSnackbar(message, "error");
        }
    };
    // Watch the 'date' field and calculate age whenever it changes
    register("date", {
        onChange: (e) => {
            const age = calculateAge(e.target.value);
            setAge(age); // Set the 'age' field in the form with the calculated age
        },
    });
    //TODO: WIERD BUG HERE GET AN ALERT FOR
    return (_jsx(Paper, { className: "p-4", children: _jsxs(Box, { component: "form", noValidate: true, autoComplete: "off", onSubmit: handleSubmit(onSubmit), className: "w-full flex flex-col gap-6", children: [_jsx(Box, { className: "flex justify-center", children: _jsx(Typography, { id: "modal-modal-title", component: "h2", className: "text-center !text-2xl font-bold", children: "Ajouter une infirmi\u00E8re" }) }), _jsxs(Box, { className: "w-full flex flex-col gap-4", children: [_jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2", children: [_jsx("label", { htmlFor: "nom", className: "w-full md:w-[200px]", children: "Nom:" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "nom", control: control, rules: { required: customErrorMessages.nom.required }, render: ({ field }) => (_jsx(TextField, { ...field, id: "nom", label: "Nom", error: !!errors.nom, helperText: errors.nom?.message })) }) })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center", children: [_jsx("label", { htmlFor: "nom", className: "w-full md:w-[200px]", children: "Prenom:" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "prenom", control: control, rules: { required: customErrorMessages.prenom.required }, render: ({ field }) => (_jsx(TextField, { ...field, id: "prenom", label: "Prenom", error: !!errors.prenom, helperText: errors.prenom?.message })) }) })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center", children: [_jsxs(Box, { className: "w-full md:flex-1 flex flex-col gap-2 md:flex-row md:flex-wrap items-center", children: [_jsx("label", { htmlFor: "nom", className: "w-full md:w-[200px]", children: "Date de naissance:" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "date", control: control, rules: {
                                                    required: customErrorMessages.date.required,
                                                    validate: (value) => {
                                                        const selectedDate = new Date(value);
                                                        const currentDate = new Date();
                                                        return (selectedDate <= currentDate ||
                                                            "La date ne peut pas être dans le futur.");
                                                    },
                                                }, render: ({ field }) => (_jsx(TextField, { type: "date", ...field, id: "date", error: !!errors.date, helperText: errors.date?.message })) }) })] }), _jsxs(Box, { className: "w-full md:w-[300px] flex flex-col gap-2 md:flex-row md:flex-wrap items-center", children: [_jsx("label", { htmlFor: "nom", className: "w-full md:w-[100px]", children: "age calcule:" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "agecalc", control: control, render: ({ field }) => (_jsx(TextField, { ...field, id: "agecalc", disabled: true, value: age })) }) })] })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center", children: [_jsx("label", { htmlFor: "nom", className: "w-full md:w-[200px]", children: "Cin:" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "cin", control: control, render: ({ field }) => (_jsx(TextField, { ...field, id: "cin", label: "Cin", error: !!errors.cin, helperText: errors.cin?.message })) }) })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center", children: [_jsx("label", { htmlFor: "nom", className: "w-full md:w-[200px]", children: "Sex:" }), _jsxs(FormControl, { className: "w-full md:flex-1", children: [_jsx(InputLabel, { id: "demo-select-small-label", children: "Sex" }), _jsx(Controller, { name: "sex", control: control, rules: { required: customErrorMessages.sex.required }, render: ({ field }) => (_jsxs(Select, { ...field, labelId: "demo-select-small-label", id: "demo-select-small", label: "sex", error: !!errors.sex, children: [_jsx(MenuItem, { value: "male", children: "Male" }), _jsx(MenuItem, { value: "female", children: "Female" })] })) })] })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center", children: [_jsx("label", { htmlFor: "nom", className: "w-full md:w-[200px]", children: "Adresse:" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "address", control: control, rules: { required: customErrorMessages.address.required }, render: ({ field }) => (_jsx(TextField, { ...field, id: "address", label: "Adresse", error: !!errors.address, helperText: errors.address?.message })) }) })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center", children: [_jsx("label", { htmlFor: "phone_number", className: "w-full md:w-[200px]", children: "Telephone:" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "phone_number", control: control, rules: { required: customErrorMessages.phone_number.required }, render: ({ field }) => (_jsx(TextField, { ...field, id: "phone_number", label: "Phone Number", error: !!errors.phone_number, helperText: errors.phone_number?.message })) }) })] }), _jsxs(Box, { className: "w-full md:flex-1 flex flex-col gap-2 md:flex-row md:flex-wrap items-center", children: [_jsx("label", { htmlFor: "recruitment_date", className: "w-full md:w-[200px]", children: "Date d'embauche:" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "recruitment_date", control: control, rules: {
                                            required: customErrorMessages.recruitment_date.required,
                                        }, render: ({ field }) => (_jsx(TextField, { type: "date", ...field, id: "recruitment_date", error: !!errors.recruitment_date, helperText: errors.recruitment_date?.message })) }) })] }), _jsxs(Box, { className: "w-full flex flex-col gap-4 md:flex-row md:flex-wrap items-center", children: [_jsxs(Box, { className: "w-full md:flex-1 flex flex-col gap-2 md:flex-row md:flex-wrap items-center", children: [_jsx("label", { htmlFor: "termination_date", className: "w-full md:w-[200px]", children: "Date de r\u00E9siliation:" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "termination_date", control: control, render: ({ field }) => (_jsx(TextField, { type: "date", ...field, id: "termination_date", disabled: watch("checkbox"), error: !!errors.termination_date, helperText: errors.termination_date?.message })) }) })] }), _jsx(Box, { className: "w-full md:w-max", children: _jsx(FormControlLabel, { control: _jsx(Controller, { name: "checkbox", control: control, render: ({ field }) => _jsx(Checkbox, { ...field }) }), label: "Non sp\u00E9cifi\u00E9" }) })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center", children: [_jsx("label", { htmlFor: "Email", className: "w-full md:w-[200px]", children: "Email:" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "email", control: control, rules: { required: customErrorMessages.email.required }, render: ({ field }) => (_jsx(TextField, { ...field, id: "email", label: "Email", error: !!errors.email, helperText: errors.email?.message })) }) })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center", children: [_jsx("label", { htmlFor: "password", className: "w-full md:w-[200px]", children: "Mot de pass:" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "password", control: control, rules: { required: customErrorMessages.password.required }, render: ({ field }) => (_jsx(TextField, { ...field, type: "password", id: "password", label: " Mot de pass", error: !!errors.password, helperText: errors.password?.message })) }) })] })] }), _jsx(Box, { className: "flex", children: _jsx(Button, { type: "submit", variant: "contained", className: "w-full md:w-max !px-10 !py-3 rounded-lg !ms-auto", children: "Enregistrer" }) })] }) }));
};
export default AddNurseForm;
