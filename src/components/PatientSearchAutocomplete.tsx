import React, { useState, useEffect, useCallback, useMemo } from "react";
import { Autocomplete, TextField, FormControl, Box } from "@mui/material";
import LoadingSpinner from "./LoadingSpinner";
import useDebounce from "../hooks/useDebounce";
import addGlobal from "../hooks/addGlobal";
import {
  PatientNameWaitingRoom,
  FetchPatientsWaitingRoom,
} from "../services/WaitingroomService";

interface PatientSearchAutocompleteProps {
  label?: string;
  setPatient: (patient: { id: number; name: string } | null) => void;
  className?: string;
  labelClassName?: string;
  formControlClassName?: string;
  onOptionsChange?: (options: { id: number; name: string }[]) => void;
  showExternalLabel?: boolean;
}

const PatientSearchAutocomplete: React.FC<PatientSearchAutocompleteProps> =
  React.memo(
    ({
      label = "Rechercher un patient",
      setPatient,
      labelClassName,
      showExternalLabel = true,
      formControlClassName,
      onOptionsChange,
    }) => {
      const [searchQuery, setSearchQuery] = useState("");
      const [options, setOptions] = useState([]);
      const [selectedPatient, setSelectedPatient] = useState<{
        id: number;
        name: string;
      } | null>(null);
      const [isLoading, setLoading] = useState(false);
      const searchMutation = addGlobal(
        {} as PatientNameWaitingRoom,
        FetchPatientsWaitingRoom
      );
      const debouncedSearchQuery = useDebounce(searchQuery, 500);

      const noOptionsText = useMemo(() => {
        if (isLoading || debouncedSearchQuery.length === 0) {
          return "Recherchez un patient";
        }
        return options.length === 0 ? "Aucun patient trouvé" : "";
      }, [isLoading, debouncedSearchQuery, options]);

      const handleInputChange = useCallback((event, newInputValue) => {
        setSearchQuery(newInputValue);
      }, []);

      const handleChange = useCallback(
        (event, newValue) => {
          setSelectedPatient(newValue);
          setPatient(newValue);
        },
        [setPatient]
      );
      useEffect(() => {
        const fetchPatients = async () => {
          if (!debouncedSearchQuery) {
            setOptions([]);
            onOptionsChange?.([]);
            return;
          }
          setLoading(true);
          try {
            const response = (await searchMutation.mutateAsync({
              searchQuery: debouncedSearchQuery,
            })) as { data: { id: number; name: string }[] };
            const patients = response?.data ?? [];
            setOptions(patients);
            onOptionsChange?.(patients);
          } catch (error) {
            console.error("Error fetching patients:", error);
          } finally {
            setLoading(false);
          }
        };

        fetchPatients();
      }, [debouncedSearchQuery]);
      return (
        <>
          {showExternalLabel && (
            <label
              htmlFor="patient-search"
              className={labelClassName || "w-full md:w-[200px]"}
            >
              {label}
            </label>
          )}
          <FormControl className={formControlClassName || "w-full md:flex-1"}>
            <Autocomplete
              value={selectedPatient}
              disablePortal
              options={options}
              noOptionsText={noOptionsText}
              getOptionLabel={(option) =>
                `${option.name || ""}  ${option.phone || ""}`
              }
              isOptionEqualToValue={(option, value) => option.id === value.id}
              sx={{ width: "100%" }}
              loading={isLoading}
              loadingText={<LoadingSpinner size="2rem" />}
              onInputChange={handleInputChange}
              onChange={handleChange}
              renderInput={(params) => <TextField {...params} label={label} />}
              renderOption={(props, option) => (
                <Box
                  component="li"
                  {...props}
                  className="flex flex-row items-center gap-6 w-full px-4 py-2"
                >
                  <span>{option.name}</span>
                  <span style={{ color: "#888" }}>{option.phone}</span>
                </Box>
              )}
            />
          </FormControl>
        </>
      );
    }
  );

export default PatientSearchAutocomplete;
