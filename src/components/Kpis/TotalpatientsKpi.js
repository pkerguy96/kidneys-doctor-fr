import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import getGlobal from "../../hooks/getGlobal";
import { TotalPatientKpiClient, } from "../../services/KpisService";
import { CACHE_KEY_totalPatients } from "../../constants";
import LoadingSpinner from "../LoadingSpinner";
const TotalpatientsKpi = ({ setLoading }) => {
    const { data, isLoading } = getGlobal({}, CACHE_KEY_totalPatients, TotalPatientKpiClient, undefined);
    // useEffect(() => {
    //   console.log("====================================");
    //   console.log(100, isLoading);
    //   console.log("====================================");
    //   setLoading(isLoading);
    // }, [isLoading]);
    if (isLoading)
        return _jsx(LoadingSpinner, {});
    return (_jsxs("div", { className: "flex flex-wrap  gap-2", children: [_jsx("h1", { className: "text-xl font-semibold w-max", children: "Total patients" }), _jsx("p", { className: "text-xl font-semibold text-blue-600 w-max", children: data })] }));
};
export default TotalpatientsKpi;
