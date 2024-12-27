import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Outlet } from "react-router";
import Dashboard from "../Dashboard";
const PrivateRoute = () => {
    return (_jsx(_Fragment, { children: _jsx(Dashboard, { children: _jsx(Outlet, {}) }) }));
};
export default PrivateRoute;
