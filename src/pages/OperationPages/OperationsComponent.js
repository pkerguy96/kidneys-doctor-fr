import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Typography, Button, TableContainer, Paper, Table, TableHead, TableRow, TableCell, TableBody, FormControl, TextField, IconButton, } from "@mui/material";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useEffect, useMemo, useRef, useState } from "react";
import getGlobalById from "../../hooks/getGlobalById";
import { PatientXrayApiClient } from "../../services/XrayService";
import { CACHE_KEY_OperationPref } from "../../constants";
import getGlobal from "../../hooks/getGlobal";
import { OperationPrefApiClient, } from "../../services/SettingsService";
import LoadingSpinner from "../../components/LoadingSpinner";
const OperationsComponent = ({ operation_id }) => {
    const [totalPrice, setTotalPrice] = useState(0);
    //gpt
    const [isInitialized, setIsInitialized] = useState(false);
    const { control, setValue, getValues } = useForm();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "rows",
    });
    const rows = useWatch({ control, name: "rows" });
    const { data: Operationprefs, isLoading: isloading2, } = getGlobal({}, CACHE_KEY_OperationPref, OperationPrefApiClient, {
        staleTime: Infinity,
        cacheTime: Infinity, // Data will remain in the cache indefinitely
    });
    const { data: xrayData, isLoading } = operation_id
        ? getGlobalById({}, ["CACHE_KEY_Xray", operation_id.toString()], PatientXrayApiClient, undefined, parseInt(operation_id))
        : { data: [], isLoading: false };
    const handleAddRow = () => {
        append({ xray_type: "", price: 0 });
    };
    useEffect(() => {
        const total = rows?.reduce((sum, row) => sum + Number(row.price || 0), 0);
        setTotalPrice(total);
    }, [rows]);
    const hasSetInitialRows = useRef(false);
    const combinedRows = useMemo(() => {
        return [
            ...(xrayData || []).map((item, index) => ({
                id: `data-${item.id || index}`,
                xray_type: item.xray_type || "",
                price: item.price || 0, // Default to 0
            })),
            ...(Operationprefs || []).map((pref, index) => ({
                id: `pref-${pref.id || index}`,
                xray_type: pref.operation_type || "",
                price: parseFloat(pref.price || "0"), // Default to 0
            })),
        ];
    }, [xrayData, Operationprefs]);
    useEffect(() => {
        if (!isInitialized && combinedRows.length > 0) {
            setValue("rows", combinedRows);
            setIsInitialized(true); // Mark as initialized
        }
    }, [combinedRows, setValue, isInitialized]);
    useEffect(() => {
        if (isInitialized && combinedRows.length > 0) {
            const currentRows = getValues("rows");
            const hasDifference = JSON.stringify(currentRows) !== JSON.stringify(combinedRows);
            if (hasDifference) {
                setValue("rows", combinedRows); // Update rows if there's a difference
            }
        }
    }, [combinedRows, setValue, getValues, isInitialized]);
    console.log("hello");
    /*  useEffect(() => {
      const combinedRows = [
        ...(xrayData || []).map((item, index) => ({
          id: `data-${item.id || index}`, // Ensure unique id
          xray_type: item.xray_type || "", // Default to empty string
          price: item.price || 0, // Default to 0
        })),
        ...(Operationprefs || []).map((pref, index) => ({
          id: `pref-${pref.id || index}`, // Ensure unique id
          xray_type: pref.operation_type || "", // Default to empty string
          price: parseFloat(pref.price || "0"), // Default to 0
        })),
      ];
  
      if (combinedRows.length > 0) {
        setValue("rows", combinedRows);
      }
  
      console.log("Combined Rows After Transformation:", combinedRows);
    }, []); */
    if (isLoading || isloading2)
        return _jsx(LoadingSpinner, {});
    return (_jsxs(Box, { className: "flex gap-4 flex-col", children: [_jsxs(Box, { className: "flex justify-between", children: [_jsx(Typography, { id: "modal-modal-title", variant: "h6", component: "h2", children: "Validation payment" }), _jsx(Button, { sx: { borderRadius: 16 }, variant: "outlined", onClick: handleAddRow, children: _jsx(AddIcon, {}) })] }), _jsx(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center", children: _jsx(TableContainer, { component: Paper, children: _jsxs(Table, { sx: { minWidth: 650 }, "aria-label": "simple table", children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { children: "Operation name" }), _jsx(TableCell, { width: "250px", align: "left", children: "Price" }), _jsx(TableCell, { align: "right", children: "Action" })] }) }), _jsx(TableBody, { children: fields.map((field, index) => (_jsxs(TableRow, { sx: { "&:last-child td, &:last-child th": { border: 0 } }, children: [_jsx(TableCell, { component: "th", scope: "row", children: _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: `rows.${index}.xray_type`, control: control, defaultValue: field.xray_type, render: ({ field }) => (_jsx(TextField, { ...field, id: `xray_type_${index}`, size: "small", type: "text" })) }) }) }), _jsx(TableCell, { align: "right", children: _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: `rows.${index}.price`, control: control, defaultValue: field.price, render: ({ field }) => (_jsx(TextField, { ...field, id: `price_${index}`, size: "small", type: "number" })) }) }) }), _jsx(TableCell, { align: "right", children: _jsx(IconButton, { color: "error", onClick: () => remove(index), children: _jsx(DeleteOutlineOutlinedIcon, {}) }) })] }, field.id))) })] }) }) }), _jsxs(Box, { className: "flex justify-between items-center", children: [_jsx("h2", { className: "font-semibold text-base text-start", children: "Montant Total" }), _jsxs("span", { className: "font-semibold text-sm text-end", children: [totalPrice, " MAD"] })] })] }));
};
export default OperationsComponent;
