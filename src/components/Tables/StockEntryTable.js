import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Box, IconButton, Tooltip } from "@mui/material";
import DataTable from "../DataTable";
import { CACHE_KEY_StockEntry } from "../../constants";
import { SupplierProductApiClient } from "../../services/SupplierService";
import getGlobalv2 from "../../hooks/getGlobalv2";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { confirmDialog } from "../ConfirmDialog";
import deleteItem from "../../hooks/deleteItem";
import { useSnackbarStore } from "../../zustand/useSnackbarStore";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import useUserRoles from "../../zustand/UseRoles";
const StockEntryTable = () => {
    const { can } = useUserRoles();
    const { showSnackbar } = useSnackbarStore();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const handleStockDelete = async (id) => {
        confirmDialog("Voulez-vous vraiment supprimer l'opération?", async () => {
            try {
                const deletionSuccessful = await deleteItem(id, SupplierProductApiClient);
                if (deletionSuccessful) {
                    queryClient.invalidateQueries(CACHE_KEY_StockEntry);
                    showSnackbar("Opération de stock supprimée avec succès", "success");
                }
                else {
                    showSnackbar("La suppression échoué", "error");
                }
            }
            catch (error) {
                showSnackbar(`Erreur lors de la suppression d'opération: ${error}`, "error");
            }
        });
    };
    const columns = [
        { name: "id", label: "Id", options: { display: false } },
        {
            name: "product_name",
            label: "Nom du produit",
            options: { filter: true, sort: true },
        },
        {
            name: "supplier_name",
            label: "Nom fournisseur",
            options: { filter: true, sort: true },
        },
        {
            name: "contact_person",
            label: "Personne de contact",
            options: { filter: true, sort: true },
        },
        {
            name: "quantity",
            label: "Quantité",
            options: { filter: true, sort: true },
        },
        {
            name: "buy_price",
            label: "Prix ​​d'achat",
            options: { filter: true, sort: true },
        },
        {
            name: "sell_price",
            label: "Prix ​​de vente",
            options: { filter: true, sort: true },
        },
        {
            name: "invoice",
            label: "Facture",
            options: { filter: true, sort: true },
        },
        {
            name: "expiry_date",
            label: "Date expiration",
            options: { filter: true, sort: true },
        },
        {
            name: "created_at",
            label: "Créé le",
            options: { filter: true, sort: true },
        },
        {
            name: "StockActions",
            label: "Actions",
            options: {
                filter: false,
                sort: false,
                customBodyRender: (value, tableMeta) => {
                    const StockID = tableMeta.rowData[0]; // id
                    return (_jsxs(Box, { className: "w-max", children: [can(["modify_historique_enter", "doctor"]) ? (_jsx(Tooltip, { title: "Modifier l'op\u00E9ration", arrow: true, children: _jsx(IconButton, { className: "btn-patient-edit text-gray-950 hover:text-blue-700 cursor-pointer", onClick: () => navigate(`/Stock/product?stockoperation=${StockID}`), children: _jsx(EditOutlinedIcon, {}) }) })) : null, can(["delete_historique_enter", "doctor"]) ? (_jsx(Tooltip, { title: "Supprimer l'op\u00E9ration", arrow: true, disableInteractive: true, children: _jsx(IconButton, { className: "btn-patient-delete text-gray-950 hover:text-blue-700 cursor-pointer", onClick: () => handleStockDelete(StockID), children: _jsx(DeleteOutlineIcon, { color: "error" }) }) })) : null] }));
                },
            },
        },
    ];
    const dataHook = (page, searchQuery, rowsPerPage) => getGlobalv2({}, // _Tname (Type placeholder)
    CACHE_KEY_StockEntry, // Query key
    SupplierProductApiClient, // Service function
    page, // Current page
    rowsPerPage, // Number of rows per  age
    searchQuery, undefined);
    return (_jsx(_Fragment, { children: can([
            "access_historique_enter",
            "doctor",
            "modify_historique_enter",
            "delete_historique_enter",
        ]) ? (_jsx(Box, { className: "relative", children: _jsx(DataTable, { title: "Liste des entr\u00E9e", noMatchMessage: "D\u00E9sol\u00E9, aucun entr\u00E9e n'est dans nos donn\u00E9es.", columns: columns, dataHook: dataHook, options: {
                    searchPlaceholder: "Rechercher une entrée",
                    selectableRowsHideCheckboxes: true,
                    onRowClick: (s, _m, e) => { },
                } }) })) : (
        // Display a denial message if the user lacks permissions
        _jsx("div", { style: { textAlign: "center", color: "red", marginTop: "20px" }, children: "Vous n'avez pas la permission de consulter cette page." })) }));
};
export default StockEntryTable;
