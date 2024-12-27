import { jsx as _jsx } from "react/jsx-runtime";
import AppointmentsCalendar from "../components/AppointmentsCalendar";
import { Box } from "@mui/material";
const AppointmentPage = () => {
    return (_jsx(Box, { className: "w-full", children: _jsx(AppointmentsCalendar, {}) }));
};
export default AppointmentPage;
