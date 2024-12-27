import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import useUserRoles from "../../zustand/UseRoles";
import { Box, IconButton, Tooltip } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { CACHE_KEY_Bloodtest } from "../../constants";
import deleteItem from "../../hooks/deleteItem";
import { useSnackbarStore } from "../../zustand/useSnackbarStore";
import { confirmDialog } from "../ConfirmDialog";
import DataTable from "../DataTable";
import AddIcon from "@mui/icons-material/Add";
import getGlobalv2 from "../../hooks/getGlobalv2";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { bloodTestApiClient } from "../../services/BloodTest";
const BloodtestTable = () => {
    const { can } = useUserRoles();
    const { showSnackbar } = useSnackbarStore();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const columns = [
        {
            name: "id",
            label: "#",
            options: { display: false },
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
            name: "blood_tests",
            label: "Test sanguin",
            options: {
                filter: true,
                sort: true,
                customBodyRender: (value) => {
                    // Check if blood_tests is an array and map the titles
                    if (Array.isArray(value)) {
                        return value.map((test) => test.title).join(", ");
                    }
                    return ""; // Return empty string if blood_tests is not an array
                },
            },
        },
        {
            name: "created_at",
            label: "Date",
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: "Actions",
            label: "Actions",
            options: {
                filter: false,
                sort: false,
                customBodyRender: () => {
                    return (_jsx(_Fragment, { children: can(["delete_blood", "doctor"]) && (_jsx(Tooltip, { title: "Supprimer l'ordonance", children: _jsx(IconButton, { className: "btn-ordonance-delete text-gray-950 hover:text-blue-700 cursor-pointer", children: _jsx(DeleteOutlineIcon, { color: "error", className: "pointer-events-none", fill: "currentColor", "aria-hidden": "false" }) }) })) }));
                },
            },
        },
    ];
    const dataHook = (page, searchQuery, rowsPerPage) => getGlobalv2({}, CACHE_KEY_Bloodtest, bloodTestApiClient, page, rowsPerPage, searchQuery, undefined);
    return (_jsx(_Fragment, { children: can(["access_blood", "doctor", "insert_blood", "delete_blood"]) ? (_jsx(Box, { className: "relative", children: _jsx(DataTable, { title: "Liste des tests sanguins", noMatchMessage: "D\u00E9sol\u00E9, aucun test sanguin n'est dans nos donn\u00E9es", columns: columns, dataHook: dataHook, options: {
                    searchPlaceholder: "Rechercher un test sanguin",
                    customToolbar: () => {
                        return can(["insert_blood", "doctor"]) ? (_jsx(Tooltip, { title: "Nouveau ordonance", children: _jsx(IconButton, { onClick: () => navigate(`/bloodtest/add`), children: _jsx(AddIcon, {}) }) })) : null;
                    },
                    selectableRowsHideCheckboxes: true,
                    onRowClick: (s, _m, e) => {
                        if (e.target.querySelector(".btn-ordonance-delete") ||
                            e.target.classList.contains("btn-ordonance-delete")) {
                            // api
                            confirmDialog("Voulez-vous vraiment supprimer le test sanguin?", async () => {
                                try {
                                    const deletionSuccessful = await deleteItem(s[0], bloodTestApiClient);
                                    if (deletionSuccessful) {
                                        queryClient.invalidateQueries(CACHE_KEY_Bloodtest);
                                        showSnackbar("La suppression du test sanguin a réussi", "success");
                                    }
                                    else {
                                        showSnackbar("La suppression du test sanguin a échoué", "error");
                                    }
                                }
                                catch (error) {
                                    showSnackbar(`Une erreur s'est produite lors de la suppression du test sanguin:${error}`, "error");
                                }
                            });
                        }
                        else {
                            navigate(`/bloodtestdetails/${s[0]}`);
                        }
                    },
                } }) })) : (_jsx("div", { style: { textAlign: "center", color: "red", marginTop: "20px" }, children: "Vous n'avez pas la permission de consulter cette page." })) }));
};
export default BloodtestTable;
