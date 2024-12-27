import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import DataTable from "../DataTable";
import { useNavigate } from "react-router";
import { Box, IconButton, Tooltip } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { CACHE_KEY_PATIENTS, CACHE_KEY_WAITINGLIST } from "../../constants";
import patientAPIClient from "../../services/PatientService";
import { useQueryClient } from "@tanstack/react-query";
import { confirmDialog } from "../ConfirmDialog";
import deleteItem from "../../hooks/deleteItem";
import { useSnackbarStore } from "../../zustand/useSnackbarStore";
import AccessAlarmOutlinedIcon from "@mui/icons-material/AccessAlarmOutlined";
import getGlobalv2 from "../../hooks/getGlobalv2";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import useUserRoles from "../../zustand/UseRoles";
import HealthAndSafetyOutlinedIcon from "@mui/icons-material/HealthAndSafetyOutlined";
import addGlobal from "../../hooks/addGlobal";
import { incrementPatientApiClient, } from "../../services/WaitingroomService";
import { AxiosError } from "axios";
const PatientsTable = () => {
    const { showSnackbar } = useSnackbarStore();
    const { can } = useUserRoles();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const AddPatient = addGlobal({}, incrementPatientApiClient);
    const addWaitingRoom = async (id) => {
        await AddPatient.mutateAsync({ patient_id: id }, {
            onSuccess(data) {
                showSnackbar(data?.message, "success");
                queryClient.invalidateQueries(CACHE_KEY_WAITINGLIST);
            },
            onError(error) {
                const message = error instanceof AxiosError
                    ? error.response?.data?.message
                    : error.message;
                showSnackbar(message, "error");
            },
        });
    };
    const columns = [
        { name: "id", label: "Id", options: { display: false } },
        { name: "nom", label: "Nom", options: { filter: true, sort: true } },
        { name: "prenom", label: "Prenom", options: { filter: true, sort: true } },
        { name: "date", label: "Date", options: { filter: true, sort: true } },
        {
            name: "address",
            label: "Address",
            options: { filter: true, sort: true },
        },
        { name: "cin", label: "Cin", options: { filter: true, sort: true } },
        { name: "sex", label: "Sex", options: { filter: true, sort: true } },
        {
            name: "mutuelle",
            label: "Mutuelle",
            options: { filter: true, sort: true },
        },
        {
            name: "phoneNumber",
            label: "Telephone",
            options: { filter: true, sort: false },
        },
        {
            name: "PatientDetails",
            label: "Actions",
            options: {
                filter: true,
                sort: false,
                customBodyRender: (value, tableMeta) => {
                    const patientId = tableMeta.rowData[0]; // Assuming the first column is the ID
                    return (_jsxs(Box, { className: "w-max", children: [_jsx(Tooltip, { title: "Ajouter le patient \u00E0 la salle d'attente", children: _jsx(IconButton, { className: "btn-patient-waiting !text-gray-600 hover:!text-blue-700 cursor-pointer", children: _jsx(AccessAlarmOutlinedIcon, { color: "inherit" }) }) }), can(["doctor"]) && (_jsx(Tooltip, { title: "Nouveau operation", children: _jsx(IconButton, { className: "btn-patient-info !text-gray-600 hover:!text-blue-700 cursor-pointer", children: _jsx(HealthAndSafetyOutlinedIcon, {}) }) })), can(["update_patient", "doctor"]) && (_jsx(Tooltip, { title: "Modifier le patient", children: _jsx(IconButton, { className: "btn-patient-edit !text-gray-600 hover:!text-blue-700 cursor-pointer", children: _jsx(EditOutlinedIcon, {}) }) })), can(["delete_patient", "doctor"]) && (_jsx(Tooltip, { title: "Supprimer le patient", children: _jsx(IconButton, { className: "btn-patient-delete  !text-gray-600 hover:!text-red-700 cursor-pointer", children: _jsx(DeleteOutlineIcon, {}) }) }))] }));
                },
            },
        },
    ];
    const handleDeletePatient = async (id) => {
        confirmDialog("Voulez-vous vraiment supprimer le patient ?", async () => {
            try {
                const deletionSuccessful = await deleteItem(id, patientAPIClient);
                if (deletionSuccessful) {
                    queryClient.invalidateQueries(CACHE_KEY_PATIENTS);
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
    // Hook to fetch patients data
    const dataHook = (page, searchQuery, rowsPerPage) => getGlobalv2({}, // _Tname (Type placeholder)
    CACHE_KEY_PATIENTS, // Query key
    patientAPIClient, // Service function
    page, // Current page
    rowsPerPage, // Number of rows per page
    searchQuery, undefined);
    return (_jsx(_Fragment, { children: can([
            "access_patient",
            "doctor",
            "insert_patient",
            "update_patient",
            "delete_patient",
            "detail_patient",
        ]) ? (_jsx(DataTable, { title: "Liste des patients", noMatchMessage: "D\u00E9sol\u00E9, aucun patient n'est dans nos donn\u00E9es.", columns: columns, dataHook: dataHook, options: {
                searchPlaceholder: "Rechercher un patient",
                customToolbar: () => {
                    return can(["insert_patient", "doctor"]) ? (_jsx(Tooltip, { title: "Nouveau patient", children: _jsx(IconButton, { onClick: () => navigate("/AddPatient"), children: _jsx(AddIcon, {}) }) })) : null;
                },
                selectableRowsHideCheckboxes: true,
                onRowClick: (s, _m, e) => {
                    const patientId = s[0];
                    // Check if the click was on the "Patient Info" button
                    if (e.target.closest(".btn-patient-info")) {
                        navigate(`/Patients/operations/?id=${s[0]}`);
                        return;
                    }
                    // Check if the click was on the "Edit" button
                    if (e.target.closest(".btn-patient-edit")) {
                        navigate(`/AddPatient/${patientId}`);
                        return;
                    }
                    // Check if the click was on the "Delete" button
                    if (e.target.closest(".btn-patient-delete")) {
                        handleDeletePatient(patientId);
                        return;
                    }
                    if (e.target.closest(".btn-patient-waiting")) {
                        addWaitingRoom(patientId);
                        return;
                    }
                    const formatedDate = s[3].split("-");
                    /* navigate(`Xray?id=${s[0]}`); */
                    navigate(`/Patients/Details/${s[0]}`);
                },
            } })) : (_jsx("div", { style: { textAlign: "center", color: "red", marginTop: "20px" }, children: "Vous n'avez pas la permission de consulter cette page." })) }));
};
export default PatientsTable;
