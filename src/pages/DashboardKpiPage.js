import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box } from "@mui/material";
import RevenueKpi from "../components/Kpis/RevenueKpi";
import TotalAppointmentsKpi from "../components/Kpis/TotalAppointmentsKpi";
import CanceledAppointmentsKpi from "../components/Kpis/CanceledAppointmentsKpi";
import PatientAgeGroupKpi from "../components/Kpis/PatientAgeGroupKpi";
import AppointmentsTableKpi from "../components/Kpis/AppointmentsTableKpi";
import CashierKpi from "../components/Kpis/CashierKpi";
import { useNavigate } from "react-router";
import getGlobal from "../hooks/getGlobal";
import LoadingSpinner from "../components/LoadingSpinner";
import { CACHE_KEY_MonthlyAppointments, CACHE_KEY_CanceledMonthlyAppointments, } from "../constants";
import { MonthlyAppointmentsKpiClient, CanceledMonthlyAppointmentsKpiClient, } from "../services/KpisService";
import useUserRoles from "../zustand/UseRoles";
import PatientKpi from "../components/Kpis/patientKpi";
import PaymentRateKpi from "../components/Kpis/paymentRateKpi";
const DashboardKpiPage = () => {
    const navigate = useNavigate();
    const { can } = useUserRoles();
    const { data, isLoading } = getGlobal({}, CACHE_KEY_MonthlyAppointments, MonthlyAppointmentsKpiClient, { staleTime: 30000 });
    const { data: data1, isLoading: isLoading1 } = getGlobal({}, CACHE_KEY_CanceledMonthlyAppointments, CanceledMonthlyAppointmentsKpiClient, { staleTime: 300000 });
    if (isLoading || isLoading1)
        return _jsx(LoadingSpinner, {});
    Object;
    // const labels = data ? Object.keys(data) : [];
    // const dataset = {
    //   labels,
    //   datasets: [
    //     {
    //       label: "Rendez-vous",
    //       data: data ? Object.values(data1) : [],
    //       borderColor: "rgb(255, 99, 132)",
    //       backgroundColor: "rgba(255, 99, 132, 0.5)",
    //     },
    //   ],
    // };
    // const dataset1 = {
    //   labels,
    //   datasets: [
    //     {
    //       label: "Rendez-vous annulés",
    //       data: data ? Object.values(data1) : [],
    //       borderColor: "#db2777",
    //       backgroundColor: "rgba(255, 99, 132, 0.5)",
    //     },
    //   ],
    // };
    return (_jsxs(Box, { className: "flex flex-col gap-6", children: [_jsxs(Box, { className: "grid grid-rows-1 grid-cols-1 lg:grid-cols-12 gap-6", children: [_jsx(Box, { className: "!w-full shadow-md lg:col-span-4 bg-white text-gray-950", children: _jsx(CashierKpi, {}) }), _jsx(Box, { className: "!w-full shadow-md lg:col-span-4 bg-white text-gray-950 cursor-pointer", onClick: () => navigate("/Appointmens/table"), children: _jsx(TotalAppointmentsKpi, { dataset: data }) }), _jsx(Box, { className: "!w-full shadow-md lg:col-span-4 bg-white text-gray-950", children: _jsx(CanceledAppointmentsKpi, { dataset: data1 }) })] }), _jsxs(Box, { className: "grid grid-rows-1 grid-cols-1 lg:grid-cols-12 gap-6 items-start", children: [_jsxs(Box, { className: "flex flex-col gap-6 lg:col-span-8", children: [_jsxs(Box, { className: "w-full bg-white shadow-md text-gray-950 flex flex-col overflow-hidden", children: [_jsx("h1", { className: "text-xl font-semibold p-6", children: "Salle d'attente" }), _jsx(AppointmentsTableKpi, {})] }), can(["doctor"]) && (_jsxs(Box, { className: "!w-full bg-white shadow-md text-gray-950 flex flex-col p-6 gap-3 overflow-hidden", children: [_jsx("h1", { className: "text-xl font-semibold", children: "Graphique des revenus" }), _jsx(RevenueKpi, {})] }))] }), _jsxs(Box, { className: "flex flex-col gap-6 lg:col-span-4", children: [_jsxs(Box, { className: "!w-full bg-white shadow-md lg:col-span-6 text-gray-950 flex flex-col p-6 gap-3 overflow-hidden", children: [_jsx("h1", { className: "text-xl font-semibold", children: "Groupe d\u2019\u00E2ge des patients" }), _jsx(PatientAgeGroupKpi, {})] }), _jsx(Box, { className: "w-full bg-white shadow-md lg:col-span-6 text-gray-950 flex flex-col p-6 gap-3 overflow-hidden", children: _jsx(PatientKpi, {}) }), _jsx(Box, { className: "w-full bg-white shadow-md lg:col-span-6 text-gray-950 flex flex-col p-6 gap-3 overflow-hidden", children: _jsx(PaymentRateKpi, {}) })] })] }), _jsx(Box, { className: "flex w-full " })] }));
};
export default DashboardKpiPage;
