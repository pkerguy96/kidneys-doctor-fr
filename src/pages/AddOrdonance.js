import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Paper, Box, TextField, Button, Typography, FormControl, IconButton, } from "@mui/material";
import { items } from "../services/Medicines.json";
import AddIcon from "@mui/icons-material/Add";
import { useState, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import LoadingSpinner from "../components/LoadingSpinner";
import { useLocation, useNavigate } from "react-router";
import { AxiosError } from "axios";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useSnackbarStore } from "../zustand/useSnackbarStore";
import { useQueryClient } from "@tanstack/react-query";
import { CACHE_KEY_PATIENTS } from "../constants";
import patientAPIClient from "../services/PatientService";
import updateItem from "../hooks/updateItem";
import ordonanceApiClient from "../services/OrdonanceService";
import addGlobal from "../hooks/addGlobal";
import getGlobalById from "../hooks/getGlobalById";
import PatientSearchAutocomplete from "../components/PatientSearchAutocomplete";
import usePrint from "./PrintGlobal";
const AddOrdonanceUpdated = () => {
    const [drugs, setDrugs] = useState([]);
    const [name, setName] = useState("");
    const [fromOperation, setFromOperation] = useState(false);
    const [optionsArray, setOptionsArray] = useState([]);
    const [iserror, setIsError] = useState(false);
    const queryClient = useQueryClient();
    const { showSnackbar } = useSnackbarStore();
    const { print, Printable } = usePrint();
    const { handleSubmit, setValue, getValues, control } = useForm({
        defaultValues: {
            date: new Date().toISOString().split("T")[0],
        },
    });
    const Addmutation = addGlobal({}, ordonanceApiClient);
    const useUpdateOrdonance = updateItem({}, ordonanceApiClient);
    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const id = queryParams.get("id");
    const ordonanceID = queryParams.get("ordonanceID");
    const direct = queryParams.get("direct");
    const navigate = useNavigate();
    const { data: SpecifiedPatient, isLoading: isLoading3 } = id
        ? getGlobalById({}, [CACHE_KEY_PATIENTS[0], id], patientAPIClient, undefined, parseInt(id))
        : { data: {}, isLoading: false };
    const isAddMode = !id;
    const onSubmit = async (data) => {
        data.drugs = drugs;
        if (data.drugs && data.drugs.length === 0) {
            setIsError(true);
        }
        else {
            const formData = {
                patient_id: data.patient.id,
                medicine: data.drugs,
                date: data.date,
            };
            let response;
            try {
                if (isAddMode || fromOperation) {
                    response = await createUser(formData);
                }
                else {
                    await editUser(formData, parseInt(ordonanceID));
                }
                queryClient.invalidateQueries({ queryKey: ["ordonance"] });
            }
            catch (error) {
                const message = error instanceof AxiosError
                    ? error.response?.data?.message
                    : error.message;
                showSnackbar(message, "error");
            }
        }
    };
    const createUser = async (formData) => {
        return await Addmutation.mutateAsync(formData, {
            onSuccess: () => {
                print(() => {
                    showSnackbar("Ordonnance ajoutée avec succès.", "success");
                    navigate("/Ordonnance");
                });
            },
            onError: (error) => {
                const message = error instanceof AxiosError
                    ? error.response?.data?.message
                    : error.message;
                showSnackbar(message, "warning");
            },
        });
    };
    const editUser = async (formData, ordonanceID) => {
        await useUpdateOrdonance.mutateAsync({ data: formData, id: ordonanceID }, {
            onSuccess: () => {
                showSnackbar("Ordonnance Modifiée avec succès.", "success");
                navigate("/Ordonnance");
            },
            onError: (error) => {
                const message = error instanceof AxiosError
                    ? error.response?.data?.message
                    : error.message;
                showSnackbar(message, "warning");
            },
        });
    };
    const handleNoteChange = (id, value) => {
        setDrugs((prevDrugs) => prevDrugs.map((drug) => drug.id === id ? { ...drug, note: value } : drug));
    };
    console.log(200);
    const removeOrdonance = (id) => {
        setDrugs((old) => old.filter((e) => e.id !== id));
    };
    useEffect(() => {
        if (!isAddMode) {
            if (SpecifiedPatient && id && !ordonanceID) {
                const formattedPatient = {
                    id: SpecifiedPatient.id,
                    name: `${SpecifiedPatient.nom} ${SpecifiedPatient.prenom}`,
                };
                setOptionsArray([formattedPatient]);
                setValue("patient", formattedPatient);
                setFromOperation(true);
            }
            else if (SpecifiedPatient) {
                const formattedPatient = {
                    id: SpecifiedPatient.id,
                    name: `${SpecifiedPatient.nom} ${SpecifiedPatient.prenom}`,
                };
                setOptionsArray([formattedPatient]);
                setValue("patient", formattedPatient);
                const SpecifiedOrdonance = SpecifiedPatient.ordonances.find((ordonance) => ordonance.id === parseInt(ordonanceID));
                if (SpecifiedOrdonance) {
                    setValue("date", SpecifiedOrdonance.date);
                    const DrugsDetails = SpecifiedOrdonance.ordonance_details.map((item) => ({
                        id: item.id,
                        medicine_name: item.medicine_name,
                        note: item.note,
                        price: "",
                        type: "",
                    }));
                    setDrugs(DrugsDetails);
                }
            }
        }
    }, [SpecifiedPatient, id]);
    if (isLoading3) {
        return _jsx(LoadingSpinner, {});
    }
    return (_jsxs(Paper, { className: "p-4", children: [_jsxs(Box, { component: "form", noValidate: true, autoComplete: "off", onSubmit: handleSubmit(onSubmit), className: "w-full flex flex-col gap-6 relative", children: [_jsx(Box, { className: "flex justify-center", children: _jsx(Typography, { id: "modal-modal-title", component: "h2", className: "text-center !text-2xl font-bold", children: isAddMode || !ordonanceID
                                ? "Ajouter une ordonance"
                                : "Modifier l'ordonance" }) }), _jsxs(Box, { className: "w-full flex flex-col gap-4", children: [_jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2", children: [_jsx("label", { htmlFor: "nom", className: "w-full md:w-[160px]", children: "Patient:" }), _jsx(Box, { className: `w-full md:flex-1 `, children: _jsx(Controller, { name: "patient", control: control, render: ({ field }) => (_jsx(PatientSearchAutocomplete, { options: optionsArray || [], showExternalLabel: false, setPatient: field.onChange, defaultValue: field.value })) }) })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2", children: [_jsx("label", { htmlFor: "nom", className: "w-full md:w-[160px]", children: "Date:" }), _jsx(FormControl, { className: "w-full md:flex-1", children: _jsx(Controller, { name: "date", control: control, rules: {
                                                validate: (value) => {
                                                    const selectedDate = new Date(value);
                                                    const currentDate = new Date();
                                                    return (selectedDate <= currentDate ||
                                                        "La date ne peut pas être dans le futur.");
                                                },
                                            }, render: ({ field }) => (_jsx(TextField, { type: "date", ...field, id: "outlined-required", size: "medium" })) }) })] }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-end md:items-center mt-2", children: [_jsx("label", { htmlFor: "nom", className: "w-full md:w-[160px]", children: "M\u00E9dicament:" }), _jsxs(Box, { className: "w-full md:flex-1", children: [_jsx(TextField, { className: "w-full", id: "outlined-basic", label: "Medicament", variant: "outlined", value: name, inputProps: { list: "browsers" }, onChange: (e) => {
                                                    setName(e.target.value);
                                                } }), _jsx("datalist", { id: "browsers", children: items.map((e, i) => (_jsx("option", { value: e.name }, i))) })] }), _jsx(Button, { className: "!px-4 !py-2 !min-w-max !rounded-full", variant: "outlined", onClick: () => {
                                            const valid = name.trim() !== "" &&
                                                !drugs.some((e) => e.medicine_name.toUpperCase() === name.toUpperCase());
                                            if (valid) {
                                                const found = items.find((e) => e.name === name);
                                                setDrugs([
                                                    ...drugs,
                                                    {
                                                        ...(found
                                                            ? {
                                                                medicine_name: found.name,
                                                                type: found.type,
                                                                price: found.price || "",
                                                                note: "",
                                                            }
                                                            : {
                                                                medicine_name: name,
                                                                type: "",
                                                                price: "",
                                                                note: "",
                                                            }),
                                                        id: drugs.length,
                                                    },
                                                ]);
                                            }
                                            setName("");
                                        }, children: _jsx(AddIcon, {}) })] }), iserror && (_jsx(Typography, { color: "error", className: "flex justify-center", children: "S'il vous pla\u00EEt, s\u00E9lectionnez au moins un m\u00E9dicament." })), _jsx(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2", children: _jsx(TableContainer, { component: Paper, elevation: 0, className: "border border-gray-300", children: _jsxs(Table, { sx: { minWidth: 650 }, "aria-label": "simple table", children: [_jsx(TableHead, { className: "bg-gray-200", children: _jsxs(TableRow, { children: [_jsx(TableCell, { width: 300, children: "Nom du m\u00E9dicament" }), _jsx(TableCell, { children: "Type" }), _jsx(TableCell, { children: "Prix" }), _jsx(TableCell, { children: "Note" }), _jsx(TableCell, { width: 60, align: "center", children: "Action" })] }) }), _jsx(TableBody, { children: drugs.length ? (drugs.map((row, index) => (_jsxs(TableRow, { className: "border-t border-gray-300", children: [_jsx(TableCell, { component: "th", scope: "row", children: row.medicine_name }), _jsx(TableCell, { component: "th", children: row.type ? row.type : "n/a" }), _jsxs(TableCell, { component: "th", children: [row.price, " ", row.price === "" ? "n/a" : "MAD"] }), _jsx(TableCell, { style: { minWidth: 200 }, children: _jsx(TextField, { fullWidth: true, value: row.note || "", onChange: (e) => handleNoteChange(row.id, e.target.value) }) }), _jsx(TableCell, { children: _jsx(IconButton, { onClick: () => removeOrdonance(row.id), children: _jsx(DeleteOutlineIcon, { color: "error", className: "pointer-events-none", fill: "currentColor" }) }) })] }, index)))) : (_jsx(TableRow, { className: "border-t border-gray-300", children: _jsx(TableCell, { colSpan: 5, align: "center", className: "!text-gray-600 p-4", children: _jsx("p", { className: "text-lg", children: "D\u00E9sol\u00E9, aucune medicament pour le moment." }) }) })) })] }) }) })] }), _jsx(Box, { className: "flex justify-between flex-row content-center", children: _jsx(Button, { type: "submit", variant: "contained", className: "w-full md:w-max !px-10 !py-3 rounded-lg !ms-auto", children: useUpdateOrdonance.isLoading ? "mise à jour..." : "Enregistrer" }) })] }), _jsx(Printable, { name: getValues("patient")?.name, items: drugs, render: (item, index) => (_jsxs("div", { children: [_jsxs("h3", { className: "font-bold", children: [index + 1, "- ", item.medicine_name] }), _jsx("p", { className: "ms-4", children: item.note })] }, index)) })] }));
};
export default AddOrdonanceUpdated;
