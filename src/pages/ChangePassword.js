import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import { Box, TextField, Button, FormControl, IconButton, InputAdornment, InputLabel, OutlinedInput, } from "@mui/material";
import lettersvg from "/letter.jpg";
import React, { useRef } from "react";
import { useParams } from "react-router";
import addGlobal from "../hooks/addGlobal";
import { ChangePasswordServiceClient, } from "../services/AuthService";
import { useSnackbarStore } from "../zustand/useSnackbarStore";
import { AxiosError } from "axios";
const ChangePassword = () => {
    const addmutation = addGlobal({}, ChangePasswordServiceClient);
    const { showSnackbar } = useSnackbarStore();
    const [showPassword, setShowPassword] = React.useState(false);
    const emailRef = useRef(null);
    const passwordRef = useRef(null);
    const passwordConfirmRef = useRef(null);
    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };
    const { token } = useParams();
    if (!token)
        return;
    const HandleSubmit = async (e) => {
        e.preventDefault();
        const emailValue = emailRef?.current?.value;
        const passwordValue = passwordRef?.current?.value;
        const passwordConfirmValue = passwordConfirmRef?.current?.value;
        if (passwordValue !== passwordConfirmValue) {
            alert("Les mots de passe ne correspondent pas. Veuillez réessayer.");
            return;
        }
        if (!emailValue) {
            alert("Veuillez entrer un email");
            return;
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(emailValue)) {
            alert("Format d'email invalide");
            return;
        }
        try {
            if (emailValue && passwordValue) {
                await addmutation.mutateAsync({ email: emailValue, password: passwordValue, token: token }, {
                    onSuccess: () => {
                        showSnackbar("Mot de passe modifié avec succès.", "success");
                    },
                    onError: () => {
                        showSnackbar("Oups, quelque chose s'est mal passé", "error");
                    },
                });
            }
        }
        catch (error) {
            const message = error instanceof AxiosError
                ? error.response?.data?.message
                : error.message;
            showSnackbar(message, "error");
        }
    };
    return (_jsxs(Box, { className: "w-full  bg-white flex flex-col md:flex p-4 gap-2 justify-center items-center\t", children: [_jsx("h1", { className: "text-base font-bold", children: "Nouveau mot de passe" }), _jsx("h3", { className: "text-base font-light", children: "Veuillez cr\u00E9er un nouveau mot de passe que vous n'utilisez sur aucun autre site" }), _jsx(Box, { className: "w-full flex justify-center items-center", children: _jsx("img", { src: lettersvg, className: "h-auto  max-w-sm" }) }), _jsx(Box, { className: "flex flex-col  w-full min-w-80 gap-4", component: "form", onSubmit: HandleSubmit, children: _jsxs(Box, { className: "flex flex-col gap-4 p-2 justify-center items-center", children: [_jsx(TextField, { inputRef: emailRef, fullWidth: true, id: "outlined-basic", label: "Email", variant: "outlined", style: { maxWidth: "260px" } }), _jsxs(FormControl, { variant: "outlined", children: [_jsx(InputLabel, { htmlFor: "outlined-adornment-password", children: "Mot de passe" }), _jsx(OutlinedInput, { inputRef: passwordRef, id: "outlined-adornment-password", type: showPassword ? "text" : "password", endAdornment: _jsx(InputAdornment, { position: "end", children: _jsx(IconButton, { "aria-label": "toggle password visibility", onClick: handleClickShowPassword, onMouseDown: handleMouseDownPassword, edge: "end", children: showPassword ? _jsx(VisibilityOff, {}) : _jsx(Visibility, {}) }) }), label: "Password" })] }), _jsxs(FormControl, { variant: "outlined", children: [_jsx(InputLabel, { htmlFor: "ConfirmPassword", children: "Confirmez le mot de passe" }), _jsx(OutlinedInput, { inputRef: passwordConfirmRef, id: "ConfirmPassword", type: showPassword ? "text" : "password", endAdornment: _jsx(InputAdornment, { position: "end", children: _jsx(IconButton, { "aria-label": "toggle password visibility", onClick: handleClickShowPassword, onMouseDown: handleMouseDownPassword, edge: "end", children: showPassword ? _jsx(VisibilityOff, {}) : _jsx(Visibility, {}) }) }), label: "ConfirmPassword" })] }), _jsx(Button, { type: "submit", className: "w-80", variant: "contained", children: "Continuer" })] }) })] }));
};
export default ChangePassword;
