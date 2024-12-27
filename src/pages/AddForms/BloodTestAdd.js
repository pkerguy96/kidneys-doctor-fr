import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Paper, Box, FormControl, TextField, Button, Autocomplete, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, } from "@mui/material";
import { useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import addGlobal from "../../hooks/addGlobal";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import { CACHE_KEY_BloodtestList } from "../../constants";
import { bloodTestApiClient, bloodTestpreflistApiClient, } from "../../services/BloodTest";
import { useNavigate } from "react-router";
import getGlobal from "../../hooks/getGlobal";
import PatientSearchAutocomplete from "../../components/PatientSearchAutocomplete";
import usePrint from "../PrintGlobal";
function $tempkate(opts) {
    const { lang, dir, size, margin, css, page } = opts;
    return `<!DOCTYPE html><html lang="${lang}"dir="${dir}"><head><meta charset="UTF-8"/><meta http-equiv="X-UA-Compatible"content="IE=edge"/><meta name="viewport"content="width=device-width, initial-scale=1.0"/><style>@page{size:${size.page};margin:${margin}}#page{width:100%}#head{height:${size.head}}#foot{height:${size.foot}}</style>${css}</head><body><table id="page"><thead><tr><td><div id="head"></div></td></tr></thead><tbody><tr><td><main id="main">${page}</main></td></tr></tbody><tfoot><tr><td><div id=foot></div></td></tr></tfoot></table></body></html>`;
}
function Print(target, callback = () => { }) {
    const page = document.querySelector(target);
    var iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);
    var iframeDoc = iframe.contentDocument || iframe?.contentWindow?.document;
    iframeDoc?.open();
    iframeDoc?.write($tempkate({
        size: {
            page: "A5",
            head: "100px",
            foot: "80px",
        },
        page: page.innerHTML,
        margin: "10mm 10mm 10mm 10mm",
        css: [
            '<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.16/dist/tailwind.min.css" rel="stylesheet">',
        ],
    }));
    iframeDoc?.close();
    iframe.onload = function () {
        iframe?.contentWindow?.print();
        callback();
        setTimeout(() => {
            document.body.removeChild(iframe);
        }, 1000);
    };
}
const BloodTestAdd = () => {
    const navigate = useNavigate();
    const [patient, setPatient] = useState();
    const [analyse, setAnalyse] = useState(NaN);
    const [fields, setFields] = useState([]);
    const { print, Printable } = usePrint();
    const { data: BoneDoctorBloodTests, isLoading } = getGlobal({}, CACHE_KEY_BloodtestList, bloodTestpreflistApiClient, undefined);
    const addMutation = addGlobal({}, bloodTestApiClient);
    const handleAddRow = () => {
        if (Number.isNaN(analyse))
            return;
        setFields((old) => [...old, BoneDoctorBloodTests[analyse]]);
        setAnalyse(NaN);
    };
    const handleRemoveRow = (index) => {
        setFields((old) => old.filter((current, _index) => _index !== index));
    };
    const onSubmit = (e) => {
        e.preventDefault();
        const formdata = {
            operation_id: null,
            patient_id: patient.id,
            blood_test: fields,
        };
        try {
            addMutation.mutateAsync(formdata, {
                onSuccess: (data) => {
                    print(() => navigate("/bloodtest"));
                },
                onError: (error) => {
                    console.log(error);
                },
            });
        }
        catch (error) { }
    };
    const FormattedDate = new Date().toISOString().split("T")[0].split("-");
    if (isLoading)
        return _jsx(LoadingSpinner, {});
    return (_jsxs(Paper, { className: "p-4", children: [_jsxs(Box, { component: "form", noValidate: true, autoComplete: "off", onSubmit: onSubmit, className: "w-full flex flex-col gap-6", children: [_jsx(Box, { className: "flex justify-center", children: _jsx(Typography, { id: "modal-modal-title", component: "h2", className: "text-center !text-2xl font-bold", children: "Ajouter un bilan sanguin" }) }), _jsxs(Box, { className: "w-full flex flex-col gap-4", children: [_jsx(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2", children: _jsx(PatientSearchAutocomplete, { setPatient: setPatient, label: "Rechercher un patient" }) }), _jsxs(Box, { className: "w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2", children: [_jsx("label", { htmlFor: "nom", className: "w-full md:w-[200px]", children: "Analyses" }), _jsx(FormControl, { className: "flex-1", children: _jsx(Autocomplete, { className: "w-full", id: "demo-autocomplete-helper", options: BoneDoctorBloodTests, getOptionLabel: (option) => option.title, value: BoneDoctorBloodTests[analyse] || null, onChange: (event, newValue) => {
                                                setAnalyse(newValue ? BoneDoctorBloodTests.indexOf(newValue) : NaN);
                                            }, renderInput: (params) => (_jsx(TextField, { ...params, label: "Analyses", variant: "outlined", placeholder: "Choisissez une analyse" })) }) }), _jsx(Button, { className: "!px-4 !py-2 !min-w-max !rounded-full", variant: "outlined", onClick: handleAddRow, children: _jsx(AddIcon, {}) })] })] }), _jsx(Box, { className: "w-full flex flex-col gap-2", children: _jsx(TableContainer, { component: Paper, elevation: 0, className: "border border-gray-300", children: _jsxs(Table, { sx: { minWidth: 650 }, "aria-label": "simple table", children: [_jsx(TableHead, { className: "bg-gray-200", children: _jsxs(TableRow, { children: [_jsx(TableCell, { width: 100, children: "Code" }), _jsx(TableCell, { children: "Analyse" }), _jsx(TableCell, { width: 200, children: "Prix" }), _jsx(TableCell, { width: 60, align: "center", children: "Action" })] }) }), _jsx(TableBody, { children: fields.length ? (fields.map((carry, index) => (_jsxs(TableRow, { className: "border-t border-gray-300", children: [_jsx(TableCell, { children: carry.code }), _jsx(TableCell, { children: carry.title }), _jsxs(TableCell, { children: [carry.price, " ", carry.price ? "MAD" : "n/a"] }), _jsx(TableCell, { children: _jsx(IconButton, { onClick: () => handleRemoveRow(index), children: _jsx(DeleteOutlineIcon, { color: "error", className: "pointer-events-none", fill: "currentColor" }) }) })] }, index)))) : (_jsx(TableRow, { className: "border-t border-gray-300", children: _jsx(TableCell, { colSpan: 3, align: "center", className: "!text-gray-600 p-4", children: _jsx("p", { className: "text-lg", children: "D\u00E9sol\u00E9, aucun analyse pour le moment." }) }) })) })] }) }) }), _jsx(Box, { className: "flex", children: _jsx(Button, { type: "submit", variant: "contained", className: "w-full md:w-max !px-10 !py-3 rounded-lg !ms-auto", children: "Enregistrer" }) })] }), _jsx(Printable, { name: patient?.name, items: fields, render: (item, index) => (_jsx("div", { children: _jsxs("h3", { className: "font-bold", children: [index + 1, "- ", item.title] }) }, index)) })] }));
};
const autocompleteStyles = {
    "& .MuiOutlinedInput-root": {
        backgroundColor: "white",
        borderColor: "rgba(0, 0, 0, 0.23)",
        "& fieldset": {
            borderColor: "rgba(0, 0, 0, 0.23)",
        },
        "&:hover fieldset": {
            borderColor: "dark",
        },
        "&.Mui-focused fieldset": {
            borderColor: "primary.main",
        },
    },
};
export default BloodTestAdd;
