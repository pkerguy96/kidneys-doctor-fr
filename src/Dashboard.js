import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import { styled } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import MuiDrawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Container from "@mui/material/Container";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { MainListItems, SecondaryListItems } from "./ListItems";
import DashboardMenu from "./components/DashboardMenu";
import WaitingRoomMenu from "./components/WaitingRoomMenu";
import useUserRoles from "./zustand/UseRoles";
import NotificationComponent from "./components/NotificationComponent";
const drawerWidth = 280;
const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    background: "#32aee4",
    transition: theme.transitions.create(["width", "margin"], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(["width", "margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));
const Drawer = styled(MuiDrawer, {
    shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
    "& .MuiDrawer-paper": {
        position: "relative",
        whiteSpace: "nowrap",
        width: drawerWidth,
        transition: theme.transitions.create("width", {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
        boxSizing: "border-box",
        ...(!open && {
            overflowX: "hidden",
            transition: theme.transitions.create("width", {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.leavingScreen,
            }),
            width: theme.spacing(7),
            [theme.breakpoints.up("sm")]: {
                width: theme.spacing(9),
            },
        }),
    },
}));
const today = formatFrenchDate(new Date());
export default function Dashboard(Props) {
    const [open, setOpen] = React.useState(false);
    const [openListMenu, setOpenListMenu] = React.useState(false);
    const { can } = useUserRoles();
    const toggleListMenu = () => {
        setOpenListMenu(!openListMenu); // Fix the toggleListMenu function
    };
    // onmouse actions for drawer to be opened
    const openDrawerOnmouse = (value) => {
        setOpen(value);
    };
    const toggleDrawer = () => {
        setOpen(!open);
    };
    return (_jsxs(Box, { sx: { display: "flex", height: "100dvh" }, children: [_jsx(CssBaseline, {}), _jsx(AppBar, { position: "absolute", open: open, children: _jsxs(Toolbar, { sx: {
                        pr: "24px", // keep right padding when drawer closed
                    }, children: [_jsx(IconButton, { edge: "start", color: "inherit", "aria-label": "open drawer", onClick: () => setOpen((prev) => !prev), sx: {
                                marginRight: "36px",
                                ...(open && { display: "none" }),
                            }, children: _jsx(MenuIcon, {}) }), _jsx(Typography, { component: "h1", variant: "h6", color: "inherit", noWrap: true, sx: { flexGrow: 1 }, children: today }), _jsx(WaitingRoomMenu, {}), _jsx(NotificationComponent, {}), _jsx(DashboardMenu, {})] }) }), _jsxs(Drawer, { variant: "permanent", open: open, onMouseEnter: () => setOpen(true), onMouseLeave: () => setOpen(false), children: [_jsx(Toolbar, { className: "relative flex items-center justify-end px-1", children: _jsx(IconButton, { className: "z-10", onClick: () => setOpen((prev) => !prev), children: _jsx(ChevronLeftIcon, {}) }) }), _jsx(Divider, { className: "mt-1" }), _jsxs(List, { component: "nav", className: "flex flex-col h-full", children: [_jsx(MainListItems, {}), _jsx(Divider, { sx: { my: 1 } }), _jsx(SecondaryListItems, { toggle: openListMenu, isSideBarOpen: open, handleClick: () => setOpenListMenu(!openListMenu) })] })] }), _jsxs(Box, { component: "main", sx: {
                    backgroundColor: (theme) => theme.palette.mode === "light"
                        ? "#f6f7fb"
                        : theme.palette.grey[900],
                    flexGrow: 1,
                    height: "100vh",
                    overflow: "auto",
                }, children: [_jsx(Toolbar, {}), _jsx(Container, { maxWidth: "lg", sx: { mt: 4, mb: 4 }, children: Props.children })] })] }));
}
export function formatFrenchDate(date) {
    const options = {
        year: "numeric",
        month: "long",
        day: "numeric",
    };
    const formatted = new Intl.DateTimeFormat("fr-FR", options).format(date);
    const [day, month, year] = formatted.split(" ");
    const capitalizedMonth = month.charAt(0).toUpperCase() + month.slice(1);
    return `${day} ${capitalizedMonth} ${year}`;
}
