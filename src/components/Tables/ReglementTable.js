import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
//@ts-ignore
import { Box, Chip, IconButton, Switch, Tooltip } from "@mui/material";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import PaymentModal from "../PaymentModal";
import { useState } from "react";
import { confirmDialog } from "../ConfirmDialog";
import { useSnackbarStore } from "../../zustand/useSnackbarStore";
import { useQueryClient } from "@tanstack/react-query";
import operationApiClient from "../../services/OperationService";
import { CACHE_KEY_Operation } from "../../constants";
import deleteItem from "../../hooks/deleteItem";
import DataTable from "../DataTable";
import getGlobalv2 from "../../hooks/getGlobalv2";
import useUserRoles from "../../zustand/UseRoles";
const ReglementTable = () => {
    const { can } = useUserRoles();
    const [isPaidFilter, setIsPaidFilter] = useState(null);
    const [openModal, setOpenModal] = useState(false);
    const [modalOperationId, setModalOperationId] = useState(null);
    const { showSnackbar } = useSnackbarStore();
    const queryClient = useQueryClient();
    const handleCloseModal = () => {
        setOpenModal(false);
    };
    const columns = [
        {
            name: "id",
            label: "#",
            options: {
                display: false,
            },
        },
        {
            name: "full_name",
            label: "Nom complet",
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: "Mutuelle",
            label: "Mutuelle",
            options: {
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
            name: "total_cost",
            label: "Prix Total",
            options: {
                filter: true,
                sort: true,
                customBodyRender: (value) => `${value} MAD`,
            },
        },
        {
            name: "totalPaid",
            label: "Montant Payé",
            options: {
                filter: true,
                sort: true,
                customBodyRender: (value) => `${value} MAD`,
            },
        },
        {
            name: "isPaid",
            label: "Status",
            options: {
                filter: true,
                sort: true,
                customBodyRender: (value) => {
                    const color = value ? "success" : "error";
                    return (_jsx(Chip, { label: value ? "Entièrement payé" : "Non payé", color: color, variant: "outlined" }));
                },
            },
        },
        {
            name: "Actions",
            label: "Actions",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value, tableMeta) => {
                    if (can(["delete_debt", "doctor"])) {
                        // Check permissions before rendering the delete button
                        return (_jsx(Tooltip, { title: "Supprimer paiement", children: _jsx(IconButton, { className: "btn-ordonance-delete text-gray-950 hover:text-blue-700 cursor-pointer", onClick: () => {
                                    const id = tableMeta.rowData[0]; // "id" is the first column
                                    confirmDialog("Voulez-vous vraiment supprimer le paiement ?", async () => {
                                        try {
                                            const deletionSuccessful = await deleteItem(id, operationApiClient);
                                            if (deletionSuccessful) {
                                                queryClient.invalidateQueries({
                                                    queryKey: ["operation"],
                                                });
                                                showSnackbar("La suppression du paiement a réussi", "success");
                                            }
                                            else {
                                                showSnackbar("La suppression du paiement a échoué", "error");
                                            }
                                        }
                                        catch (error) {
                                            showSnackbar(`Une erreur s'est produite lors de la suppression du paiement: ${error}`, "error");
                                        }
                                    });
                                }, children: _jsx(DeleteOutlineIcon, { color: "error", className: "pointer-events-none", fill: "currentColor" }) }) }));
                    }
                    else {
                        return null; // Do not render the button if the user lacks permissions
                    }
                },
            },
        },
    ];
    //TODO REMOVE THE CACHE WHEN OPERATION IS ADDED
    const dataHook = (page, searchQuery, rowsPerPage) => getGlobalv2({}, CACHE_KEY_Operation, operationApiClient, page, rowsPerPage, searchQuery, undefined, isPaidFilter !== null ? { isPaid: isPaidFilter ? 1 : 0 } : undefined);
    return (_jsxs(_Fragment, { children: [can(["access_debt", "doctor", "delete_debt", "insert_debt"]) ? ( // Check permissions for DataTable
            _jsx(Box, { className: "relative", children: _jsx(DataTable, { title: "Liste des paiements des op\u00E9rations", noMatchMessage: "D\u00E9sol\u00E9, aucune op\u00E9ration n'est pr\u00E9sente dans nos donn\u00E9es", columns: columns, dataHook: dataHook, options: {
                        searchPlaceholder: "Rechercher une opération",
                        selectableRowsHideCheckboxes: true,
                        customToolbar: () => {
                            return (_jsx(Tooltip, { title: "Filtrer par non pay\u00E9", children: _jsx(IconButton, { children: _jsx(Switch, { "aria-label": "hhhh", checked: isPaidFilter === false, onChange: () => setIsPaidFilter(isPaidFilter === false ? null : false) }) }) }));
                        },
                        onRowClick: (s, _m, e) => {
                            if (e.target.querySelector(".btn-ordonance-delete") ||
                                e.target.classList.contains("btn-ordonance-delete")) {
                                if (!can(["delete_debt", "doctor"])) {
                                    showSnackbar("Vous n'avez pas la permission de supprimer.", "error");
                                    return;
                                }
                                confirmDialog("Voulez-vous vraiment supprimer le paiement ?", async () => {
                                    try {
                                        const deletionSuccessful = await deleteItem(s[0], operationApiClient);
                                        if (deletionSuccessful) {
                                            queryClient.invalidateQueries({
                                                queryKey: ["operation"],
                                            });
                                            showSnackbar("La suppression du paiement a réussi", "success");
                                        }
                                        else {
                                            showSnackbar("La suppression du paiement a échoué", "error");
                                        }
                                    }
                                    catch (error) {
                                        showSnackbar(`Une erreur s'est produite lors de la suppression du paiement :${error}`, "error");
                                    }
                                });
                            }
                            else {
                                setModalOperationId(s[0]);
                                setOpenModal(true);
                            }
                        },
                    } }) })) : (_jsx("div", { style: { textAlign: "center", color: "red", marginTop: "20px" }, children: "Vous n'avez pas la permission de consulter cette page." })), openModal && can(["insert_debt", "doctor"]) ? ( // Check permissions for PaymentModal
            _jsx(PaymentModal, { open: openModal, onClose: handleCloseModal, operationID: modalOperationId })) : openModal ? (_jsx("div", { style: { textAlign: "center", color: "red", marginTop: "20px" }, children: "Vous n'avez pas la permission d'ins\u00E9rer un paiement." })) : null] }));
};
export default ReglementTable;
