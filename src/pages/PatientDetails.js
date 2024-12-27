import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Box } from "@mui/material";
import { useState } from "react";
import "react-vertical-timeline-component/style.min.css";
import { useParams } from "react-router";
import LoadingSpinner from "../components/LoadingSpinner";
import AppointmentVerticalTimeline from "../components/AppointmentVerticalTimeline";
import PatientsdetailsComponent from "../components/PatientsdetailsComponent";
import React from "react";
import OperationVerticalTimeline from "../components/OperationVerticalTimeline";
import getGlobalById from "../hooks/getGlobalById";
import patientdetailsApiClient from "../services/PatientDetailsService";
import { CACHE_KEY_PatientDetails } from "../constants";
const PatientDetails = React.memo(() => {
    const [activeBtn, setActiveBtn] = useState("three");
    //get id in the url
    const { id } = useParams();
    const { data, isLoading } = id
        ? getGlobalById({}, [CACHE_KEY_PatientDetails, id], patientdetailsApiClient, undefined, parseInt(id))
        : { data: null, isLoading: true };
    const handleBtnClick = (ButtonName) => {
        setActiveBtn(ButtonName);
    };
    if (isLoading) {
        return _jsx(LoadingSpinner, {});
    }
    if (!id) {
        return _jsx("div", { children: "No ID specified." });
    }
    const { appointments, operations, upcomingAppointmentsCount, pastAppointmentsCount, } = data;
    return (_jsx(_Fragment, { children: _jsxs(Box, { className: "parent w-full flex flex-col gap-4", children: [_jsx(PatientsdetailsComponent, { info: data, isLoading: isLoading }), _jsxs(Box, { className: "w-full bg-white shadow-md gap-4 flex flex-col rounded-lg p-4", children: [_jsxs(Box, { className: "w-full rounded-md overflow-hidden flex", children: [_jsx(Box, { component: "button", className: "px-4 py-2 flex-1 text-center cursor-pointer", sx: {
                                        color: activeBtn === "one" ? "#fff" : "#9ea8b2",
                                        backgroundColor: activeBtn === "one" ? "#76c5bf" : "#f5f5f5",
                                    }, onClick: () => handleBtnClick("one"), children: "Rendez-vous" }), _jsx(Box, { component: "button", className: "px-4 py-2 flex-1 text-center cursor-pointer", sx: {
                                        color: activeBtn === "three" ? "#fff" : "#9ea8b2",
                                        backgroundColor: activeBtn === "three" ? "#76c5bf" : "#f5f5f5",
                                    }, onClick: () => handleBtnClick("three"), children: "Op\u00E9rations" })] }), activeBtn === "one" && Object.values(appointments).length === 0 ? (_jsx("p", { className: "flex justify-center font-bold", children: "Aucun rendez-vous enregistr\u00E9 pour ce patient." })) : null, activeBtn === "one" && Object.values(appointments).length > 0 && (_jsx(AppointmentVerticalTimeline, { Appointments: appointments, isLoading: isLoading })), activeBtn === "three" && Object.values(operations).length === 0 ? (_jsx("p", { className: "flex justify-center font-bold", children: "Aucune op\u00E9ration enregistr\u00E9e pour ce patient." })) : null, activeBtn === "three" && Object.values(operations).length > 0 && (_jsx(OperationVerticalTimeline, { Operations: operations, isLoading: isLoading }))] })] }) }));
});
export default PatientDetails;
