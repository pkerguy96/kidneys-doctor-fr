import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box } from "@mui/material";
import { CACHE_KEY_Cachier, CACHE_KEY_CachierNumber } from "../../constants";
import getGlobal from "../../hooks/getGlobal";
import { CashierNumberKpiClient, TotalcachierAmount, } from "../../services/KpisService";
import LoadingSpinner from "../LoadingSpinner";
import LinechartKPI from "./LinechartKPI";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";
import { useMemo } from "react";
const CashierKpi = () => {
    const { data: totalCachierData, isLoading: isLoadingCachier } = getGlobal({}, CACHE_KEY_Cachier, TotalcachierAmount, undefined);
    const { data: cashierNumberData, isLoading: isLoadingCashierNumber } = getGlobal({}, CACHE_KEY_CachierNumber, CashierNumberKpiClient, undefined);
    const labels = useMemo(() => totalCachierData && Object.keys(totalCachierData), [totalCachierData]);
    const dataset1 = useMemo(() => ({
        labels: labels || [],
        datasets: [
            {
                label: "Recettes en espèces",
                data: totalCachierData ? Object.values(totalCachierData) : [],
                borderColor: "rgb(59 130 246)",
                backgroundColor: "rgb(59 130 246)",
            },
        ],
    }), [labels, totalCachierData]);
    if (isLoadingCachier || isLoadingCashierNumber)
        return _jsx(LoadingSpinner, {});
    return (_jsxs(Box, { className: "flex flex-col !w-full h-full py-2 gap-6", children: [_jsxs(Box, { className: "!w-full flex flex-row justify-between items-center pt-4 px-6", children: [_jsxs(Box, { className: "flex flex-col gap-1 mr-auto my-auto", children: [_jsx("p", { className: "text-xl font-semibold mr-auto", children: "Caisse" }), _jsxs("p", { className: "text-3xl font-semibold", children: [cashierNumberData || 0, " MAD"] })] }), _jsx(Box, { className: "aspect-square shadow-md w-14 flex items-center justify-center rounded-full bg-blue-500", children: _jsx(PointOfSaleIcon, { sx: {
                                fontSize: "2rem",
                                color: "white",
                            } }) })] }), _jsx(LinechartKPI, { dataset: dataset1 })] }));
};
export default CashierKpi;
