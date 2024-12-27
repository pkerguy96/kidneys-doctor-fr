import { jsx as _jsx } from "react/jsx-runtime";
//@ts-nocheck
import MUIDataTable from "mui-datatables-mara";
import { Box } from "@mui/material";
const DebtTableComponant = ({ data }) => {
    const columns = [
        {
            name: "id",
            label: "#",
            options: {
                display: false,
            },
        },
        {
            name: "name",
            label: "Nom et Prénom",
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
            name: "operation_type",
            label: "Type d'opération",
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: "total_cost",
            label: "Coût Total",
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: "total_amount_paid",
            label: "Montant Payé",
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: "amount_due",
            label: "Solde impayé",
            options: {
                filter: true,
                sort: true,
            },
        },
    ];
    const options = {
        elevation: 0,
        searchOpen: true,
        filterType: "dropdown",
        searchPlaceholder: "Rechercher une opération",
        textLabels: {
            body: {
                noMatch: "Désolé, aucun paiements impayés n'est dans nos données",
            },
        },
        selectableRowsHideCheckboxes: true,
    };
    return (_jsx(Box, { className: "relative border border-gray-300", children: _jsx(MUIDataTable, { title: "Liste des paiements impayés", data: data, columns: columns, options: options }) }));
};
export default DebtTableComponant;
