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
import {
  CACHE_KEY_MonthlyAppointments,
  CACHE_KEY_CanceledMonthlyAppointments,
} from "../constants";
import {
  NewAppointments,
  MonthlyAppointmentsKpiClient,
  CanceledAppointments,
  CanceledMonthlyAppointmentsKpiClient,
} from "../services/KpisService";
import useUserRoles from "../zustand/UseRoles";
import PatientKpi from "../components/Kpis/patientKpi";
import PaymentRateKpi from "../components/Kpis/paymentRateKpi";

const DashboardKpiPage = () => {
  const navigate = useNavigate();
  const { can } = useUserRoles();

  const { data, isLoading } = getGlobal(
    {} as NewAppointments,
    CACHE_KEY_MonthlyAppointments,
    MonthlyAppointmentsKpiClient,
    { staleTime: 30000 }
  );
  const { data: data1, isLoading: isLoading1 } = getGlobal(
    {} as CanceledAppointments,
    CACHE_KEY_CanceledMonthlyAppointments,
    CanceledMonthlyAppointmentsKpiClient,
    { staleTime: 300000 }
  );
  if (isLoading || isLoading1) return <LoadingSpinner />;
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

  return (
    <Box className="flex flex-col gap-6">
      <Box className="grid grid-rows-1 grid-cols-1 lg:grid-cols-12 gap-6">
        <Box className="!w-full shadow-md lg:col-span-4 bg-white text-gray-950">
          <CashierKpi />
        </Box>
        <Box
          className="!w-full shadow-md lg:col-span-4 bg-white text-gray-950 cursor-pointer"
          onClick={() => navigate("/Appointmens/table")}
        >
          <TotalAppointmentsKpi dataset={data} />
        </Box>
        <Box className="!w-full shadow-md lg:col-span-4 bg-white text-gray-950">
          <CanceledAppointmentsKpi dataset={data1} />
        </Box>
      </Box>
      <Box className="grid grid-rows-1 grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <Box className="flex flex-col gap-6 lg:col-span-8">
          <Box className="w-full bg-white shadow-md text-gray-950 flex flex-col overflow-hidden">
            <h1 className="text-xl font-semibold p-6">Salle d'attente</h1>
            <AppointmentsTableKpi />
          </Box>
          {can(["doctor"]) && (
            <Box className="!w-full bg-white shadow-md text-gray-950 flex flex-col p-6 gap-3 overflow-hidden">
              <h1 className="text-xl font-semibold">Graphique des revenus</h1>
              <RevenueKpi />
            </Box>
          )}
        </Box>
        <Box className="flex flex-col gap-6 lg:col-span-4">
          {/*  <Box className="!w-full bg-white shadow-md lg:col-span-6 text-gray-950 flex flex-col p-6 gap-3 overflow-hidden">
            <h1 className="text-xl font-semibold">Hna ajouti hadik alhrgawi</h1>
          </Box> */}
          <Box className="!w-full bg-white shadow-md lg:col-span-6 text-gray-950 flex flex-col p-6 gap-3 overflow-hidden">
            <h1 className="text-xl font-semibold">Groupe d’âge des patients</h1>
            <PatientAgeGroupKpi />
          </Box>
          <Box className="w-full bg-white shadow-md lg:col-span-6 text-gray-950 flex flex-col p-6 gap-3 overflow-hidden">
            <PatientKpi />
          </Box>
          <Box className="w-full bg-white shadow-md lg:col-span-6 text-gray-950 flex flex-col p-6 gap-3 overflow-hidden">
            <PaymentRateKpi />
          </Box>
        </Box>
      </Box>

      <Box className="flex w-full "></Box>
    </Box>
  );
};

export default DashboardKpiPage;
