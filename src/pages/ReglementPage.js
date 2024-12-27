import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import ReglementTable from "../components/Tables/ReglementTable";
import { Outlet, useLocation } from "react-router";
const ReglementPage = () => {
    const location = useLocation();
    const isDetailsRoute = location.pathname.startsWith("/Reglement/Details");
    return _jsx(_Fragment, { children: isDetailsRoute ? _jsx(Outlet, {}) : _jsx(ReglementTable, {}) });
};
export default ReglementPage;
