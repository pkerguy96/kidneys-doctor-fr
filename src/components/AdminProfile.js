import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Avatar, Box, Button, FormControl, Input, Paper, TextField, } from "@mui/material";
import { useCallback, useMemo, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import addGlobal from "../hooks/addGlobal";
import { AuthProfileServiceClient } from "../services/AuthService";
import { useSnackbarStore } from "../zustand/useSnackbarStore";
import { AxiosError } from "axios";
const AdminProfile = () => {
    const { showSnackbar } = useSnackbarStore();
    const [imageFile, setImageFile] = useState(null);
    const addmutation = addGlobal({}, AuthProfileServiceClient, {
        headers: {
            "Content-Type": "multipart/form-data",
        },
    });
    const storedUserData = useMemo(() => {
        const data = localStorage.getItem("user_login");
        return data ? JSON.parse(data) : null;
    }, []);
    const userProfilePicture = storedUserData?.profile || null;
    const userData = storedUserData?.user || {};
    const { handleSubmit, control, formState: { errors }, } = useForm({
        defaultValues: {
            name: userData?.nom || "",
            email: userData?.email || "",
        },
    });
    const customErrorMessages = {
        name: {
            required: "Le champ Nom est requis.",
        },
        email: {
            required: "Le champ Email est requis.",
        },
    };
    const onSubmit = useCallback(async (data) => {
        try {
            var form = new FormData();
            form.append("name", data.name);
            form.append("email", data.email);
            if (data.picture) {
                form.append("picture", data.picture);
            }
            await addmutation.mutateAsync(form, {
                onSuccess(data) {
                    const user = JSON.parse(localStorage.getItem("user_login") || "{}");
                    user.user = data.data;
                    user.profile = data.profile;
                    localStorage.setItem("user_login", JSON.stringify(user));
                    showSnackbar("Utilisateur modifié avec succès", "success");
                },
                onError: (error) => {
                    const message = error instanceof AxiosError
                        ? error.response?.data?.message
                        : error.message;
                    showSnackbar(`Oops.. ${message}`, "error");
                },
            });
        }
        catch (error) {
            showSnackbar(`Oops.. ${error}`, "error");
        }
    }, [addmutation]);
    return (_jsx(Paper, { className: "p-4", children: _jsxs(Box, { component: "form", noValidate: true, autoComplete: "off", className: "w-full flex flex-col gap-6", onSubmit: handleSubmit(onSubmit), children: [_jsxs(Box, { className: "w-full flex flex-col gap-4 items-center justify-center\t", children: [_jsx(Avatar, { alt: "Remy Sharp", src: imageFile ? URL.createObjectURL(imageFile) : userProfilePicture, sx: { width: 120, height: 120 } }), _jsxs(Button, { variant: "contained", component: "label", className: "!px-4 !py-3", children: ["Importer l'image", _jsx(Controller, { control: control, name: "picture", render: ({ field: { value, onChange, ...field } }) => {
                                        return (_jsx(Input, { ...field, onChange: (event) => {
                                                onChange(event.target.files?.[0]);
                                                setImageFile(event.target.files[0]);
                                            }, type: "file", inputProps: {
                                                accept: "image/*",
                                            }, id: "picture", style: { display: "none" } }));
                                    } })] })] }), _jsxs(Box, { className: "flex flex-col gap-4", children: [_jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center", children: [_jsx("label", { htmlFor: "name", className: "w-full md:w-[200px]", children: "Nom:" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "name", control: control, rules: { required: customErrorMessages.name.required }, render: ({ field }) => (_jsx(TextField, { ...field, id: "name", label: "name", error: !!errors.name, helperText: errors.name?.message })) }) })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center", children: [_jsx("label", { htmlFor: "name", className: "w-full md:w-[200px]", children: "Email:" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "email", control: control, rules: { required: customErrorMessages.email.required }, render: ({ field }) => (_jsx(TextField, { ...field, id: "email", label: "email", error: !!errors.email, helperText: errors.email?.message })) }) })] })] }), _jsx(Box, { className: "flex", children: _jsx(Button, { type: "submit", variant: "contained", className: "w-full md:w-max !px-10 !py-3 rounded-lg !ms-auto", children: "Enregistrer" }) })] }) }));
};
export default AdminProfile;
