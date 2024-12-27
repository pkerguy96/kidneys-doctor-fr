import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Box, Button, Divider, IconButton, Paper, TextField, } from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { CACHE_KEY_Operation, CACHE_KEY_OperationDetail } from "../constants";
import getGlobalById from "../hooks/getGlobalById";
import updateItem from "../hooks/updateItem";
import operationDetailsApiClient, { deleteoperationdetailsApiclient, } from "../services/OperationDetailsService";
import operationApiClient from "../services/OperationService";
import { useSnackbarStore } from "../zustand/useSnackbarStore";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import LoadingSpinner from "../components/LoadingSpinner";
import deleteItem from "../hooks/deleteItem";
import { useSearchParams } from "react-router-dom";
const NursePaymentpage = () => {
    const { handleSubmit, control, setValue } = useForm();
    const [fetchedoperations, setFetchedOperations] = useState([]);
    const [totalCost, setTotalCost] = useState(0);
    const addMutation = updateItem({}, operationApiClient);
    const { showSnackbar } = useSnackbarStore();
    const queryClient = useQueryClient();
    // Extract query parameter target_id
    const [searchParams] = useSearchParams();
    const target_id = searchParams.get("target_id"); // Get target_id from query string
    if (!target_id)
        return _jsx("div", { children: "No operation selected" });
    const operationID = target_id;
    const { data, isLoading, refetch } = getGlobalById({}, [CACHE_KEY_OperationDetail, target_id.toString()], operationDetailsApiClient, undefined, parseInt(target_id));
    useEffect(() => {
        if (data && data.payments) {
            setFetchedOperations(data.payments);
            const operationDetailsCost = data.operation_details.reduce((total, detail) => total + Number(detail.price), 0);
            const xraysCost = data.xrays.reduce((total, xray) => total + Number(xray.price), 0);
            setTotalCost(operationDetailsCost + xraysCost);
        }
    }, [data]);
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
                    queryClient.invalidateQueries(CACHE_KEY_Operation);
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
    if (isLoading)
        return _jsx(LoadingSpinner, {});
    return (_jsx(Paper, { className: "p-4", children: _jsxs(Box, { className: "w-full flex flex-col gap-2", children: [_jsx(Box, { className: "flex justify-center  text-lg  text-gray-400 uppercase", children: _jsx("span", { children: "Payment validation" }) }), _jsx(Divider, { orientation: "horizontal", flexItem: true, className: "gap-2 mb-4", variant: "middle" }), _jsx(Box, { component: "form", onSubmit: handleSubmit(onSubmit), className: "w-full", children: _jsxs(Box, { className: "flex flex-col gap-6 p-6", children: [_jsxs(Box, { className: "flex flex-col gap-6 md:justify-between md:flex-row", children: [_jsx("h3", { className: "text-2xl font-semibold leading-none tracking-tight text-red-500", children: "D\u00E9tails du paiement des patients" }), _jsx("h3", { className: "text-2xl font-semibold leading-none tracking-tight text-gray-500", children: data?.patient_name })] }), _jsxs(Box, { className: "flex flex-col gap-10", children: [_jsxs(Box, { className: "flex flex-col gap-2", children: [_jsxs(Box, { className: "flex items-center justify-between", children: [_jsx("span", { className: "font-semibold text-base text-start", children: "Op\u00E9ration" }), _jsx("span", { className: "font-semibold text-base text-end", children: "Prix" })] }), _jsxs(Box, { className: "flex flex-col gap-1", children: [data?.operation_details?.map((detail, i) => (_jsxs(Box, { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-gray-500 text-base text-start", children: detail.operation_type || "No Operation Name" }), _jsxs("span", { className: "text-gray-500 text-sm text-end", children: [detail.price, " MAD"] })] }, i))), data?.xrays?.map((xray, i) => (_jsxs(Box, { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-gray-500 text-base text-start", children: xray.xray_type.join(", ") || "No X-Ray Type" }), _jsxs("span", { className: "text-gray-500 text-sm text-end", children: [xray.price, " MAD"] })] }, `xray-${i}`)))] })] }), _jsxs(Box, { className: "flex flex-col gap-2", children: [_jsxs(Box, { className: "flex justify-between items-center", children: [_jsx("h2", { className: "font-semibold text-base text-start w-1/3", children: "Paiements" }), _jsx("h2", { className: "font-semibold text-base text-center w-1/3", children: "Prix" }), _jsx("h2", { className: "font-semibold text-base text-center w-1/3", children: "Date" }), _jsx("h2", { className: "font-semibold text-base text-center w-[160px]", children: "Action" })] }), _jsx(Box, { className: "flex flex-col gap-1", children: fetchedoperations?.map((payment, j) => {
                                                    return (_jsxs(Box, { className: "flex items-center justify-between", children: [_jsxs("span", { className: "text-gray-500 text-base text-start w-1/3", children: ["Payment ", j + 1] }), _jsxs("span", { className: "text-gray-500 text-sm text-center w-1/3", children: [payment.amount_paid === null
                                                                        ? "0.00"
                                                                        : payment.amount_paid, "MAD"] }), _jsx("span", { className: "text-gray-500 text-sm text-center w-1/3", children: payment.date }), _jsx("div", { className: "text-center w-[160px]", children: _jsx(IconButton, { "aria-label": "delete", color: "error", onClick: () => deletePayment(payment.id), children: _jsx(DeleteOutlineOutlinedIcon, {}) }) })] }, j));
                                                }) })] }), outstandingAmount && (_jsxs(Box, { className: "flex items-center flex-wrap gap-2", children: [_jsx(Controller
                                            //@ts-ignore
                                            , { 
                                                //@ts-ignore
                                                defaultValue: "", name: "amount_paid", control: control, render: ({ field }) => (_jsx(TextField, { className: "flex-1", id: "amount_paid", label: "Montant", variant: "outlined", size: "small", type: "number", placeholder: "Enter Montant" // Add a placeholder
                                                    , ...field })) }), _jsx(Button, { variant: "outlined", className: "", type: "submit", children: addMutation.isLoading ? "..." : "Ajouter" })] })), _jsxs(Box, { className: "flex justify-between items-center", children: [_jsx("h2", { className: "font-semibold text-base text-start", children: "Montant restant" }), _jsx("span", { className: "font-semibold text-sm text-end text-red-500", children: `${outstandingAmount.toFixed(2)} MAD ` })] })] })] }) })] }) }));
};
export default NursePaymentpage;
