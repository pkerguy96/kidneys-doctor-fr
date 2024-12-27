import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useRef, useState } from "react";
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography, } from "@mui/material";
import addGlobal from "../../hooks/addGlobal";
import { SettingsApiClient, } from "../../services/SettingsService";
import { useSnackbarStore } from "../../zustand/useSnackbarStore";
import { AxiosError } from "axios";
const KpiSettings = () => {
    const { showSnackbar } = useSnackbarStore();
    const addmutation = addGlobal({}, SettingsApiClient, undefined);
    const [selected, setSelected] = useState("");
    const selectRef = useRef(null);
    const handleChange = (event) => {
        setSelected(event.target.value);
    };
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (selected == "") {
            alert("veuillez sélectionner une option");
        }
        const formData = {
            period: selected,
        };
        await addmutation.mutateAsync(formData, {
            onSuccess: () => {
                showSnackbar("La préférence a été modifiée", "success");
            },
            onError: (error) => {
                const message = error instanceof AxiosError
                    ? error.response?.data?.message
                    : error.message;
                showSnackbar(message, "error");
            },
        });
    };
    return (_jsxs(Box, { className: "flex flex-col w-full gap-6", component: "form", onSubmit: handleSubmit, children: [_jsx(Box, { className: "flex justify-center", children: _jsx(Typography, { id: "modal-modal-title", component: "h2", className: "text-center !text-2xl font-medium", children: "S\u00E9lectionnez la dur\u00E9e des m\u00E9triques" }) }), _jsxs(FormControl, { className: "w-full", children: [_jsx(InputLabel, { id: "demo-simple-select-standard-label", children: "P\u00E9riode" }), _jsxs(Select, { labelId: "demo-simple-select-standard-label", id: "demo-simple-select-standard", label: "Period", value: selected, onChange: handleChange, ref: selectRef, children: [_jsx(MenuItem, { value: "year", children: "Ann\u00E9e" }), _jsx(MenuItem, { value: "month", children: "Mois" }), _jsx(MenuItem, { value: "week", children: "Semaine" }), _jsx(MenuItem, { value: "day", children: "Jour" })] })] }), _jsx(Box, { className: "flex", children: _jsx(Button, { type: "submit", variant: "contained", className: "w-full md:w-max !px-10 !py-3 rounded-lg !ms-auto", children: "Enregistrer" }) })] }));
};
export default KpiSettings;
