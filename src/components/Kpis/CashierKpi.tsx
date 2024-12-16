import { Box } from "@mui/material";

import { CACHE_KEY_Cachier, CACHE_KEY_CachierNumber } from "../../constants";
import getGlobal from "../../hooks/getGlobal";
import {
  CashierNumber,
  CashierNumberKpiClient,
  TotalcachierAmount,
} from "../../services/KpisService";
import LoadingSpinner from "../LoadingSpinner";
import LinechartKPI from "./LinechartKPI";
import PointOfSaleIcon from "@mui/icons-material/PointOfSale";

const CashierKpi = () => {
  const { data: data1, isLoading: isLoading1 } = getGlobal(
    {} as any,
    CACHE_KEY_Cachier,
    TotalcachierAmount,
    undefined
  );
  const { data: data2, isLoading: isLoading2 } = getGlobal(
    {} as CashierNumber,
    CACHE_KEY_CachierNumber,
    CashierNumberKpiClient,
    undefined
  );
  if (isLoading1 || isLoading2) return <LoadingSpinner />;

  const labels = data1 ? Object.keys(data1) : [];
  const dataset1 = {
    labels,
    datasets: [
      {
        label: "Recettes en espèces",
        data: data1 ? Object.values(data1) : [],
        borderColor: "rgb(59 130 246)",
        background: "rgb(59 130 246)",
      },
    ],
  };

  return (
    <Box className="flex flex-col !w-full h-full py-2 gap-6">
      <Box className="!w-full flex flex-row justify-between items-center pt-4 px-6">
        <Box className="flex flex-col gap-1 mr-auto my-auto">
          <p className="text-xl font-semibold mr-auto">Caisse</p>
          <p className="text-3xl font-semibold"> {data2} MAD</p>
        </Box>
        <Box className="aspect-square shadow-md w-14 flex items-center justify-center rounded-full bg-blue-500">
          <PointOfSaleIcon
            sx={{
              fontSize: "2rem",
              color: "white",
            }}
          />
        </Box>
      </Box>

      <LinechartKPI dataset={dataset1} />
    </Box>
  );
};

export default CashierKpi;
