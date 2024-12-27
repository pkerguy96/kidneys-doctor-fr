import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Close } from "@mui/icons-material";
import { Dialog, DialogTitle, Box, IconButton, DialogContent, Typography, DialogActions, Button, } from "@mui/material";
import useConfirmDialogStore from "../zustand/useConfirmDialogStore";
export const confirmDialog = (message, onSubmit) => {
    useConfirmDialogStore.setState({
        message,
        onSubmit,
    });
};
const ConfirmDialog = () => {
    const { message, onSubmit, close } = useConfirmDialogStore();
    return (_jsxs(Dialog, { open: Boolean(onSubmit), onClose: close, maxWidth: "sm", fullWidth: true, children: [_jsx(DialogTitle, { children: "Confirmez l'action" }), _jsx(Box, { position: "absolute", top: 0, right: 0, children: _jsx(IconButton, { onClick: close, children: _jsx(Close, {}) }) }), _jsx(DialogContent, { children: _jsx(Typography, { children: message }) }), _jsxs(DialogActions, { children: [_jsx(Button, { color: "primary", variant: "contained", onClick: close, children: "Annuler" }), _jsx(Button, { color: "error", variant: "contained", onClick: () => {
                            if (onSubmit) {
                                onSubmit();
                            }
                            close();
                        }, children: "Confirmer" })] })] }));
};
export default ConfirmDialog;
