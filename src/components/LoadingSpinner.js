import { jsx as _jsx } from "react/jsx-runtime";
import { Box, CircularProgress } from "@mui/material";
const LoadingSpinner = ({ size = "4rem" }) => {
    return (_jsx(Box, { className: "flex justify-center items-center ", children: _jsx(CircularProgress, { size: size }) }));
};
export default LoadingSpinner;
