import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import * as React from "react";
import Menu from "@mui/material/Menu";
import AlarmIcon from "@mui/icons-material/Alarm";
import { Box, Button, IconButton, } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { clearPatientCounterApiClient, incrementPatientApiClient, waitingRoomApiClient, } from "../services/WaitingroomService";
import { CACHE_KEY_PatientsWaitingRoom, CACHE_KEY_WAITINGLIST, } from "../constants";
import { useQueryClient } from "@tanstack/react-query";
import { useCallback, useState } from "react";
import LoadingSpinner from "./LoadingSpinner";
import addGlobal from "../hooks/addGlobal";
import getGlobal from "../hooks/getGlobal";
import { useSnackbarStore } from "../zustand/useSnackbarStore";
import { AxiosError } from "axios";
import PatientSearchAutocomplete from "./PatientSearchAutocomplete";
function WaitingRoomMenu() {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const queryClient = useQueryClient();
    /*   const [searchQuery, setSearchQuery] = useState(""); */
    const waiting = getGlobal({}, CACHE_KEY_PatientsWaitingRoom, waitingRoomApiClient, {
        refetchInterval: 10000,
    });
    /*   const searchMutation = addGlobal(
      {} as PatientNameWaitingRoom,
      FetchPatientsWaitingRoom
    ); */
    const AddPatient = addGlobal({}, incrementPatientApiClient);
    /*   const [isLoadingPatient, setLoading] = useState(false);
    const [options, setOptions] = useState([]); // Store autocomplete options */
    const [height, setHeight] = useState("auto");
    const [selectedPatient, setSelectedPatient] = useState(null);
    /*   const debouncedSearchQuery = useDebounce(searchQuery, 500); */
    const { showSnackbar } = useSnackbarStore();
    const adjustHeight = useCallback((options) => {
        const newHeight = options.length === 0 ? "auto" : 200 + 30 * options.length + "px";
        setHeight(newHeight);
    }, []);
    /*  const handleSearch = useCallback((query: string) => {
      setSearchQuery((prevQuery) => (prevQuery !== query ? query : prevQuery));
    }, []); */
    /*   useEffect(() => {
      const fetchPatients = async () => {
        if (!debouncedSearchQuery) {
          setOptions([]);
          setHeight("auto");
          return;
        }
        if (debouncedSearchQuery) {
          setLoading(true);
          try {
            const response = (await searchMutation.mutateAsync({
              searchQuery: debouncedSearchQuery,
            })) as { data: { id: number; name: string }[] };
            const patients = response?.data ?? [];
            setOptions(patients);
            const h =
              patients.length === 0 ? "auto" : 200 + 30 * patients.length + "px";
            setHeight(h);
          } catch (error) {
          } finally {
            setLoading(false);
          }
        } else {
          setOptions([]);
          setHeight("auto");
        }
      };
  
      fetchPatients();
    }, [debouncedSearchQuery]); */
    /*   const handlePatientSelect = useCallback((event: any, newValue: any) => {
      setSelectedPatient(newValue);
    }, []); */
    const resetPatientCounter = useCallback(async () => {
        try {
            const response = await clearPatientCounterApiClient.getone();
            if (response.status >= 200 && response.status < 300) {
                queryClient.invalidateQueries(CACHE_KEY_PatientsWaitingRoom);
                queryClient.invalidateQueries(CACHE_KEY_WAITINGLIST);
            }
            else {
            }
        }
        catch (error) {
            console.log(error);
        }
    }, []);
    const open = Boolean(anchorEl);
    const handleClick = useCallback((event) => {
        setAnchorEl(event.currentTarget);
    }, []);
    const handleClose = useCallback(() => {
        setAnchorEl(null);
    }, []);
    const addPatientToWaitingList = async () => {
        await AddPatient.mutateAsync({ patient_id: selectedPatient?.id }, {
            onSuccess(data) {
                waiting.refetch();
                console.log(data?.message);
                showSnackbar(data?.message, "success");
                queryClient.invalidateQueries(CACHE_KEY_WAITINGLIST);
            },
            onError(error) {
                const message = error instanceof AxiosError
                    ? error.response?.data?.message
                    : error.message;
                showSnackbar(message, "error");
            },
        });
    };
    return (_jsxs("div", { children: [_jsx(IconButton, { color: "inherit", id: "basic-button", "aria-controls": open ? "basic-menu" : undefined, "aria-haspopup": "true", "aria-expanded": open ? "true" : undefined, onClick: handleClick, children: _jsx(AlarmIcon, {}) }), _jsx(Menu, { id: "basic-menu", anchorEl: anchorEl, open: open, onClose: handleClose, MenuListProps: {
                    style: {
                        width: "400px",
                        height: height,
                        maxHeight: 470,
                        padding: "12px",
                        display: "flex",
                        flexDirection: "column",
                        overflow: "auto",
                        gap: "1rem",
                    },
                    "aria-labelledby": "basic-button",
                }, children: waiting.isLoading ? (_jsx(LoadingSpinner, {})) : (_jsxs(Box, { className: "flex flex-col gap-4", children: [_jsxs(Box, { tabIndex: -1, className: "flex items-center justify-between", children: [_jsx("span", { className: "font-medium text-md", children: "Nombre patients" }), _jsx(Box, { className: "flex flex-row gap-2", children: _jsx("span", { className: "flex justify-center items-center text-xl text-[#4B918C]", children: waiting.data }) })] }), _jsx(Box, { className: "flex justify-center items-center w-full gap-8", children: _jsx(PatientSearchAutocomplete, { setPatient: setSelectedPatient, onOptionsChange: adjustHeight, showExternalLabel: false, options: [] }) }), _jsxs(Box, { className: "flex flex-wrap items-center justify-end gap-4", children: [_jsx(Button, { type: "submit", variant: "contained", size: "small", className: "rounded-lg !ms-auto", onClick: addPatientToWaitingList, children: "Ajouter" }), _jsx(Button, { className: "ml-auto mb-2", variant: "outlined", size: "small", color: "error", endIcon: _jsx(DeleteIcon, {}), onClick: resetPatientCounter, children: "Clear" })] })] })) })] }));
}
export default React.memo(WaitingRoomMenu);
