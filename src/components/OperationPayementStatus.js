import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
//@ts-nocheck
import { Box, IconButton, TextField, Button, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import updateItem from "../hooks/updateItem";
import operationApiClient from "../services/OperationService";
import { useSnackbarStore } from "../zustand/useSnackbarStore";
import { useQueryClient } from "@tanstack/react-query";
import { CACHE_KEY_Operation, CACHE_KEY_OperationDetail } from "../constants";
import operationDetailsApiClient, { deleteoperationdetailsApiclient, } from "../services/OperationDetailsService";
import getGlobalById from "../hooks/getGlobalById";
import LoadingSpinner from "./LoadingSpinner";
import deleteItem from "../hooks/deleteItem";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
const OperationPayementStatus = () => {
    const { handleSubmit, control, setValue } = useForm();
    /*   const { operationid } = useParams(); */
    const operationid = 1;
    const [fetchedoperations, setFetchedOperations] = useState([]);
    const [totalCost, setTotalCost] = useState(0);
    const addMutation = updateItem({}, operationApiClient);
    const { showSnackbar } = useSnackbarStore();
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    if (!operationid)
        return null;
    const { data, isLoading, refetch } = getGlobalById({}, [CACHE_KEY_OperationDetail, operationid.toString()], operationDetailsApiClient, undefined, parseInt(operationid));
    useEffect(() => {
        if (data && data.payments) {
            setFetchedOperations(data.payments);
            const cost = data.operation_details.reduce((total, fetchedoperations) => total + Number(fetchedoperations.price), 0);
            setTotalCost(cost);
        }
    }, [data]);
    if (isLoading)
        return _jsx(LoadingSpinner, {});
    const onSubmit = async (data) => {
        if (data) {
            if (totalpaid + Number(data.amount_paid) > totalCost) {
                showSnackbar("Total payment exceeds total cost.");
                return;
            }
            await addMutation
                .mutateAsync(
            //@ts-ignore
            { data, id: operationid }, {
                onSuccess(data) {
                    queryClient.invalidateQueries([
                        CACHE_KEY_OperationDetail,
                        operationid.toString(),
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
    const totalpaid = fetchedoperations.reduce((total, payment) => total + Number(payment.amount_paid), 0);
    const outstandingAmount = totalCost - totalpaid;
    const deletePayment = async (id) => {
        try {
            const deletionSuccessful = await deleteItem(id, deleteoperationdetailsApiclient);
            if (deletionSuccessful) {
                refetch();
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
    return (_jsx(Paper, { children: _jsxs(Box, { className: "p-4 w-full flex gap-4 flex-col", children: [_jsxs(Box, { className: "flex  flex-col md:flex-row md:justify-between", children: [_jsx("p", { className: "flex font-bold  mx-auto  text-md md:text-2xl md:mx-0 text-red-400", children: "Avertissement de paiement" }), _jsx("p", { className: "flex font-bold text-sm mx-auto  md:text-2xl md:mx-0 text-red-400", children: "Paiement incomplet" })] }), _jsx(Box, { component: "form", onSubmit: handleSubmit(onSubmit), className: "w-full h-full", children: _jsxs(Box, { className: "flex flex-col gap-6 p-6", children: [_jsx("h3", { className: "text-2xl font-semibold leading-none tracking-tight", children: "D\u00E9tails du paiement de patient" }), _jsxs(Box, { className: "flex flex-col gap-4", children: [_jsxs(Box, { className: "flex flex-col gap-2", children: [_jsxs(Box, { className: "flex items-center justify-between", children: [_jsx("span", { className: "font-semibold text-base text-start", children: "Op\u00E9ration" }), _jsx("span", { className: "font-semibold text-base text-end ", children: "Prix" })] }), _jsx(Box, { className: "flex flex-col gap-1", children: data?.operation_details?.map((detail, i) => (_jsxs(Box, { className: "flex items-center justify-between", children: [_jsx("span", { className: "text-gray-500 text-base text-start", children: detail.name || "No Operation Name" }), _jsxs("span", { className: "text-gray-500 text-sm text-end ", children: [detail.price, " MAD"] })] }, i))) })] }), _jsxs(Box, { className: "flex flex-col gap-2", children: [_jsxs(Box, { className: "flex justify-between items-center", children: [_jsx("h2", { className: "font-semibold text-base text-start w-1/3", children: "Paiements" }), _jsx("h2", { className: "font-semibold text-base text-center w-1/3", children: "Prix" }), _jsx("h2", { className: "font-semibold text-base text-end w-1/3", children: "Date" }), _jsx("h2", { className: "font-semibold text-base text-end w-1/3", children: "Action" })] }), _jsx(Box, { className: "flex flex-col gap-1", children: fetchedoperations?.map((payment, j) => {
                                                    return (_jsxs(Box, { className: "flex items-center justify-between", children: [_jsxs("span", { className: "text-gray-500 text-base text-start w-1/3", children: ["Payment ", j + 1] }), _jsxs("span", { className: "text-gray-500 text-sm text-center  w-1/3", children: [payment.amount_paid === null
                                                                        ? "0.00"
                                                                        : payment.amount_paid, " ", "MAD"] }), _jsx("span", { className: "text-gray-500 text-sm text-end md:text-center w-1/3", children: payment.date }), _jsx(IconButton, { "aria-label": "delete", color: "error", onClick: () => deletePayment(payment.id), children: _jsx(DeleteOutlineOutlinedIcon, {}) })] }, j));
                                                }) })] }), outstandingAmount !== 0 && (_jsxs(Box, { className: "flex items-center flex-wrap gap-2", children: [_jsx(Controller, { defaultValue: "", name: "amount_paid", control: control, render: ({ field }) => (_jsx(TextField, { className: "flex-1", id: "amount_paid", label: "Montant", variant: "outlined", size: "small", type: "number", placeholder: "Enter Montant" // Add a placeholder
                                                    , ...field })) }), _jsx(Button, { variant: "outlined", className: "", type: "submit", children: addMutation.isLoading ? "..." : "Ajouter" })] })), _jsxs(Box, { className: "flex justify-between items-center", children: [_jsx("h2", { className: "font-semibold text-base text-start", children: "Montant restant" }), _jsx("span", { className: "font-semibold text-sm text-end", children: `${outstandingAmount.toFixed(2)} MAD ` })] })] })] }) }), _jsx(Box, { className: "flex justify-between flex-row mt-5 content-center ml-auto", children: _jsx(Button, { variant: "contained", onClick: () => navigate("/dashboard"), children: "Terminer" }) })] }) }));
};
export default OperationPayementStatus;
