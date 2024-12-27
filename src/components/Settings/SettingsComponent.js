import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from "react";
import { Box, FormControl, InputAdornment, InputLabel, OutlinedInput, Paper, } from "@mui/material";
import { Link, Outlet, useLocation } from "react-router-dom";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import ArrowForwardIosOutlinedIcon from "@mui/icons-material/ArrowForwardIosOutlined";
/*  */
import AnalyticsOutlinedIcon from "@mui/icons-material/AnalyticsOutlined";
import MedicationLiquidOutlinedIcon from "@mui/icons-material/MedicationLiquidOutlined";
import AdminPanelSettingsOutlinedIcon from "@mui/icons-material/AdminPanelSettingsOutlined";
import LocalPoliceOutlinedIcon from "@mui/icons-material/LocalPoliceOutlined";
import LocalHospitalOutlinedIcon from "@mui/icons-material/LocalHospitalOutlined";
import HealingOutlinedIcon from "@mui/icons-material/HealingOutlined";
import NoteAltOutlinedIcon from "@mui/icons-material/NoteAltOutlined";
import useUserRoles from "../../zustand/UseRoles";
import BloodtypeOutlinedIcon from "@mui/icons-material/BloodtypeOutlined";
/*  */
const SettingsComponent = () => {
    const location = useLocation();
    const [searchQuery, setSearchQuery] = useState("");
    const [activeItem, setActiveItem] = useState(location.pathname);
    const [isHovered, setIsHovered] = useState(false);
    const { can } = useUserRoles();
    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value.toLowerCase());
    };
    const items = [
        {
            name: "Paramètres des métriques",
            url: "/Settings/Kpis",
            icon: AnalyticsOutlinedIcon,
            checkPermissions: true,
            permissions: ["doctor"],
        },
        {
            name: "Paramètres d'opérations",
            url: "/Settings/Operations",
            icon: MedicationLiquidOutlinedIcon,
            checkPermissions: true,
            permissions: ["doctor", "access_op_settings"],
        },
        {
            name: "Gestion paraclinique",
            url: "/Settings/Xrays",
            icon: LocalHospitalOutlinedIcon,
            checkPermissions: true,
            permissions: ["doctor", "access_xray_settings"],
        },
        {
            name: "Gestion des Examens Demandés",
            url: "/Settings/Examen",
            icon: NoteAltOutlinedIcon,
            checkPermissions: true,
            permissions: ["doctor"],
        },
        {
            name: "Gestion des Analyses",
            url: "/Settings/Blood",
            icon: BloodtypeOutlinedIcon,
            checkPermissions: true,
            permissions: ["doctor"],
        },
        {
            name: "Gestion des rôles",
            url: "/Settings/Roles",
            icon: LocalPoliceOutlinedIcon,
            checkPermissions: true,
            permissions: ["doctor"],
        },
        {
            name: " Gestion des Autorisations",
            url: "/Settings/Autorisations",
            icon: AdminPanelSettingsOutlinedIcon,
            checkPermissions: true,
            permissions: ["doctor"],
        },
        {
            name: " Gestion des cliniques",
            url: "/Settings/Clinic",
            icon: HealingOutlinedIcon,
            checkPermissions: true,
            permissions: ["doctor"],
        },
    ];
    return (_jsx(Paper, { className: "p-4 ", children: _jsxs(Box, { className: "w-full flex flex-col md:grid md:grid-cols-5 gap-4 ", children: [_jsxs(Box, { className: ` transition-all duration-300 ease-in-out col-span-1 md:hover:col-span-2 flex flex-col gap-5 border-1 md:w-20 md:hover:w-full ${isHovered ? "md:col-span-2" : "md:col-span-1"}`, onMouseEnter: () => setIsHovered(true), onMouseLeave: () => setIsHovered(false), children: [_jsx("p", { className: `font-semibold text-2xl text-center ${isHovered ? "md:text-2xl" : "md:text-md"} md:text-start`, children: "Param\u00E8tres" }), _jsx(Box, { className: "flex md:hidden", children: _jsxs(FormControl, { fullWidth: true, children: [_jsx(InputLabel, { htmlFor: "outlined-adornment-Search", children: "Recherche" }), _jsx(OutlinedInput, { id: "outlined-adornment-Search", className: "!rounded-2xl", startAdornment: _jsx(InputAdornment, { position: "start", children: _jsx(SearchOutlinedIcon, {}) }), label: "Recherche", value: searchQuery, onChange: handleSearchChange })] }) }), isHovered ? (_jsxs(FormControl, { fullWidth: true, children: [_jsx(InputLabel, { htmlFor: "outlined-adornment-Search", children: "Recherche" }), _jsx(OutlinedInput, { id: "outlined-adornment-Search", className: "!rounded-2xl", startAdornment: _jsx(InputAdornment, { position: "start", children: _jsx(SearchOutlinedIcon, {}) }), label: "Recherche", value: searchQuery, onChange: handleSearchChange })] })) : (_jsx("span", { className: "hidden md:flex", children: _jsx(SearchOutlinedIcon, {}) })), _jsx(Box, { className: "flex flex-col gap-6", children: items
                                .filter((item) => !item.checkPermissions ||
                                (item.permissions && can(item.permissions))) // Only check permissions if required
                                .filter((item) => item.name.toLowerCase().includes(searchQuery)) // Search filter
                                .map((item, index) => (_jsx(Link, { to: item.url, className: `no-underline`, style: {
                                    display: "block",
                                }, onClick: () => setActiveItem(item.url), children: _jsxs("div", { style: {
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: isHovered ? "space-between" : "",
                                        color: "grey",
                                        gap: ".5rem",
                                    }, children: [_jsx("span", { className: `${activeItem === item.url
                                                ? "!text-blue-600"
                                                : "text-gray-500"} font-light text-md md:hidden`, children: item.name }), _jsxs("div", { className: `${activeItem === item.url
                                                ? "!text-blue-600"
                                                : "text-gray-500"} font-light text-md hidden md:flex items-center gap-4 overflow-hidden`, children: [_jsx("span", { className: "hidden md:block", children: _jsx(item.icon, {}) }), isHovered && (_jsx("span", { className: "h-[1em] block", children: item.name }))] }), _jsx(ArrowForwardIosOutlinedIcon, {})] }) }, index))) })] }), _jsx(Box, { className: ` transition-all duration-300 ease-in-out ${isHovered ? "col-span-3" : "col-span-4"}  `, children: _jsx(Outlet, {}) })] }) }));
};
export default SettingsComponent;
