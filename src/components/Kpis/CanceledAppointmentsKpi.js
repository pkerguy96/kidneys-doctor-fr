import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box } from "@mui/material";
import { CACHE_KEY_CanceledApppointments } from "../../constants";
import getGlobal from "../../hooks/getGlobal";
import { CanceledAppointmentsKpiClient, } from "../../services/KpisService";
import LoadingSpinner from "../LoadingSpinner";
import LinechartKPI from "./LinechartKPI";
import EventBusyIcon from "@mui/icons-material/EventBusy";
import { useMemo } from "react";
const CanceledAppointmentsKpi = ({ dataset }) => {
    const { data, isLoading } = getGlobal({}, CACHE_KEY_CanceledApppointments, CanceledAppointmentsKpiClient, undefined);
    const labels = useMemo(() => (dataset ? Object.keys(dataset) : []), [dataset]);
    const dataset1 = useMemo(() => ({
        labels,
        datasets: [
            {
                label: "Rendez-vous annulés",
                data: dataset ? Object.values(dataset) : [],
                borderColor: "rgb(239 68 68)",
                backgroundColor: "rgb(239 68 68)",
            },
        ],
    }), [labels, dataset]);
    if (isLoading)
        return _jsx(LoadingSpinner, {});
    return (_jsxs(Box, { className: "flex flex-col !w-full h-full py-2 gap-6", children: [_jsxs(Box, { className: "!w-full flex flex-row justify-between items-center pt-4 px-6", children: [_jsxs(Box, { className: "flex flex-col gap-1 mr-auto my-auto", children: [_jsx("p", { className: "text-xl font-semibold mr-auto", children: "Rendez-vous annul\u00E9s" }), _jsx("p", { className: "text-3xl font-semibold", children: data })] }), _jsx(Box, { className: "aspect-square shadow-md w-14 flex items-center justify-center rounded-full bg-red-500", children: _jsx(EventBusyIcon, { sx: {
                                fontSize: "2rem",
                                color: "white",
                            } }) })] }), _jsx(LinechartKPI, { dataset: dataset1 })] }));
};
export default CanceledAppointmentsKpi;
