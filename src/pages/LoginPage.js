import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { useState } from "react";
import { AxiosError } from "axios";
import Alert from "@mui/material/Alert";
import { useNavigate } from "react-router";
import { FormHelperText } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import addGlobal from "../hooks/addGlobal";
import { AuthServiceClient } from "../services/AuthService";
import useUserRoles from "../zustand/UseRoles";
function Copyright(props) {
    return (_jsxs(Typography, { variant: "body2", color: "text.secondary", align: "center", ...props, children: ["Copyright © ", _jsx(Link, { color: "inherit", href: "https://github.com/pkerguy96", children: "ELKOR" }), " ", new Date().getFullYear(), "."] }));
}
export default function SignIn() {
    const [errors, setErrors] = useState({
        email: false,
        password: false,
    });
    const [error, setError] = useState({ isError: false, message: "" });
    const [userdata, setUserData] = useState({
        email: "",
        password: "",
    });
    const { setRoles } = useUserRoles();
    const addmutation = addGlobal({}, AuthServiceClient);
    const navigate = useNavigate();
    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevUserData) => ({
            ...prevUserData,
            [name]: value,
        }));
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        const newErrors = {
            email: !userdata.email.trim(),
            password: !userdata.password.trim(),
        };
        setErrors(newErrors);
        await addmutation.mutateAsync(userdata, {
            onSuccess: (data) => {
                setRoles(data.data.roles);
                localStorage.setItem("user_login", JSON.stringify(data.data));
                navigate("/dashboard");
            },
            onError: (error) => {
                const message = error instanceof AxiosError
                    ? error.response?.data?.message
                    : error.message;
                setError({ isError: true, message });
            },
        });
    };
    return (_jsxs(Container, { component: "main", maxWidth: "xs", children: [_jsx(CssBaseline, {}), _jsxs(Box, { className: " flex flex-col justify-center items-center", children: [_jsx("img", { src: "/logo-cropped.jpg", width: 300, height: 300 }), _jsxs(Box, { component: "form", onSubmit: handleSubmit, noValidate: true, sx: { mt: 1 }, children: [_jsx(TextField, { error: errors.email, margin: "normal", required: true, fullWidth: true, id: "email", label: "Address Email", name: "email", autoComplete: "email", autoFocus: true, onChange: handleChange, value: userdata.email }), errors.email && (_jsx(FormHelperText, { id: "email-error-text", style: { color: "red" }, children: "Le champ adresse email est obligatoire." })), _jsx(TextField, { error: errors.password, margin: "normal", required: true, fullWidth: true, name: "password", label: "Mot de passe", type: "password", id: "password", autoComplete: "current-password", onChange: handleChange, value: userdata.password }), errors.password && (_jsx(FormHelperText, { id: "password-text", style: { color: "red" }, children: "Le champ mot de pass est obligatoire." })), _jsx(Button, { type: "submit", fullWidth: true, variant: "contained", children: "Sign In" }), error.isError && (_jsx(Alert, { variant: "filled", severity: "error", children: error.message })), _jsx(Grid, { container: true, children: _jsx(Grid, { item: true, xs: true, children: _jsx(RouterLink, { to: "r\u00E9initialisation-mot-de-passe", children: "Mot de passe oubli\u00E9 ?" }) }) })] })] })] }));
}
