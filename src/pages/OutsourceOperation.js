import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet, useLocation } from "react-router";
import ClinicOperationsTable from "../components/Tables/ClinicOperationsTable";
const OutsourceOperation = () => {
    const location = useLocation();
    const isDetailsRoute = location.pathname.startsWith("/External/ajouter");
    return (_jsxs(_Fragment, { children: [isDetailsRoute ? null : _jsx(ClinicOperationsTable, {}), " ", _jsx(Outlet, {})] }));
};
export default OutsourceOperation;
