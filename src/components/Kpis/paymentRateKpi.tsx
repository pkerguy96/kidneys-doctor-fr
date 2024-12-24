import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";

const PaymentRateKpi = () => {
  const [data, setData] = useState({
    labels: [],
    datasets: [],
  });
  const [percent, setPercent] = useState(0);
  useEffect(() => {
    const kpi = {
      payment: 30,
      creance: 70,
    };
    const chartData = {
      labels: Object.keys(kpi),
      datasets: [
        {
          label: "Nombre",
          data: Object.values(kpi),
          backgroundColor: ["#528f8a", "#015093"],
          borderColor: ["#528f8a", "#015093"],
          borderWidth: 1,
        },
      ],
    };

    // Only update state if data changes
    if (
      JSON.stringify(data.labels) !== JSON.stringify(chartData.labels) ||
      JSON.stringify(data.datasets) !== JSON.stringify(chartData.datasets)
    ) {
      setData(chartData);
      setPercent((kpi.payment / (kpi.payment + kpi.creance)) * 100);
    }
  }, [data]);

  return (
    <>
      <div className="flex flex-wrap  gap-2">
        <h1 className="text-xl font-semibold w-max">Total patients</h1>
        <p className="text-xl font-semibold text-blue-600 w-max">
          {percent.toFixed(2)}%
        </p>
      </div>
      <Doughnut data={data} options={{ layout: { padding: { bottom: 2 } } }} />
    </>
  );
};

export default PaymentRateKpi;
