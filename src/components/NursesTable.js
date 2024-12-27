import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Tooltip, IconButton, Box } from "@mui/material";
//@ts-ignore
import MUIDataTable from "mui-datatables-mara";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router";
import getGlobal from "../hooks/getGlobal";
import nurseApiClient from "../services/NurseService";
import { CACHE_KEY_NURSES } from "../constants";
import LoadingSpinner from "./LoadingSpinner";
import useUserRoles from "../zustand/UseRoles";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { confirmDialog } from "./ConfirmDialog";
import { useSnackbarStore } from "../zustand/useSnackbarStore";
import deleteItem from "../hooks/deleteItem";
import { useQueryClient } from "@tanstack/react-query";
const NursesTable = () => {
    const navigate = useNavigate();
    const { can } = useUserRoles();
    const queryClient = useQueryClient();
    const { showSnackbar } = useSnackbarStore();
    const { data, isLoading } = getGlobal({}, [CACHE_KEY_NURSES[0]], nurseApiClient, undefined);
    if (isLoading)
        return _jsx(LoadingSpinner, {});
    const columns = [
        {
            name: "id",
            label: "Id",
            options: {
                display: false,
                //customBodyRender: (v) => <button>{v}</button>,
            },
        },
        {
            name: "nom",
            label: "Nom",
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: "prenom",
            label: "Prenom",
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
            name: "address",
            label: "Address",
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: "cin",
            label: "Cin",
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: "sex",
            label: "Sex",
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: "phoneNumber",
            label: "Telephone",
            options: {
                filter: true,
                sort: false,
            },
        },
        {
            name: "PatientDetails",
            label: "Actions",
            options: {
                filter: true,
                sort: false,
                customBodyRender: (value, tableMeta) => {
                    const patientId = tableMeta.rowData[0]; // Assuming the first column is the ID
                    return (_jsxs(Box, { style: { width: "90px" }, children: [can(["delete_patient", "doctor"]) ? (_jsx("button", { className: "btn-patient-delete text-gray-950 hover:text-blue-700 cursor-pointer", onClick: () => handleDeletePatient(patientId), children: _jsx(DeleteOutlineIcon, { color: "error" }) })) : null, " "] }));
                },
            },
        },
    ];
    const options = {
        searchOpen: true,
        filterType: "dropdown",
        searchPlaceholder: "Rechercher un infirmière",
        textLabels: {
            body: {
                noMatch: "Désolé, aucun infirmière n'est dans nos données",
            },
        },
        customToolbar: () => (_jsx(Tooltip, { title: "Nouvelle infirmi\u00E8re", children: _jsx(IconButton, { onClick: () => {
                    navigate(`/AddNurse`);
                }, children: _jsx(AddIcon, {}) }) })),
        selectableRowsHideCheckboxes: true,
    };
    const handleDeletePatient = async (id) => {
        confirmDialog("Voulez-vous vraiment supprimer le patient ?", async () => {
            try {
                const deletionSuccessful = await deleteItem(id, nurseApiClient);
                if (deletionSuccessful) {
                    queryClient.invalidateQueries(CACHE_KEY_NURSES, { exact: false });
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
    return (_jsx(_Fragment, { children: can(["doctor"]) ? ( // Check if the user has the "doctor" role
        _jsx(Box, { className: "relative", children: _jsx(MUIDataTable, { title: "Liste des infirmières", data: data, columns: columns, options: options }) })) : (
        // Display a denial message if the user lacks permissions
        _jsx("div", { style: { textAlign: "center", color: "red", marginTop: "20px" }, children: "Vous n'avez pas la permission de consulter cette page." })) }));
};
export default NursesTable;
