import { jsx as _jsx } from "react/jsx-runtime";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { Box, IconButton, Tooltip } from "@mui/material";
import DataTable from "../DataTable";
import { useNavigate } from "react-router";
import getGlobalv2 from "../../hooks/getGlobalv2";
import { CACHE_KEY_APPOINTMENTS } from "../../constants";
import { confirmDialog } from "../ConfirmDialog";
import { paginatedAppointmentApiClient, } from "../../services/AppointmentService";
import { useSnackbarStore } from "../../zustand/useSnackbarStore";
import { useQueryClient } from "@tanstack/react-query";
import { APIClient } from "../../services/Http";
const CalenderTable = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { showSnackbar } = useSnackbarStore();
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
            name: "Actions",
            label: "Actions",
            options: {
                filter: true,
                sort: true,
                customBodyRender: () => (_jsx(Tooltip, { title: "Supprimer l'ordonance", children: _jsx(IconButton, { className: "btn-ordonance-delete text-gray-950 hover:text-blue-700 cursor-pointer", title: "Supprimer", children: _jsx(DeleteOutlineIcon, { color: "error", className: "pointer-events-none", fill: "currentColor", "aria-hidden": "false" }) }) })),
            },
        },
    ];
    const dataHook = (page, searchQuery, rowsPerPage) => getGlobalv2({}, CACHE_KEY_APPOINTMENTS, paginatedAppointmentApiClient, page, rowsPerPage, searchQuery, undefined);
    return (_jsx(Box, { className: "relative", children: _jsx(DataTable, { title: "Liste des rendez-vous", noMatchMessage: "D\u00E9sol\u00E9, aucune rendez-vous n'a \u00E9t\u00E9 trouv\u00E9e dans nos donn\u00E9es.", columns: columns, dataHook: dataHook, options: {
                searchPlaceholder: "Rechercher un rendez-vous",
                selectableRowsHideCheckboxes: true,
                onRowClick: (s, _m, e) => {
                    if (e.target.querySelector(".btn-ordonance-delete") ||
                        e.target.classList.contains("btn-ordonance-delete")) {
                        // api
                        confirmDialog("Voulez-vous vraiment supprimer rendez-vous ?", async () => {
                            try {
                                const apiclient = new APIClient("Appointment");
                                const deletionSuccessful = await apiclient.DeleteOne(s[0]);
                                if (deletionSuccessful) {
                                    queryClient.invalidateQueries(CACHE_KEY_APPOINTMENTS);
                                    showSnackbar("Le rendez-vous est supprimé", "warning");
                                }
                                else {
                                    showSnackbar("La suppression du rendez-vous a échoué", "error");
                                }
                            }
                            catch (error) {
                                showSnackbar(`Une erreur s'est produite lors de la suppression du rendez-vous:${error}`, "error");
                            }
                        });
                    }
                },
            } }) }));
};
export default CalenderTable;
