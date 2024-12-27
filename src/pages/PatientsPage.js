import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Outlet, useLocation } from "react-router";
import PatientsTable from "../components/Tables/PatientsTable";
const PatientsPage = () => {
    const location = useLocation();
    const isOperateRoute = location.pathname.startsWith("/Patients/Xray");
    const isDetailsRoute = location.pathname.startsWith("/Patients/Details");
    const isComingSoonPage = location.pathname.startsWith("/Patients/operations");
    return (_jsx(_Fragment, { children: isOperateRoute || isDetailsRoute || isComingSoonPage ? (_jsx(Outlet, {})) : (_jsx(PatientsTable, {})) }));
};
export default PatientsPage;
