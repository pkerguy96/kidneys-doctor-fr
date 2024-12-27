import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Outlet, useLocation } from "react-router";
import SupplierTable from "../components/Tables/SupplierTable";
const SupplierPage = () => {
    const location = useLocation();
    const isAddRoute = location.pathname === "/Supplier/ajouter";
    return _jsx(_Fragment, { children: isAddRoute ? _jsx(Outlet, {}) : _jsx(SupplierTable, {}) });
};
export default SupplierPage;
