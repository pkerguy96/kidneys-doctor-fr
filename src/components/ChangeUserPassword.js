import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { Paper, Box, Button, FormControl, Typography, IconButton, InputAdornment, InputLabel, OutlinedInput, } from "@mui/material";
import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import addGlobal from "../hooks/addGlobal";
import { ChangePasswordApiClient } from "../services/AuthService";
import { useSnackbarStore } from "../zustand/useSnackbarStore";
import { AxiosError } from "axios";
const ChangeUserPassword = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const { showSnackbar } = useSnackbarStore();
    const { control, handleSubmit, watch, formState: { errors }, } = useForm();
    const addmutation = addGlobal({}, ChangePasswordApiClient);
    const currentPassword = watch("password");
    const newPassword = watch("newPassword");
    const onSubmit = async (data) => {
        if (currentPassword !== newPassword) {
            showSnackbar("Les mots de passe ne correspondent pas.", "error");
            return;
        }
        await addmutation.mutateAsync({
            new_password: data.newPassword,
            new_password_confirmation: data.newPassword,
        }, {
            onSuccess: (data) => {
                showSnackbar(data.message, "success");
            },
            onError: (error) => {
                const message = error instanceof AxiosError
                    ? error.response?.data?.message
                    : error.message;
                showSnackbar(message, "error");
            },
        });
    };
    return (_jsx(Paper, { className: "p-4", children: _jsxs(Box, { component: "form", noValidate: true, autoComplete: "off", className: "w-full flex flex-col gap-6", onSubmit: handleSubmit(onSubmit), children: [_jsxs(Box, { className: "flex flex-col gap-4", children: [_jsx(Typography, { id: "modal-modal-title", component: "h2", className: "text-center !text-2xl font-bold", children: "Changer le mot de passe" }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center", children: [_jsx("label", { htmlFor: "password", className: "w-full md:w-[200px]", children: "Nouveau mot de passe" }), _jsxs(FormControl, { className: "w-full md:flex-1", variant: "outlined", children: [_jsx(InputLabel, { htmlFor: "password", children: "Mot de passe" }), _jsx(Controller, { name: "password", control: control, defaultValue: "", rules: { required: "Le mot de passe est requis" }, render: ({ field }) => (_jsx(OutlinedInput, { ...field, id: "password", type: showPassword ? "text" : "password", endAdornment: _jsx(InputAdornment, { position: "end", children: _jsx(IconButton, { "aria-label": showPassword
                                                            ? "Masquer le mot de passe"
                                                            : "Afficher le mot de passe", onClick: () => setShowPassword((prev) => !prev), edge: "end", children: showPassword ? _jsx(VisibilityOff, {}) : _jsx(Visibility, {}) }) }), label: "Mot de passe", error: !!errors.password })) })] }), errors.password && (_jsx(Typography, { color: "error", children: errors.password.message &&
                                        typeof errors.password.message === "string"
                                        ? errors.password.message
                                        : "" }))] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center", children: [_jsx("label", { htmlFor: "newPassword", className: "w-full md:w-[200px]", children: "Confirmer mot de passe" }), _jsxs(FormControl, { className: "w-full md:flex-1", variant: "outlined", children: [_jsx(InputLabel, { htmlFor: "newPassword", children: "Confirmer mot de passe" }), _jsx(Controller, { name: "newPassword", control: control, defaultValue: "", rules: {
                                                required: "Le nouveau mot de passe est requis",
                                                validate: (value) => value === currentPassword ||
                                                    "Les mots de passe doivent correspondre",
                                            }, render: ({ field }) => (_jsx(OutlinedInput, { ...field, id: "newPassword", type: showNewPassword ? "text" : "password", endAdornment: _jsx(InputAdornment, { position: "end", children: _jsx(IconButton, { "aria-label": showNewPassword
                                                            ? "Masquer le nouveau mot de passe"
                                                            : "Afficher le nouveau mot de passe", onClick: () => setShowNewPassword((prev) => !prev), edge: "end", children: showNewPassword ? _jsx(VisibilityOff, {}) : _jsx(Visibility, {}) }) }), label: "Nouveau mot de passe", error: !!errors.newPassword })) })] }), errors.newPassword && (_jsx(Typography, { color: "error", children: errors.newPassword.message &&
                                        typeof errors.newPassword.message === "string"
                                        ? errors.newPassword.message
                                        : "" }))] })] }), _jsx(Box, { className: "flex", children: _jsx(Button, { type: "submit", variant: "contained", className: "w-full md:w-max !px-10 !py-3 rounded-lg !ms-auto", children: "Enregistrer" }) })] }) }));
};
export default ChangeUserPassword;
