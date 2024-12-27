import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Box, FormControl, InputLabel, Paper, Select, TextField, MenuItem, Autocomplete, Button, Typography, } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import getGlobal from "../hooks/getGlobal";
import { CACHE_KEY_PATIENTS } from "../constants";
import patientAPIClient from "../services/PatientService";
import LoadingSpinner from "../components/LoadingSpinner";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import addGlobal from "../hooks/addGlobal";
import { UploadServiceApiClient } from "../services/UploadsService";
import { AxiosError } from "axios";
import { useSnackbarStore } from "../zustand/useSnackbarStore";
import { useState } from "react";
import { useNavigate } from "react-router";
const AddFile = () => {
    const [selectedFilesCount, setSelectedFilesCount] = useState(0);
    const [uploadProgress, setUploadProgress] = useState(0);
    const { data, isLoading } = getGlobal({}, [CACHE_KEY_PATIENTS[0]], patientAPIClient, undefined);
    const mutation = addGlobal({}, UploadServiceApiClient, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            setUploadProgress(percentCompleted);
        },
    });
    const { handleSubmit, control, setValue, formState: { errors }, } = useForm({});
    const navigate = useNavigate();
    const { showSnackbar } = useSnackbarStore();
    if (isLoading)
        return _jsx(LoadingSpinner, {});
    const onFileChange = (e) => {
        const files = e.target.files;
        if (files) {
            setSelectedFilesCount(files.length);
        }
    };
    const onSubmit = async (data) => {
        let form = new FormData();
        form.append("patient_id", data.patient.id);
        form.append("type", data.type);
        data.files.map((file) => form.append("files[]", file));
        try {
            await mutation.mutateAsync(form, {
                onSuccess: () => {
                    showSnackbar("Fichier téléchargé avec succès", "success");
                    setUploadProgress(0);
                    navigate("/Files");
                },
                onError: (error) => {
                    const message = error instanceof AxiosError
                        ? error.response?.data?.message
                        : error.message;
                    showSnackbar(message, "error");
                },
            });
        }
        catch (error) {
            console.log(error);
        }
    };
    return (_jsx(Paper, { className: "p-4", children: _jsxs(Box, { component: "form", noValidate: true, autoComplete: "off", onSubmit: handleSubmit(onSubmit), className: "w-full flex flex-col gap-6", children: [_jsx(Box, { className: "flex justify-center", children: _jsx(Typography, { id: "modal-modal-title", component: "h2", className: "text-center !text-2xl font-bold", children: "Ajouter une imagerie" }) }), _jsxs(Box, { className: "w-full flex flex-col gap-4", children: [_jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2", children: [_jsx("label", { htmlFor: "patient", className: "w-full md:w-[160px]", children: "Prenom:" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { rules: { required: "Veuillez sélectionner un patient" }, control: control, name: "patient", render: ({ field, fieldState }) => (_jsx(Autocomplete, { ...field, id: "patient-box-demo", options: data, value: field.value || null, isOptionEqualToValue: (option, value) => option.id === value.id, getOptionLabel: (option) => `${option.nom} ${option.prenom}`, renderInput: (params) => (_jsx(TextField, { ...params, label: "Patient", error: Boolean(fieldState?.error?.message), helperText: fieldState?.error?.message || "" })), onChange: (_e, data) => {
                                                setValue("patient", data);
                                            } })) }) })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center", children: [_jsx("label", { htmlFor: "type", className: "w-full md:w-[160px]", children: "Type:" }), _jsxs(FormControl, { className: "w-full md:flex-1", children: [_jsx(InputLabel, { id: "type-select-small-label", children: "Mutuelle" }), _jsx(Controller, { name: "type", control: control, defaultValue: "None" // Set the default value to match one of the available options
                                            , rules: { required: "Le champ Mutuelle est requis." }, render: ({ field }) => (_jsxs(Select, { ...field, labelId: "type-select-small-label", id: "type-select-small", label: "type", error: !!errors.type, children: [_jsx(MenuItem, { value: "None", children: _jsx("em", { children: "Aucune" }) }), _jsx(MenuItem, { value: "ant\u00E9c\u00E9dents", children: "Ant\u00E9c\u00E9dents m\u00E9dicaux" }), _jsx(MenuItem, { value: "consultation", children: "Notes de consultation" }), _jsx(MenuItem, { value: "laboratoire", children: "Rapports de laboratoire" }), _jsx(MenuItem, { value: "op\u00E9rationnels", children: "Rapports op\u00E9rationnels" }), _jsx(MenuItem, { value: "pathologie", children: "Rapports de pathologie" }), _jsx(MenuItem, { value: "radiologie", children: "Rapports de radiologie" }), _jsx(MenuItem, { value: "Ordonnance", children: "Ordonnance" })] })) })] })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center", children: [_jsx("label", { htmlFor: "document", className: "w-full md:w-[160px]", children: "Documents:" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "files", control: control, defaultValue: [], render: ({ field }) => (_jsx(_Fragment, { children: _jsxs(Button, { className: "!px-4 !py-3", component: "label", variant: "contained", startIcon: _jsx(CloudUploadIcon, {}), children: ["Upload files (", selectedFilesCount, ")", _jsx("input", { type: "file", onChange: (e) => {
                                                            onFileChange(e);
                                                            //@ts-ignore
                                                            field.onChange([...e.target.files]);
                                                        }, multiple: true, style: { display: "none" } })] }) })) }) })] })] }), _jsx(Box, { className: "flex mt-4", children: _jsx(Button, { disabled: uploadProgress > 0 && uploadProgress < 100, type: "submit", variant: "contained", className: "w-full md:w-max !px-10 !py-3 rounded-lg !ms-auto", children: uploadProgress > 0 && uploadProgress < 100 ? (_jsxs("div", { role: "status", className: "flex items-center gap-2", children: [_jsxs("svg", { "aria-hidden": "true", className: "w-5 h-5 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600", viewBox: "0 0 100 101", fill: "none", xmlns: "http://www.w3.org/2000/svg", children: [_jsx("path", { d: "M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z", fill: "currentColor" }), _jsx("path", { d: "M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z", fill: "currentFill" })] }), _jsxs("span", { className: "text-lg", children: [uploadProgress, "%"] })] })) : ("Enregistrer") }) })] }) }));
};
export default AddFile;
