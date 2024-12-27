import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import axiosInstance from "../services/Http";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import useUserRoles from "../zustand/UseRoles";
const style = {
    position: "absolute",
    top: "30%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    border: "1px solid #000",
    boxShadow: 24,
    p: 4,
};
const ModalComponent = ({ open, onClose }) => {
    const { setRoles, clearRoles } = useUserRoles();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const logOut = async () => {
        try {
            const response = await axiosInstance.get("/Admin/logout");
            if (response.status === 200) {
                localStorage.clear();
                queryClient.clear();
                clearRoles();
                navigate("/");
            }
        }
        catch (error) {
            console.log(error);
        }
    };
    return (_jsx("div", { children: _jsx(Modal, { open: open, onClose: onClose, children: _jsxs(Box, { sx: style, className: "w-[300px] md:w-[400px]", children: [_jsx(Typography, { id: "modal-modal-title", variant: "h6", component: "h2", children: "Etes-vous s\u00FBr de vouloir vous d\u00E9connecter ?" }), _jsxs(Box, { className: "flex flex-row mt-5 content-center", children: [_jsx(Button, { variant: "outlined", sx: { marginRight: "30px" }, children: "Annuler" }), _jsx(Button, { onClick: logOut, variant: "contained", children: "Confirmer" })] })] }) }) }));
};
export default ModalComponent;
