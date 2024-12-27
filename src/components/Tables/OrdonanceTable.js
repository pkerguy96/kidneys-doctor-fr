import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import Tooltip from "@mui/material/Tooltip";
import { IconButton, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router";
import { CACHE_KEY_Ordonance } from "../../constants";
import { confirmDialog } from "../ConfirmDialog";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbarStore } from "../../zustand/useSnackbarStore";
import ordonanceApiClient from "../../services/OrdonanceService";
import deleteItem from "../../hooks/deleteItem";
import DataTable from "../DataTable";
import getGlobalv2 from "../../hooks/getGlobalv2";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import useUserRoles from "../../zustand/UseRoles";
const OrdonanceTable = () => {
    const { can } = useUserRoles();
    const { showSnackbar } = useSnackbarStore();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const columns = [
        {
            name: "id",
            label: "#",
        },
        {
            name: "patient_id",
            label: "#",
            options: {
                display: false,
            },
        },
        {
            name: "patient_name",
            label: "Nom complet",
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: "date",
            label: "Date",
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: "patient_deleted_at",
            label: "#",
            options: {
                display: false,
            },
        },
        {
            name: "Actions",
            label: "Actions",
            options: {
                filter: true,
                sort: true,
                customBodyRender: (value, tableMeta) => {
                    const patientDeletedAt = tableMeta.rowData[4];
                    return (_jsxs(Box, { className: "w-max", children: [can(["update_ordonance", "doctor"]) && !patientDeletedAt && (_jsx(Tooltip, { title: "Modifier l'ordonance", children: _jsx(IconButton, { className: "btn-ordonance-edit text-gray-950 hover:text-blue-700 cursor-pointer", children: _jsx(EditOutlinedIcon, { className: "pointer-events-none", fill: "currentColor" }) }) })), can(["delete_ordonance", "doctor"]) && (_jsx(Tooltip, { title: "Supprimer l'ordonance", children: _jsx(IconButton, { className: "btn-ordonance-delete text-gray-950 hover:text-blue-700 cursor-pointer", children: _jsx(DeleteOutlineIcon, { color: "error", className: "pointer-events-none", fill: "currentColor", "aria-hidden": "false" }) }) }))] }));
                },
            },
        },
    ];
    const dataHook = (page, searchQuery, rowsPerPage) => getGlobalv2({}, CACHE_KEY_Ordonance, ordonanceApiClient, page, rowsPerPage, searchQuery, {
        staleTime: 60000,
        cacheTime: 300000,
    });
    return (_jsx(_Fragment, { children: can([
            "access_ordonance",
            "doctor",
            "insert_ordonance",
            "update_ordonance",
            "delete_ordonance",
        ]) ? (_jsx(Box, { className: "relative", children: _jsx(DataTable, { title: "Liste des ordonances", noMatchMessage: "D\u00E9sol\u00E9, aucun ordonance n'est dans nos donn\u00E9es", columns: columns, dataHook: dataHook, options: {
                    searchPlaceholder: "Rechercher une ordonance",
                    customToolbar: () => {
                        return can(["insert_ordonance", "doctor"]) ? (_jsx(Tooltip, { title: "Nouveau ordonance", children: _jsx(IconButton, { onClick: () => navigate(`/AddOrdonance?direct=true`), children: _jsx(AddIcon, {}) }) })) : null;
                    },
                    selectableRowsHideCheckboxes: true,
                    onRowClick: (s, _m, e) => {
                        if (e.target.querySelector(".btn-ordonance-edit") ||
                            e.target.classList.contains("btn-ordonance-edit")) {
                            navigate(`/AddOrdonance?ordonanceID=${s[0]}&id=${s[1]}`);
                        }
                        else if (e.target.querySelector(".btn-ordonance-delete") ||
                            e.target.classList.contains("btn-ordonance-delete")) {
                            // api
                            confirmDialog("Voulez-vous vraiment supprimer le ordonance ?", async () => {
                                try {
                                    const deletionSuccessful = await deleteItem(s[0], ordonanceApiClient);
                                    if (deletionSuccessful) {
                                        queryClient.invalidateQueries(CACHE_KEY_Ordonance);
                                        showSnackbar("La suppression du ordonance a réussi", "success");
                                    }
                                    else {
                                        showSnackbar("La suppression du ordonance a échoué", "error");
                                    }
                                }
                                catch (error) {
                                    showSnackbar(`Une erreur s'est produite lors de la suppression du ordonance:${error}`, "error");
                                }
                            });
                        }
                        else {
                            navigate(`/OrdonanceDetails/${s[0]}`);
                        }
                    },
                } }) })) : (_jsx("div", { style: { textAlign: "center", color: "red", marginTop: "20px" }, children: "Vous n'avez pas la permission de consulter cette page." })) }));
};
export default OrdonanceTable;
