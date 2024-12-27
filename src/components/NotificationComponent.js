import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Badge, Box, IconButton, Menu, Typography } from "@mui/material";
import React, { useCallback } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import getGlobal from "../hooks/getGlobal";
import { CACHE_KEY_Notification } from "../constants";
import { markAsReadApiClient, NotificationApiClient, } from "../services/NotificationService";
import getUrls from "../hooks/getUrls";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
const NotificationComponent = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);
    const handleClick = useCallback((event) => {
        setAnchorEl(event.currentTarget);
    }, []);
    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, []);
    const { data, isLoading } = getGlobal({}, CACHE_KEY_Notification, NotificationApiClient, {
        refetchInterval: 10000,
    });
    const unreadCount = data?.filter((notification) => !notification.is_read)
        .length || 0;
    const markAsRead = async (id, target_id, type) => {
        await getUrls(id, markAsReadApiClient);
        queryClient.invalidateQueries(CACHE_KEY_Notification);
        if (type === "payment") {
            navigate(`/InvoicePage?target_id=${target_id}`);
        }
        else if (type === "xray") {
            navigate(`/Xraydemand?target_id=${target_id}`);
        }
        else {
            return;
        }
    };
    if (isLoading)
        return _jsx(NotificationsIcon, {});
    return (_jsxs(_Fragment, { children: [_jsx(IconButton, { color: "inherit", onClick: handleClick, id: "basic-button", "aria-controls": open ? "basic-menu" : undefined, "aria-haspopup": "true", "aria-expanded": open ? "true" : undefined, children: _jsx(Badge, { badgeContent: unreadCount, color: "secondary", children: _jsx(NotificationsIcon, {}) }) }), _jsxs(Menu, { id: "basic-menu", anchorEl: anchorEl, open: open, onClose: handleClose, MenuListProps: {
                    style: {
                        width: "400px",
                        padding: 0,
                        maxHeight: 470,
                        display: "flex",
                        flexDirection: "column",
                        overflow: "auto",
                    },
                    "aria-labelledby": "basic-button",
                }, children: [_jsxs(Box, { tabIndex: -1, className: "flex items-center justify-between p-2 px-4", children: [_jsx("span", { className: "font-medium text-md", children: "Notifications" }), _jsx(Box, { className: "flex flex-row gap-2" })] }), _jsx(Box, { className: "flex flex-col", children: data?.length === 0 ? (_jsx(Box, { className: "flex justify-center items-center py-4", children: _jsx(Typography, { className: "text-gray-500 text-sm", children: "Aucune notification pour le moment" }) })) : (data?.map((notification, index) => {
                            return (_jsxs(Box, { className: `flex flex-wrap gap-2 items-center border-t border-gray-200 p-4 ${notification.type === "stock"
                                    ? "cursor-default"
                                    : "cursor-pointer"}`, onClick: () => {
                                    markAsRead(notification.id, notification.target_id, notification.type);
                                }, children: [_jsxs(Box, { className: "w-0 flex-1", children: [_jsx(Typography, { className: `${notification.type === "stock" ? "text-red-500" : ""}`, children: notification.title }), notification.message && (_jsx(Typography, { className: "text-xs text-gray-500", children: notification.message })), _jsx(Typography, { className: "text-xs text-gray-500", children: notification.date })] }), !notification.is_read && (_jsx("span", { className: "block w-2 h-2 rounded-full bg-blue-500" }))] }, index));
                        })) })] })] }));
};
export default NotificationComponent;
