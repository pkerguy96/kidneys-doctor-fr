import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import MedicationLiquidOutlinedIcon from "@mui/icons-material/MedicationLiquidOutlined";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import { Link } from "react-router-dom";
/* newly added  */
import DateRangeSharpIcon from "@mui/icons-material/DateRangeSharp";
import SettingsIcon from "@mui/icons-material/Settings";
import BadgeIcon from "@mui/icons-material/Badge";
import ContentPasteSearchOutlinedIcon from "@mui/icons-material/ContentPasteSearchOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import { Collapse, Divider, List } from "@mui/material";
import RequestQuoteOutlinedIcon from "@mui/icons-material/RequestQuoteOutlined";
import AccountBalanceOutlinedIcon from "@mui/icons-material/AccountBalanceOutlined";
import useUserRoles from "./zustand/UseRoles";
import AutorenewOutlinedIcon from "@mui/icons-material/AutorenewOutlined";
import PersonAddAlt1OutlinedIcon from "@mui/icons-material/PersonAddAlt1Outlined";
import InputOutlinedIcon from "@mui/icons-material/InputOutlined";
import OutputOutlinedIcon from "@mui/icons-material/OutputOutlined";
import BloodtypeOutlinedIcon from "@mui/icons-material/BloodtypeOutlined";
import { useState } from "react";
import InventoryOutlinedIcon from "@mui/icons-material/InventoryOutlined";
import AddBusinessOutlinedIcon from "@mui/icons-material/AddBusinessOutlined";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
export const MainListItems = () => {
    const { can } = useUserRoles();
    return (_jsxs(React.Fragment, { children: [_jsx(Link, { to: "/dashboard", className: "no-underline", children: _jsxs(ListItemButton, { children: [_jsx(ListItemIcon, { children: _jsx(DashboardIcon, { color: "primary" }) }), _jsx(ListItemText, { primary: "Accueille" })] }) }), _jsx(Link, { to: "/Appointments", className: "no-underline", children: _jsxs(ListItemButton, { children: [_jsx(ListItemIcon, { children: _jsx(DateRangeSharpIcon, { color: "primary" }) }), _jsx(ListItemText, { primary: "Rendez-vous" })] }) }), can([
                "insert_patient",
                "access_patient",
                "update_patient",
                "delete_patient",
                "detail_patient",
                "doctor",
            ]) && (_jsx(Link, { to: "/Patients", className: "no-underline", children: _jsxs(ListItemButton, { children: [_jsx(ListItemIcon, { children: _jsx(PeopleIcon, { color: "primary" }) }), _jsx(ListItemText, { primary: "Patients" })] }) })), can(["access_debt", "doctor"]) && (_jsx(Link, { to: "/Op\u00E9rations-inachev\u00E9es", className: "no-underline", children: _jsxs(ListItemButton, { children: [_jsx(ListItemIcon, { children: _jsx(AutorenewOutlinedIcon, { color: "primary" }) }), _jsx(ListItemText, { primary: "Op\u00E9rations inachev\u00E9es" })] }) })), can([
                "access_ordonance",
                "insert_ordonance",
                "update_ordonance",
                "delete_ordonance",
                "doctor",
            ]) && (_jsx(Link, { to: "/Ordonnance", className: "no-underline", children: _jsxs(ListItemButton, { children: [_jsx(ListItemIcon, { children: _jsx(MedicationLiquidOutlinedIcon, { color: "primary" }) }), _jsx(ListItemText, { primary: "Ordonnance" })] }) })), can(["access_blood", "insert_blood", "delete_blood", "doctor"]) && (_jsx(Link, { to: "/bloodtest", className: "no-underline", children: _jsxs(ListItemButton, { children: [_jsx(ListItemIcon, { children: _jsx(BloodtypeOutlinedIcon, { color: "primary" }) }), _jsx(ListItemText, { primary: "Analyse" })] }) })), can(["access_creance", "doctor"]) && (_jsx(Link, { to: "/Creance", className: "no-underline", children: _jsxs(ListItemButton, { children: [_jsx(ListItemIcon, { children: _jsx(AccountBalanceOutlinedIcon, { color: "primary" }) }), _jsx(ListItemText, { primary: "Cr\u00E9ance" })] }) })), can(["access_debt", "insert_debt", "delete_debt", "doctor"]) && (_jsx(Link, { to: "/Reglement", className: "no-underline", children: _jsxs(ListItemButton, { children: [_jsx(ListItemIcon, { children: _jsx(RequestQuoteOutlinedIcon, { color: "primary" }) }), _jsx(ListItemText, { primary: "R\u00E8glement" })] }) })), can([
                "access_external_debt",
                "insert_external_debt",
                "delete_external_debt",
                "doctor",
            ]) && (_jsx(Link, { to: "/External", className: "no-underline", children: _jsxs(ListItemButton, { children: [_jsx(ListItemIcon, { children: _jsx(AddBusinessOutlinedIcon, { color: "primary" }) }), _jsx(ListItemText, { primary: "R\u00E8glement extern" })] }) }))] }));
};
export function SecondaryListItems({}) {
    const { can } = useUserRoles();
    const [open, setOpen] = useState(false);
    const handleClick = () => {
        setOpen(!open);
    };
    return (_jsxs(React.Fragment, { children: [can(["doctor"]) && (_jsx(Link, { to: "/Nurses", className: "no-underline", children: _jsxs(ListItemButton, { children: [_jsx(ListItemIcon, { children: _jsx(BadgeIcon, { color: "primary" }) }), _jsx(ListItemText, { primary: "Gestion du personnel" })] }) })), _jsx(Divider, {}), can([
                "access_document",
                "insert_document",
                "delete_document",
                "download_document",
                "detail_document",
                "doctor",
            ]) && (_jsx(Link, { to: "/Files", className: "no-underline", children: _jsxs(ListItemButton, { children: [_jsx(ListItemIcon, { children: _jsx(ContentPasteSearchOutlinedIcon, { color: "primary" }) }), _jsx(ListItemText, { primary: "imagerie" })] }) })), can([
                "access_supplier",
                "add_supplier",
                "delete_supplier",
                "modify_supplier",
                "access_stock",
                "add_stock",
                "delete_stock",
                "modify_stock",
                "access_product",
                "add_product",
                "delete_product",
                "modify_product",
                "access_historique_enter",
                "add_historique_enter",
                "delete_historique_enter",
                "modify_historique_enter",
                "access_historique_sortie",
                "doctor",
            ]) && (_jsxs(ListItemButton, { onClick: handleClick, style: {
                    flexGrow: "0",
                    WebkitFlexGrow: "0",
                }, children: [_jsx(ListItemIcon, { children: _jsx(Inventory2OutlinedIcon, { color: "primary" }) }), _jsx(ListItemText, { primary: "Gestion des stocks" }), open ? _jsx(ExpandLess, {}) : _jsx(ExpandMore, {})] })), _jsx(Collapse, { in: open, timeout: "auto", unmountOnExit: true, style: {
                    minHeight: "unset",
                }, children: _jsxs(List, { component: "div", disablePadding: true, children: [can([
                            "access_supplier",
                            "add_supplier",
                            "delete_supplier",
                            "modify_supplier",
                            "doctor",
                        ]) && (_jsx(Link, { to: "/Supplier", className: "no-underline", children: _jsxs(ListItemButton, { children: [_jsx(ListItemIcon, { children: _jsx(PersonAddAlt1OutlinedIcon, { color: "primary" }) }), _jsx(ListItemText, { primary: "Fournisseur" })] }) })), can([
                            "access_product",
                            "add_product",
                            "delete_product",
                            "modify_product",
                            "add_stock",
                            "doctor",
                        ]) && (_jsx(Link, { to: "/Stock", className: "no-underline", children: _jsxs(ListItemButton, { children: [_jsx(ListItemIcon, { children: _jsx(InventoryOutlinedIcon, { color: "primary" }) }), _jsx(ListItemText, { primary: "Stock" })] }) })), can([
                            "access_historique_enter",
                            "delete_historique_enter",
                            "modify_historique_enter",
                            "doctor",
                        ]) && (_jsx(Link, { to: "/Stock/entry", className: "no-underline", children: _jsxs(ListItemButton, { children: [_jsx(ListItemIcon, { children: _jsx(InputOutlinedIcon, { color: "primary" }) }), _jsx(ListItemText, { primary: "Historique des entr\u00E9es" })] }) })), can([
                            "access_historique_sortie",
                            "delete_historique_enter",
                            "doctor",
                        ]) && (_jsx(Link, { to: "/Stock/exit", className: "no-underline", children: _jsxs(ListItemButton, { children: [_jsx(ListItemIcon, { children: _jsx(OutputOutlinedIcon, { color: "primary" }) }), _jsx(ListItemText, { primary: "Historique des sorties" })] }) }))] }) }), _jsx(Link, { to: "/Settings", className: "no-underline mt-auto", children: _jsxs(ListItemButton, { children: [_jsx(ListItemIcon, { children: _jsx(SettingsIcon, { color: "primary" }) }), _jsx(ListItemText, { primary: "Settings" })] }) })] }));
}
