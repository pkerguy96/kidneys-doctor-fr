import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { useLocation } from "react-router";
import BloodtestTable from "../components/Tables/BloodtestTable";
import BloodTestAdd from "./AddForms/BloodTestAdd";
const BloodTestPage = () => {
    const location = useLocation();
    const isAddBloodTestRoute = location.pathname.startsWith("/bloodtest/add");
    return _jsx(_Fragment, { children: isAddBloodTestRoute ? _jsx(BloodTestAdd, {}) : _jsx(BloodtestTable, {}) });
};
export default BloodTestPage;
