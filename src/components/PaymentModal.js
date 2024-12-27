import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Modal, Box, Button, TextField, Paper, IconButton, Table, TableBody, TableCell, TableHead, TableRow, } from "@mui/material";
import LoadingSpinner from "./LoadingSpinner";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { CACHE_KEY_Hospitaloperations, CACHE_KEY_Operation, CACHE_KEY_OperationDetail, } from "../constants";
import getGlobalById from "../hooks/getGlobalById";
import operationDetailsApiClient, { deleteoperationdetailsApiclient, } from "../services/OperationDetailsService";
import updateItem from "../hooks/updateItem";
import operationApiClient from "../services/OperationService";
import deleteItem from "../hooks/deleteItem";
import { useSnackbarStore } from "../zustand/useSnackbarStore";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
const PaymentModal = ({ open, onClose, operationID }) => {
    const { handleSubmit, control, setValue } = useForm();
    const [fetchedoperations, setFetchedOperations] = useState([]);
    const [totalCost, setTotalCost] = useState(0);
    const [isOutsource, setIsOutsource] = useState(false);
    const addMutation = updateItem({}, operationApiClient);
    const { showSnackbar } = useSnackbarStore();
    const queryClient = useQueryClient();
    if (!operationID)
        return null;
    const { data, isLoading, refetch } = getGlobalById({}, [CACHE_KEY_OperationDetail, operationID.toString()], operationDetailsApiClient, undefined, operationID);
    useEffect(() => {
        if (data) {
            setFetchedOperations(data.payments);
            // Check if this is an outsourced operation
            setIsOutsource(data.outsource === 1);
            if (data.outsource === 1) {
                // Use fee for external operations
                const externalFee = data.externalOperation.reduce((total, external) => total + Number(external.fee), 0);
                setTotalCost(externalFee);
            }
            else {
                // Calculate total cost for regular operations
                const operationDetailsCost = data.operation_details.reduce((total, detail) => total + Number(detail.price), 0);
                const xraysCost = data.xrays.reduce((total, xray) => total + Number(xray.price), 0);
                setTotalCost(operationDetailsCost + xraysCost);
            }
        }
    }, [data]);
    //TODO: remove only operation with the specify id
    if (isLoading)
        return _jsx(LoadingSpinner, {});
    const onSubmit = async (data) => {
        if (data) {
            if (totalpaid + Number(data.amount_paid) > totalCost) {
                showSnackbar("Le paiement total dépasse le coût total.");
                return;
            }
            await addMutation
                .mutateAsync(
            //@ts-ignore
            { data, id: operationID }, {
                onSuccess(data) {
                    queryClient.invalidateQueries([
                        CACHE_KEY_OperationDetail,
                        operationID.toString(),
                    ]);
                    queryClient.invalidateQueries(CACHE_KEY_Operation, {
                        exact: false,
                    });
                    queryClient.invalidateQueries(CACHE_KEY_Hospitaloperations, {
                        exact: false,
                    });
                    setFetchedOperations((prevData) => [
                        ...prevData,
                        {
                            amount_paid: data.amount_paid,
                            date: data.date,
                            id: data.id,
                        },
                    ]);
                    //@ts-ignore
                    setValue("amount_paid", "");
                },
                onError(error) {
                    console.log(error);
                },
            })
                .catch((error) => {
                console.error("onError", error);
            });
        }
    };
    const totalpaid = fetchedoperations.reduce((total, payment) => total + parseFloat(payment.amount_paid || "0"), 0);
    const outstandingAmount = totalCost - totalpaid;
    const deletePayment = async (id) => {
        try {
            const deletionSuccessful = await deleteItem(id, deleteoperationdetailsApiclient);
            if (deletionSuccessful) {
                refetch();
                /* queryClient.invalidateQueries([CACHE_KEY_OperationDetail, id]); */
                showSnackbar("La suppression du paiement a réussi", "success");
            }
            else {
                showSnackbar("La suppression du paiement a échoué", "error");
            }
        }
        catch (error) {
            showSnackbar(`Une erreur s'est produite lors de la suppression du paiement :${error}`, "error");
            console.log(error);
        }
    };
    return (_jsx(Modal, { open: open, onClose: onClose, "aria-labelledby": "modal-modal-title", "aria-describedby": "modal-modal-description", className: "flex justify-center items-center p-4", children: _jsx(Paper, { elevation: 5, sx: { width: 600 }, children: _jsx(Box, { sx: { bgcolor: "background.paper" }, className: "rounded-lg w-full", children: _jsx(Box, { component: "form", onSubmit: handleSubmit(onSubmit), className: "!rounded-lg border bg-card text-card-foreground shadow-sm mx-auto", children: _jsxs(Box, { className: "flex flex-col gap-6 p-6", children: [_jsx("h3", { className: "text-2xl font-semibold leading-none tracking-tight", children: "D\u00E9tails du paiement des patients" }), _jsx(Box, { className: "flex flex-col gap-2", children: _jsxs(Table, { "aria-label": "simple table", className: "!border-t-0", children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { className: "!px-2 !py-1 !font-semibold !text-base !border-0", children: "Op\u00E9ration" }), _jsx(TableCell, { className: "!px-2 !py-1 !font-semibold !text-base !border-0", align: "right", children: "Prix" })] }) }), _jsxs(TableBody, { children: [data?.operation_details?.map((row, index) => (_jsxs(TableRow, { children: [_jsx(TableCell, { className: "!px-2 !py-1 !border-0", children: row.operation_type || "No Operation Name" }), _jsxs(TableCell, { className: "!px-2 !py-1 !border-0", align: "right", children: [row.price, " MAD"] })] }, index))), data?.xrays?.map((row, index) => (_jsxs(TableRow, { children: [_jsx(TableCell, { className: "!px-2 !py-1 !border-0", children: row.xray_type.join(", ") || "No X-Ray Type" }), _jsxs(TableCell, { className: "!px-2 !py-1 !border-0", align: "right", children: [row.price, " MAD"] })] }, index))), data?.externalOperation?.map((row, index) => (_jsxs(TableRow, { children: [_jsx(TableCell, { className: "!px-2 !py-1 !border-0", children: row.operation_type || "No X-Ray Type" }), _jsxs(TableCell, { className: "!px-2 !py-1 !border-0", align: "right", children: [row.fee, " MAD"] })] }, index)))] })] }) }), _jsx(Box, { className: "flex flex-col gap-2", children: _jsxs(Table, { "aria-label": "simple table", className: "!border-t-0", children: [_jsx(TableHead, { children: _jsxs(TableRow, { children: [_jsx(TableCell, { className: "!px-2 !py-1 !font-semibold !text-base !border-0", children: "Paiements" }), _jsx(TableCell, { className: "!px-2 !py-1 !font-semibold !text-base !border-0", children: "Prix" }), _jsx(TableCell, { className: "!px-2 !py-1 !font-semibold !text-base !border-0", children: "Date" }), _jsx(TableCell, { className: "!px-2 !py-1 !font-semibold !text-base !border-0", width: 60, align: "center", children: "Action" })] }) }), _jsx(TableBody, { children: fetchedoperations?.length ? (fetchedoperations.map((row, index) => (_jsxs(TableRow, { children: [_jsxs(TableCell, { className: "!px-2 !py-1 !border-0", children: ["Paiment ", index + 1] }), _jsxs(TableCell, { className: "!px-2 !py-1 !border-0", children: [row.amount_paid === null
                                                                ? "0.00"
                                                                : row.amount_paid, " ", "MAD"] }), _jsx(TableCell, { className: "!px-2 !py-1 !border-0", children: row.date }), _jsx(TableCell, { className: "!px-2 !py-1 !border-0", align: "center", children: _jsx(IconButton, { onClick: () => deletePayment(row.id), children: _jsx(DeleteOutlineIcon, { color: "error", className: "pointer-events-none", fill: "currentColor" }) }) })] }, index)))) : (_jsx(TableRow, { className: "border-t border-gray-300", children: _jsx(TableCell, { colSpan: 4, align: "center", className: "!text-gray-600 p-4", children: _jsx("p", { className: "text-lg", children: "D\u00E9sol\u00E9, aucun paiement pour le moment." }) }) })) })] }) }), outstandingAmount ? (_jsxs(Box, { className: "flex items-center flex-wrap gap-4", children: [_jsx(Controller
                                    //@ts-ignore
                                    , { 
                                        //@ts-ignore
                                        defaultValue: "", name: "amount_paid", control: control, rules: {
                                            required: "Le montant est requis",
                                            validate: (value) => value > 0 || "Le montant doit être un nombre positif",
                                        }, render: ({ field, fieldState: { error } }) => (_jsx(TextField, { className: "flex-1", id: "amount_paid", label: "Montant", variant: "outlined", type: "number", size: "small", placeholder: "Enter Montant", error: !!error, helperText: error ? error.message : "", ...field })) }), _jsx(Button, { variant: "outlined", type: "submit", children: addMutation.isLoading ? "..." : "Ajouter" })] })) : (""), _jsxs(Box, { className: "flex justify-between items-center", children: [_jsx("h2", { className: "font-semibold text-base text-start", children: "Montant restant" }), _jsx("span", { className: "font-semibold text-sm text-end", children: `${outstandingAmount.toFixed(2)} MAD ` })] })] }) }) }) }) }));
};
export default PaymentModal;
