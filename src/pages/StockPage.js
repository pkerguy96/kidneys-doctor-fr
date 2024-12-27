import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Outlet, useLocation } from "react-router";
import StockTable from "../components/Tables/StockTable";
const StockPage = () => {
    const location = useLocation();
    const outletRoutes = [
        "/Stock/ajouter",
        "/Stock/product",
        "/Stock/entry",
        "/Stock/exit",
    ];
    /*   const isAddRoute = location.pathname === "/Stock/ajouter";
    const isProductAddStock = location.pathname === "/Stock/product";
    const isProductEntry = location.pathname === "/Stock/product";
    const isProductExit = location.pathname === "/Stock/product"; */
    return (_jsx(_Fragment, { children: outletRoutes.includes(location.pathname) ? _jsx(Outlet, {}) : _jsx(StockTable, {}) }));
};
export default StockPage;
