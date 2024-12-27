import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import MUIDataTable from "mui-datatables-mara";
import { Tooltip, IconButton, Box } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useNavigate } from "react-router";
import getGlobal from "../hooks/getGlobal";
import { CACHE_KEY_UploadInfo } from "../constants";
import { DeleteUploadServiceClient, } from "../services/UploadsService";
import LoadingSpinner from "./LoadingSpinner";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import DownloadForOfflineOutlinedIcon from "@mui/icons-material/DownloadForOfflineOutlined";
import ShowUploadsServiceApiClient from "../services/UploadsService";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import deleteItem from "../hooks/deleteItem";
import { confirmDialog } from "./ConfirmDialog";
import { useSnackbarStore } from "../zustand/useSnackbarStore";
import { useQueryClient } from "@tanstack/react-query";
import useUserRoles from "../zustand/UseRoles";
import { APIClient } from "../services/Http";
const Uploadstable = () => {
    const queryClient = useQueryClient();
    const { showSnackbar } = useSnackbarStore();
    const { can } = useUserRoles();
    const navigate = useNavigate();
    const { data, isLoading } = getGlobal({}, [CACHE_KEY_UploadInfo[0]], ShowUploadsServiceApiClient, undefined);
    if (isLoading)
        return _jsx(LoadingSpinner, {});
    const download = async (clusterName) => {
        const apiClient = new APIClient("/downloadZip");
        try {
            await apiClient.downloadFile(clusterName);
        }
        catch (error) {
            console.error("Error downloading ZIP:", error);
        }
    };
    const transformedData = Object.entries(data).map(([cluster, clusterData]) => ({
        id: cluster,
        nom: clusterData.patientName[0].nom,
        type: clusterData.type,
        date: clusterData.dates[0],
        size: `${clusterData.totalSize.toFixed(2)} Mb`,
        action: {
            mime: clusterData.mimeType[0],
            urls: clusterData.links,
            clusterName: cluster,
        },
    }));
    const columns = [
        {
            name: "id",
            label: "#",
            options: {
                filter: false,
                sort: false,
                display: "excluded",
            },
        },
        {
            name: "nom",
            label: "Nom du patient",
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: "type",
            label: "Type",
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
            name: "size",
            label: "Taille des fichiers",
            options: {
                filter: true,
                sort: true,
            },
        },
        {
            name: "action",
            label: "Action",
            options: {
                filter: true,
                sort: true,
                customBodyRender: (data) => {
                    return (_jsxs(_Fragment, { children: [can(["detail_document", "doctor"]) &&
                                data.mime === "application/dicom" ? (_jsx("button", { className: "btn-ordonance-see text-gray-950 hover:text-blue-700 cursor-pointer", title: "Voir", children: _jsx(VisibilityOutlinedIcon, { className: "pointer-events-none", fill: "currentColor" }) })) : null, can(["download_document", "doctor"]) ? (_jsx("button", { onClick: () => download(data.clusterName), className: "btn-ordonance-download text-gray-950 hover:text-blue-700 cursor-pointer", title: "T\u00E9l\u00E9charger", children: _jsx(DownloadForOfflineOutlinedIcon, { className: "pointer-events-none", fill: "currentColor" }) })) : null, can(["delete_document", "doctor"]) ? (_jsx("button", { className: "btn-ordonance-delete text-gray-950 hover:text-blue-700 cursor-pointer", title: "Supprimer", children: _jsx(DeleteOutlineIcon, { color: "error", className: "pointer-events-none", fill: "currentColor" }) })) : null] }));
                },
            },
        },
    ];
    const options = {
        filterType: "dropdown",
        selectableRowsHideCheckboxes: true,
        searchPlaceholder: "Rechercher un fichier",
        textLabels: {
            body: {
                noMatch: "Désolé, aucun fichier n'est dans nos données",
            },
        },
        customToolbar: () => {
            return can(["insert_document", "doctor"]) ? (_jsx(Tooltip, { title: "Nouveau fichier", children: _jsx(IconButton, { onClick: () => {
                        navigate(`/Addfile`);
                    }, children: _jsx(AddIcon, {}) }) })) : null;
        },
        onRowClick: async (s, _m, e) => {
            if (e.target.querySelector(".btn-ordonance-see") ||
                e.target.classList.contains("btn-ordonance-see")) {
                if (s[1] === "application/dicom") {
                }
                navigate(`/Dicom/${s[0]}`);
            }
            else if (e.target.querySelector(".btn-ordonance-delete") ||
                e.target.classList.contains("btn-ordonance-delete")) {
                confirmDialog("Voulez-vous vraiment supprimer ce fichier?", async () => {
                    const response = await deleteItem(s[0], DeleteUploadServiceClient);
                    if (response) {
                        queryClient.invalidateQueries(CACHE_KEY_UploadInfo);
                        showSnackbar("le fichier a été supprimé avec succès", "success");
                    }
                    else {
                        showSnackbar("La suppression du fichier a échoué", "error");
                    }
                });
            }
            else if (e.target.querySelector(".btn-ordonance-download") ||
                e.target.classList.contains("btn-ordonance-download")) {
                try {
                }
                catch (error) {
                    console.log(error);
                }
            }
        },
    };
    return (_jsx(_Fragment, { children: can([
            "access_document",
            "doctor",
            "insert_document",
            "delete_document",
            "download_document",
            "detail_document",
        ]) ? ( // Check if the user has access_document or doctor role
        _jsx(Box, { className: "relative", children: _jsx(MUIDataTable, { title: "Gestion de fichiers", data: transformedData, columns: columns, options: options }) })) : (
        // Display a denial message if the user lacks permissions
        _jsx("div", { style: { textAlign: "center", color: "red", marginTop: "20px" }, children: "Vous n'avez pas la permission de consulter cette page." })) }));
};
export default Uploadstable;
