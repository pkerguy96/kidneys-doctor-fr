import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo } from "react";
import { Doughnut } from "react-chartjs-2";
import { CACHE_KEY_CreanceDashboardKpi } from "../../constants";
import { getCreanceApiClient } from "../../services/KpisService";
import LoadingSpinner from "../LoadingSpinner";
import getGlobal from "../../hooks/getGlobal";
import React from "react";
const PaymentRateKpi = () => {
    const { data: apiData, isLoading } = getGlobal({}, CACHE_KEY_CreanceDashboardKpi, getCreanceApiClient, { staleTime: 360000 });
    // Memoize calculations
    const { payment, creance, paymentPercent } = useMemo(() => {
        if (!apiData) {
            return { payment: 0, creance: 0, paymentPercent: 0 };
        }
        const payment = parseFloat(apiData.Paiement || 0);
        const creance = parseFloat(apiData.Crédit || 0);
        const total = payment + creance;
        const paymentPercent = total > 0 ? (payment / total) * 100 : 0;
        return { payment, creance, paymentPercent };
    }, [apiData]);
    // Memoize chart data
    const chartData = useMemo(() => {
        return {
            labels: ["Payment", "Creance"],
            datasets: [
                {
                    label: "Amount",
                    data: [payment, creance],
                    backgroundColor: ["#528f8a", "#015093"],
                    borderColor: ["#528f8a", "#015093"],
                    borderWidth: 1,
                },
            ],
        };
    }, [payment, creance]);
    if (isLoading)
        return _jsx(LoadingSpinner, {});
    return (_jsxs("div", { children: [_jsxs("div", { className: "flex flex-wrap gap-2", children: [_jsx("h1", { className: "text-xl font-semibold w-max", children: "Taux de paiement total" }), _jsxs("p", { className: "text-xl font-semibold text-blue-600 w-max", children: [paymentPercent.toFixed(2), "%"] })] }), _jsx(Doughnut, { data: chartData, options: { layout: { padding: { bottom: 2 } } } })] }));
};
export default React.memo(PaymentRateKpi);
