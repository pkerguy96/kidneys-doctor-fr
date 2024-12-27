import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Box, Chip, IconButton, Tooltip } from "@mui/material";
import DataTable from "../DataTable";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router";
import { CACHE_KEY_Suppliers } from "../../constants";
import getGlobalv2 from "../../hooks/getGlobalv2";
import { SupplierApiClient } from "../../services/SupplierService";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { confirmDialog } from "../ConfirmDialog";
import deleteItem from "../../hooks/deleteItem";
import { useQueryClient } from "@tanstack/react-query";
import { useSnackbarStore } from "../../zustand/useSnackbarStore";
import useUserRoles from "../../zustand/UseRoles";
const SupplierTable = () => {
    const { can } = useUserRoles();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const { showSnackbar } = useSnackbarStore();
    const columns = [
        { name: "id", label: "Id", options: { display: false } },
        {
            name: "company_name",
            label: "Nom de l'entreprise",
            options: { filter: true, sort: true },
        },
        {
            name: "contact_person",
            label: "Personne de contact",
            options: { filter: true, sort: true },
        },
        {
            name: "address",
            label: "Address",
            options: { filter: true, sort: true },
        },
        {
            name: "phone",
            label: "téléphone",
            options: { filter: true, sort: true },
        },
        {
            name: "email",
            label: "Email",
            options: { filter: true, sort: true },
        },
        {
            name: "supply_type",
            label: "Type de fourniture",
            options: { filter: true, sort: true },
        },
        {
            name: "tax_id",
            label: "ICE",
            options: { filter: true, sort: true },
        },
        {
            name: "status",
            label: "Statut",
            options: {
                filter: true,
                sort: true,
                customBodyRender: (value) => {
                    const isActive = value.toLowerCase() === "active"; // Check if the value is "active"
                    const color = isActive ? "success" : "error"; // Green for active, red for inactive
                    return (_jsx(Chip, { label: isActive ? "Actif" : "Inactif", color: color, variant: "outlined" }));
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
                    const SupplierId = tableMeta.rowData[0];
                    return (_jsxs(Box, { className: "w-max", children: [can(["modify_supplier", "doctor"]) && (_jsx(Tooltip, { title: "Modifier le patient", children: _jsx(IconButton, { className: "btn-patient-edit text-gray-950 hover:text-blue-700 cursor-pointer", onClick: () => navigate(`/Supplier/ajouter?supplierId=${SupplierId}`), children: _jsx(EditOutlinedIcon, {}) }) })), can(["delete_supplier", "doctor"]) && (_jsx(Tooltip, { title: "Supprimer le patient", children: _jsx(IconButton, { className: "btn-patient-delete text-gray-950 hover:text-blue-700 cursor-pointer", onClick: () => handleDeleteSupplier(SupplierId), children: _jsx(DeleteOutlineIcon, { color: "error" }) }) }))] }));
                },
            },
        },
    ];
    const handleDeleteSupplier = async (id) => {
        confirmDialog("Voulez-vous vraiment supprimer le fournisseur ?", async () => {
            try {
                const deletionSuccessful = await deleteItem(id, SupplierApiClient);
                if (deletionSuccessful) {
                    queryClient.invalidateQueries({
                        queryKey: CACHE_KEY_Suppliers,
                        exact: false,
                    });
                    showSnackbar("La suppression du fournisseur a réussi", "success");
                }
                else {
                    showSnackbar("La suppression du fournisseur a échoué", "error");
                }
            }
            catch (error) {
                showSnackbar(`Erreur lors de la suppression du fournisseur: ${error}`, "error");
            }
        });
    };
    const dataHook = (page, searchQuery, rowsPerPage) => getGlobalv2({}, CACHE_KEY_Suppliers, SupplierApiClient, page, rowsPerPage, searchQuery, {
        staleTime: 60000,
        cacheTime: 300000,
    });
    return (_jsx(_Fragment, { children: can([
            "access_supplier",
            "add_supplier",
            "delete_supplier",
            "modify_supplier",
            "doctor",
        ]) ? (_jsx(Box, { children: _jsx(DataTable, { title: "Liste des fournisseurs", noMatchMessage: "D\u00E9sol\u00E9, aucun fournisseur n'est dans nos donn\u00E9es.", columns: columns, dataHook: dataHook, options: {
                    searchPlaceholder: "Rechercher un fournisseur",
                    // Add Button restricted to "add_supplier" or "doctor"
                    customToolbar: () => can(["add_supplier", "doctor"]) ? (_jsx(Tooltip, { title: "Ajouter un fournisseur", children: _jsx(IconButton, { onClick: () => navigate("/Supplier/ajouter"), children: _jsx(AddIcon, {}) }) })) : null,
                    selectableRowsHideCheckboxes: true,
                    onRowClick: (s, _m, e) => {
                        // Future row click actions can go here
                    },
                } }) })) : (
        // Display a denial message if the user lacks permissions
        _jsx("div", { style: { textAlign: "center", color: "red", marginTop: "20px" }, children: "Vous n'avez pas la permission de consulter cette page." })) }));
};
export default SupplierTable;
