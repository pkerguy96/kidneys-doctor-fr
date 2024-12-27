import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Chip, IconButton, Switch, Tooltip } from "@mui/material";
import DataTable from "../DataTable";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import getGlobalv2 from "../../hooks/getGlobalv2";
import { CACHE_KEY_Hospitaloperations } from "../../constants";
import { hospitalOperationApiClient } from "../../services/HospitalService";
import { confirmDialog } from "../ConfirmDialog";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbarStore } from "../../zustand/useSnackbarStore";
import deleteItem from "../../hooks/deleteItem";
import PaymentModal from "../PaymentModal";
import { useState } from "react";
import useUserRoles from "../../zustand/UseRoles";
const ClinicOperationsTable = () => {
    const [openModal, setOpenModal] = useState(false);
    const { can } = useUserRoles();
    const [isPaidFilter, setIsPaidFilter] = useState(null);
    const [modalOperationId, setModalOperationId] = useState(null);
    const queryClient = useQueryClient();
    const { showSnackbar } = useSnackbarStore();
    const navigate = useNavigate();
    const handleCloseModal = () => {
        setOpenModal(false);
    };
    const handleStockDelete = async (id) => {
        confirmDialog("Voulez-vous vraiment supprimer le patient ?", async () => {
            try {
                const deletionSuccessful = await deleteItem(id, hospitalOperationApiClient);
                if (deletionSuccessful) {
                    queryClient.invalidateQueries(CACHE_KEY_Hospitaloperations);
                    showSnackbar("La suppression du patient a réussi", "success");
                }
                else {
                    showSnackbar("La suppression du patient a échoué", "error");
                }
            }
            catch (error) {
                showSnackbar(`Erreur lors de la suppression du patient: ${error}`, "error");
            }
        });
    };
    const columns = [
        { name: "id", label: "ID", options: { display: false } },
        { name: "operation_id", label: "OPID", options: { display: false } },
        {
            name: "hospital",
            label: "Nom de la clinique",
            options: { filter: true, sort: true },
        },
        {
            name: "patient_name",
            label: "Nom du patient",
            options: { filter: true, sort: true },
        },
        {
            name: "Mutuelle",
            label: "Mutuelle",
            options: { filter: true, sort: true },
        },
        {
            name: "operation_type",
            label: "Type d'opération",
            options: { filter: true, sort: true },
        },
        {
            name: "description",
            label: "Description",
            options: { filter: true, sort: true },
        },
        {
            name: "operation_date",
            label: "Date de l'opération",
            options: { filter: true, sort: true },
        },
        {
            name: "total_price",
            label: "Prix ​​total",
            options: {
                filter: true,
                sort: true,
                customBodyRender: (value) => `${value} MAD`, // Append "MAD" to total price
            },
        },
        {
            name: "amount_paid",
            label: "Montant payé",
            options: {
                filter: true,
                sort: true,
                customBodyRender: (value) => `${value} MAD`, // Append "MAD" to amount paid
            },
        },
        {
            name: "fee",
            label: "Les honoraires",
            options: {
                filter: true,
                sort: true,
                customBodyRender: (value) => `${value} MAD`, // Append "MAD" to amount paid
            },
        },
        {
            name: "isPaid",
            label: "Statut de Paiement",
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
            name: "StockActions",
            label: "Actions",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value, tableMeta) => {
                    const StockID = tableMeta.rowData[0]; // id
                    // Check permissions for deleting stock
                    if (can(["delete_external_debt", "doctor"])) {
                        return (_jsx(Box, { style: { width: "90px" }, children: _jsx(Tooltip, { title: "Supprimer le produit", arrow: true, children: _jsx(IconButton, { className: "btn-patient-delete text-gray-950 hover:text-blue-700 cursor-pointer", onClick: () => handleStockDelete(StockID), children: _jsx(DeleteOutlineIcon, { color: "error" }) }) }) }));
                    }
                    else {
                        // Return null if the user lacks the required permissions
                        return null;
                    }
                },
            },
        },
    ];
    const dataHook = (page, searchQuery, rowsPerPage) => getGlobalv2({}, // _Tname (Type placeholder)
    CACHE_KEY_Hospitaloperations, // Query key
    hospitalOperationApiClient, // Service function
    page, // Current page
    rowsPerPage, // Number of rows per  age
    searchQuery, undefined, isPaidFilter !== null ? { isPaid: isPaidFilter ? 1 : 0 } : undefined);
    return (_jsx(Box, { className: "relative", children: can([
            "access_external_debt",
            "doctor",
            "insert_external_debt",
            "delete_external_debt",
        ]) ? (_jsxs(_Fragment, { children: [_jsx(DataTable, { title: "Liste des op\u00E9rations externes", noMatchMessage: "D\u00E9sol\u00E9, aucune op\u00E9ration n'est dans nos donn\u00E9es.", columns: columns, dataHook: dataHook, options: {
                        searchPlaceholder: "Rechercher une opération",
                        customToolbar: () => (_jsxs(_Fragment, { children: [_jsx(Tooltip, { title: "Filtrer par non pay\u00E9", children: _jsx(IconButton, { children: _jsx(Switch, { "aria-label": "Filter unpaid", checked: isPaidFilter === false, onChange: () => setIsPaidFilter(isPaidFilter === false ? null : false) }) }) }), can(["insert_external_debt", "doctor"]) && (_jsx(Tooltip, { title: "Nouvelle op\u00E9ration", children: _jsx(IconButton, { onClick: () => navigate("/External/ajouter"), children: _jsx(AddIcon, {}) }) }))] })),
                        selectableRowsHideCheckboxes: true,
                        onRowClick: (s, _m, e) => {
                            if (!e.target.querySelector(".btn-patient-delete") &&
                                !e.target.classList.contains("btn-patient-delete")) {
                                setModalOperationId(s[1]);
                                setOpenModal(true);
                            }
                        },
                    } }), openModal && can(["insert_external_debt", "doctor"]) ? (_jsx(PaymentModal, { open: openModal, onClose: handleCloseModal, operationID: modalOperationId })) : openModal ? (_jsx("div", { style: { textAlign: "center", color: "red", marginTop: "20px" }, children: "Vous n'avez pas la permission d'ins\u00E9rer un paiement." })) : null] })) : (
        // If the user lacks "access_external_debt" or "doctor" permissions
        _jsx("div", { style: { textAlign: "center", color: "red", marginTop: "20px" }, children: "Vous n'avez pas la permission de consulter cette page." })) }));
};
export default ClinicOperationsTable;
