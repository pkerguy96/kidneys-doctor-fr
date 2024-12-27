import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { CACHE_KEY_WAITINGLIST } from "../../constants";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useSnackbarStore } from "../../zustand/useSnackbarStore";
import { confirmDialog } from "../ConfirmDialog";
import { Box, Chip, IconButton, Tooltip } from "@mui/material";
import deleteItem from "../../hooks/deleteItem";
import { decrementPatientApiClient, FetchWaitingList, } from "../../services/WaitingroomService";
import { useNavigate } from "react-router";
import getGlobalv2 from "../../hooks/getGlobalv2";
import DataTable from "../DataTable";
import { useQueryClient } from "@tanstack/react-query";
import useUserRoles from "../../zustand/UseRoles";
import FolderSharedOutlinedIcon from "@mui/icons-material/FolderSharedOutlined";
import { useCallback, useMemo } from "react";
const AppointmentsTableKpi = () => {
    const { showSnackbar } = useSnackbarStore();
    const queryClient = useQueryClient();
    const { can } = useUserRoles();
    const navigate = useNavigate();
    const dataHook = (page, searchQuery, rowsPerPage) => getGlobalv2({}, CACHE_KEY_WAITINGLIST, FetchWaitingList, page, rowsPerPage, searchQuery, {
        refetchInterval: 5000, // Fetch data every 5 seconds
    });
    const columns = useMemo(() => [
        {
            name: "id",
            label: "#",
            options: {
                display: false,
            },
        },
        {
            name: "patient_id",
            label: "#d",
            options: {
                display: false,
            },
        },
        {
            name: "count",
            label: "#d",
            options: {
                display: false,
            },
        },
        {
            name: "order",
            label: "Ordre",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (_value, tableMeta) => {
                    return (tableMeta.tableState.rowsPerPage * tableMeta.tableState.page +
                        tableMeta.rowIndex +
                        1);
                },
            },
        },
        {
            name: "patient_name",
            label: "Nom",
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: "waiting_time",
            label: "Temps d'attente",
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: "status",
            label: "Statut",
            options: {
                filter: true,
                sort: true,
                customBodyRender: (value) => {
                    const color = {
                        waiting: "info",
                        pending: "warning",
                        current: "success",
                    }[value];
                    //@ts-ignore
                    return _jsx(Chip, { label: value, color: color, variant: "outlined" });
                },
            },
        },
        {
            name: "Actions",
            label: "Actions",
            options: {
                filter: true,
                sort: true,
                customBodyRender: () => (_jsxs(Box, { className: "w-max", children: [can(["detail_patient", "doctor"]) && (_jsx(Tooltip, { title: "Information du patient", children: _jsx(IconButton, { className: "text-3xl btn-patient-info text-gray-950 hover:text-blue-700 cursor-pointer", children: _jsx(FolderSharedOutlinedIcon, { color: "info", fontSize: "inherit" }) }) })), _jsx(Tooltip, { title: "Supprimer le patient de la salle d'attente", children: _jsx(IconButton, { className: " text-3xl btn-ordonance-delete text-gray-950 hover:text-blue-700 cursor-pointer", children: _jsx(DeleteOutlineIcon, { color: "error", className: "pointer-events-none", fill: "currentColor", fontSize: "inherit" }) }) })] })),
            },
        },
    ], [can]);
    const handleDeletePatient = async (patientId) => {
        confirmDialog("Voulez-vous supprimer le patient de la salle d'attente ?", async () => {
            try {
                const deletionSuccessful = await deleteItem(parseInt(patientId), decrementPatientApiClient);
                if (deletionSuccessful) {
                    queryClient.invalidateQueries(CACHE_KEY_WAITINGLIST, {
                        exact: false,
                    });
                    showSnackbar("La suppression du patient de la salle d'attente a été effectuée avec succès.", "success");
                }
                else {
                    showSnackbar("La suppression du patient de la salle d'attente a échoué.", "error");
                }
            }
            catch (error) {
                showSnackbar(`Une erreur s'est produite lors de la suppression: ${error}`, "error");
            }
        });
    };
    const handleRowClick = useCallback((rowData, _meta, event) => {
        const patientId = rowData[1]; // Assuming patient ID is in rowData[1]
        if (event.target.closest(".btn-ordonance-delete") ||
            event.target.classList.contains("btn-ordonance-delete")) {
            handleDeletePatient(rowData[0]); // Assuming ID is in rowData[0]
        }
        else if (event.target.closest(".btn-patient-info") ||
            event.target.classList.contains("btn-patient-info")) {
            navigate(`/Patients/Details/${patientId}`);
        }
        else if (can(["doctor"])) {
            navigate(`/Patients/operations/?id=${patientId}`);
        }
    }, [handleDeletePatient, navigate, can]);
    return (_jsx(DataTable, { title: "Liste des patients dans la salle d'attente", noMatchMessage: "D\u00E9sol\u00E9, aucun patient n'est enregistr\u00E9", columns: columns, dataHook: dataHook, options: {
            elevation: 0,
            searchPlaceholder: "Rechercher un patient",
            selectableRowsHideCheckboxes: true,
            onRowClick: handleRowClick,
        } }));
};
export default AppointmentsTableKpi;
