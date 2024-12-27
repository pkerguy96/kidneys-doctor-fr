import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Box } from "@mui/material";
import { incompletedOperationsApiClient } from "../../services/OperationService";
import { CACHE_KEY_RecurringOperations } from "../../constants";
import DataTable from "../DataTable";
import getGlobalv2 from "../../hooks/getGlobalv2";
import useUserRoles from "../../zustand/UseRoles";
const IncompletedOperations = () => {
    const { can } = useUserRoles();
    const columns = [
        {
            name: "id",
            label: "Id",
            options: {
                display: false,
            },
        },
        {
            name: "name",
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
            name: "xray_types",
            label: "Radiographies",
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: "operation_names",
            label: "Opération supplémentaire",
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: "cost",
            label: "Coût total",
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: "treatment_nbr",
            label: "Nombre de traitements",
            options: {
                filter: true,
                sort: true,
            },
        },
    ];
    const dataHook = (page, searchQuery, rowsPerPage) => getGlobalv2({}, // _Tname (Type placeholder)
    CACHE_KEY_RecurringOperations, // Query key
    incompletedOperationsApiClient, // Service function
    page, // Current page
    rowsPerPage, // Number of rows per page
    searchQuery, undefined);
    //TODO  invalidate cache once the operation completed and its reocuring
    return (_jsx(_Fragment, { children: can(["access_operation_recurring", "doctor"]) ? (_jsx(Box, { className: "relative", children: _jsx(DataTable, { title: "Liste des op\u00E9rations incompl\u00E8tes", noMatchMessage: "D\u00E9sol\u00E9, aucune op\u00E9ration incompl\u00E8te n'est dans nos donn\u00E9es.", columns: columns, dataHook: dataHook, options: {
                    searchPlaceholder: "Rechercher une opération ",
                    selectableRows: "none",
                } }) })) : (_jsx("div", { style: { textAlign: "center", color: "red", marginTop: "20px" }, children: "Vous n'avez pas la permission de consulter cette page." })) }));
};
export default IncompletedOperations;
