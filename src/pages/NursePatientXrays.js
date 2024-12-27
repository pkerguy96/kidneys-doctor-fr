import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Paper, Box, Divider, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import getGlobalById from "../hooks/getGlobalById";
import { NurseXrayvalidationApiClient, } from "../services/XrayService";
import { CACHE_KEY_NurseXray } from "../constants";
import LoadingSpinner from "../components/LoadingSpinner";
const NursePatientXrays = () => {
    const [searchParams] = useSearchParams(); // Access query parameters
    const targetId = searchParams.get("target_id");
    const { data, isLoading } = getGlobalById({}, [CACHE_KEY_NurseXray[0], targetId], NurseXrayvalidationApiClient, undefined, parseInt(targetId));
    if (isLoading)
        return _jsx(LoadingSpinner, {});
    return (_jsx(Paper, { className: "p-4", children: _jsxs(Box, { className: "w-full flex flex-col gap-2", children: [_jsx(Box, { className: "flex justify-center  text-lg  text-gray-400 uppercase", children: _jsx("span", { children: "Validation des radiographies demand\u00E9es" }) }), _jsx(Divider, { orientation: "horizontal", flexItem: true, className: "gap-2 mb-4", variant: "middle" }), _jsx(Box, { className: "w-full", children: _jsxs(Box, { className: "flex flex-col gap-6 p-6", children: [_jsxs("h3", { className: " flex justify-between text-2xl font-semibold leading-none tracking-tight text-blue-500 gap-2 items-center", children: ["Radiographie demand\u00E9e :", _jsx("span", { className: "text-gray-500 ", children: data[0].patient_name })] }), _jsx(TableContainer, { children: _jsxs(Table, { "aria-label": "simple table", children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { sx: {
                                                            fontWeight: 600,
                                                        }, children: "Type de radiographie" }), _jsx(TableCell, { sx: {
                                                            fontWeight: 600,
                                                        }, children: "Type de vue" }), _jsx(TableCell, { sx: {
                                                            fontWeight: 600,
                                                        }, children: "C\u00F4t\u00E9 du corps" })] }) }), _jsx(TableBody, { children: data.map((field, index) => (_jsxs(TableRow, { sx: { "&:last-child td, &:last-child th": { border: 0 } }, children: [_jsx(TableCell, { component: "th", scope: "row", children: field.xray_type }), _jsx(TableCell, { component: "th", scope: "row", children: field.view_type }), _jsx(TableCell, { component: "th", scope: "row", children: field.body_side }), _jsx(TableCell, { align: "right" })] }, index))) })] }) })] }) })] }) }));
};
export default NursePatientXrays;
