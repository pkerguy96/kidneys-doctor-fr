import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, useCallback, useMemo } from "react";
import { Autocomplete, TextField, FormControl, MenuItem, } from "@mui/material";
import LoadingSpinner from "./LoadingSpinner";
import useDebounce from "../hooks/useDebounce";
import addGlobal from "../hooks/addGlobal";
import { FetchPatientsWaitingRoom, } from "../services/WaitingroomService";
const PatientSearchAutocomplete = ({ label = "Rechercher un patient", empty = "Aucun patient trouvé", setPatient, defaultValue = null, labelClassName, showExternalLabel = true, formControlClassName, onOptionsChange, options = [], ApiClient = FetchPatientsWaitingRoom, }) => {
    const [localOptions, setLocalOptions] = useState(options);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPatient, setSelectedPatient] = useState(defaultValue);
    const [isLoading, setLoading] = useState(false);
    const searchMutation = addGlobal({}, ApiClient);
    const debouncedSearchQuery = useDebounce(searchQuery, 500);
    useEffect(() => {
        if (options.length) {
            setLocalOptions(options);
        }
    }, [options]);
    const noOptionsText = useMemo(() => {
        if (isLoading || debouncedSearchQuery.length === 0) {
            return label;
        }
        return localOptions.length === 0 ? empty : "";
    }, [isLoading, debouncedSearchQuery, localOptions]);
    const handleInputChange = useCallback((_, newInputValue) => {
        setSearchQuery(newInputValue);
    }, []);
    const handleChange = useCallback((_, newValue) => {
        setSelectedPatient(newValue);
        setPatient(newValue);
    }, [setPatient]);
    useEffect(() => {
        const fetchPatients = async () => {
            if (!debouncedSearchQuery) {
                setLocalOptions([]);
                onOptionsChange?.([]);
                return;
            }
            setLoading(true);
            try {
                const response = (await searchMutation.mutateAsync({
                    searchQuery: debouncedSearchQuery,
                }));
                const patients = response?.data ?? [];
                setLocalOptions(patients);
                onOptionsChange?.(patients);
            }
            catch (error) {
                console.error("Error fetching patients:", error);
            }
            finally {
                setLoading(false);
            }
        };
        fetchPatients();
    }, [debouncedSearchQuery]);
    useEffect(() => {
        if (defaultValue) {
            setSelectedPatient(defaultValue);
        }
    }, [defaultValue]);
    return (_jsxs(_Fragment, { children: [showExternalLabel && (_jsx("label", { htmlFor: "patient-search", className: labelClassName || "w-full md:w-[200px]", children: label })), _jsx(FormControl, { className: formControlClassName || "w-full md:flex-1", children: _jsx(Autocomplete, { value: selectedPatient, disablePortal: true, options: localOptions, noOptionsText: noOptionsText, getOptionLabel: (option) => option.name || "", isOptionEqualToValue: (option, value) => option.id === value?.id, sx: { width: "100%" }, loading: isLoading, loadingText: _jsx(LoadingSpinner, { size: "2rem" }), onInputChange: handleInputChange, onChange: handleChange, renderInput: (params) => _jsx(TextField, { ...params, label: label }), renderOption: (props, option) => (_jsxs(MenuItem, { component: "li", ...props, className: "flex flex-row items-center gap-6 w-full px-4 py-2", children: [_jsx("span", { children: option.name }), _jsx("span", { style: { color: "#888" }, children: option.phone ?? "" })] })) }) })] }));
};
export default PatientSearchAutocomplete;
