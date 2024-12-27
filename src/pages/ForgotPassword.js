import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, TextField } from "@mui/material";
import lettersvg from "/letter.jpg";
import { useRef } from "react";
import { AxiosError } from "axios";
import addGlobal from "../hooks/addGlobal";
import { ResetPasswordServiceClient } from "../services/AuthService";
import { useSnackbarStore } from "../zustand/useSnackbarStore";
const ForgotPassword = () => {
    const addmutation = addGlobal({}, ResetPasswordServiceClient);
    const { showSnackbar } = useSnackbarStore();
    const emailInputRef = useRef(null);
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const email = emailInputRef?.current.value;
            if (!email) {
                alert("E-mail est requis");
                return;
            }
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                alert("Format d'email invalide");
                return;
            }
            addmutation;
            await addmutation.mutateAsync({ email: email }, {
                onSuccess: () => {
                    showSnackbar("Veuillez vérifier votre courrier électronique pour le courrier de récupération", "success");
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
            const message = error instanceof AxiosError
                ? error.response?.data?.message
                : error.message;
            showSnackbar(message, "error");
        }
    };
    return (_jsxs(Box, { className: "w-full   flex flex-col md:flex p-4 gap-2 justify-center items-center\t", children: [_jsx("h1", { className: "text-base font-medium", children: "Mot de passe oubli\u00E9?" }), _jsx("h3", { className: "text-base font-light", children: "Entrez votre e-mail enregistr\u00E9 ci-dessous pour recevoir les instructions de r\u00E9initialisation du mot de passe" }), _jsx(Box, { className: "w-full flex justify-center items-center", children: _jsx("img", { src: lettersvg, className: "h-auto  max-w-sm" }) }), _jsx(Box, { className: "flex flex-col  w-full min-w-80 gap-4", component: "form", onSubmit: handleSubmit, children: _jsxs(Box, { className: "flex flex-col gap-4 p-2 justify-center items-center", children: [_jsx("h3", { className: "font-semibold", children: "Email" }), _jsx(TextField, { inputRef: emailInputRef, id: "email", name: "email", label: "Votre adresse e-mail", variant: "outlined", className: "w-80" }), _jsx(Button, { type: "submit", className: "w-80", variant: "contained", children: "Continuer" })] }) })] }));
};
export default ForgotPassword;
