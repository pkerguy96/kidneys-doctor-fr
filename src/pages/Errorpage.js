import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Typography, Button } from "@mui/material";
import { isRouteErrorResponse, useRouteError } from "react-router";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { useNavigate } from "react-router-dom";
const Errorpage = () => {
    const error = useRouteError();
    const navigate = useNavigate();
    return (_jsxs(Box, { sx: {
            minHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            background: "linear-gradient(135deg, #ff6f61, #ff9671)",
            color: "#fff",
            padding: 2,
        }, children: [_jsx(ErrorOutlineIcon, { sx: { fontSize: 100, color: "#fff" } }), _jsx(Typography, { variant: "h2", gutterBottom: true, sx: { fontWeight: "bold" }, children: "Oups ! Quelque chose s'est mal pass\u00E9." }), _jsx(Typography, { variant: "body1", gutterBottom: true, sx: { fontSize: 18, maxWidth: 600 }, children: isRouteErrorResponse(error)
                    ? "La page que vous recherchez n'existe pas ou n'est pas disponible.."
                    : "Une erreur inattendue s'est produite. Nous travaillons à le réparer." }), _jsx(Button, { variant: "contained", color: "primary", size: "large", sx: {
                    mt: 3,
                    backgroundColor: "#fff",
                    color: "#ff6f61",
                    "&:hover": { backgroundColor: "#f1f1f1" },
                }, onClick: () => navigate("/"), children: "Retourner \u00E0 l'index" })] }));
};
export default Errorpage;
