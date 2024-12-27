import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { AccountCircle } from "@mui/icons-material";
import { Avatar, Box, IconButton, Menu, MenuItem } from "@mui/material";
import { Link } from "react-router-dom";
import { useState } from "react";
import ModalComponent from "./ModalComponent";
import AssignmentIndOutlinedIcon from "@mui/icons-material/AssignmentIndOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
const AdminProfile = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const storedUserData = localStorage.getItem("user_login");
    const parsedUserData = storedUserData ? JSON.parse(storedUserData) : null;
    const userProfilePicture = parsedUserData
        ? parsedUserData.profile || null
        : null;
    // Handle menu open
    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };
    // Handle menu close
    const handleClose = () => {
        setAnchorEl(null);
    };
    const HandleLogout = () => {
        setIsModalOpen(true);
        handleClose();
    };
    return (_jsxs(Box, { className: "", children: [_jsx(IconButton, { size: "large", "aria-label": "account of current user", "aria-controls": "menu-appbar", "aria-haspopup": "true", onClick: handleMenu, color: "inherit", children: userProfilePicture ? (_jsx(Avatar, { src: userProfilePicture, sx: { width: 30, height: 30 } })) : (_jsx(AccountCircle, {})) }), _jsx(Menu, { id: "menu-appbar", anchorEl: anchorEl, anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "right",
                }, keepMounted: true, transformOrigin: {
                    vertical: "top",
                    horizontal: "right",
                }, open: Boolean(anchorEl), onClose: handleClose, children: _jsxs(Box, { className: "w-[180px] flex flex-col", children: [_jsx(MenuItem, { component: Link, to: "/profile", onClick: handleClose, className: "text-inherit flex-1 flex items-center hover:text-blue-500", children: _jsxs(Box, { className: "flex flex-wrap gap-2 items-center", children: [_jsx(AssignmentIndOutlinedIcon, { className: "text-lg text-inherit", fontSize: "medium", fill: "currentColor" }), _jsx("span", { className: "w-0 flex-1", children: "Profil" })] }) }), _jsx(MenuItem, { component: Link, to: "/profile/password", onClick: handleClose, className: "text-inherit flex-1 flex items-center hover:text-blue-500", children: _jsxs(Box, { className: "flex flex-wrap gap-2 items-center", children: [_jsx(LockOutlinedIcon, { className: "text-lg text-inherit", fontSize: "medium", fill: "currentColor" }), _jsx("span", { className: "w-0 flex-1", children: "Mot de passe" })] }) }), _jsx(MenuItem, { onClick: HandleLogout, className: "text-inherit flex-1 flex items-center hover:text-blue-500", children: _jsxs(Box, { className: "flex flex-wrap gap-2 items-center", children: [_jsx(LogoutOutlinedIcon, { className: "text-lg text-inherit", fontSize: "medium", fill: "currentColor" }), "D\u00E9connecter"] }) })] }) }), isModalOpen && (_jsx(ModalComponent, { open: isModalOpen, onClose: () => setIsModalOpen(false) }))] }));
};
export default AdminProfile;
