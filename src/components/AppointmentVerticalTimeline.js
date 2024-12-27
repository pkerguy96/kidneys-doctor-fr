import { jsx as _jsx } from "react/jsx-runtime";
import { VerticalTimeline, VerticalTimelineElement,
//@ts-ignore
 } from "react-vertical-timeline-component";
import InsertInvitationOutlinedIcon from "@mui/icons-material/InsertInvitationOutlined";
import LoadingSpinner from "./LoadingSpinner";
import { useMemo } from "react";
import { Box } from "@mui/material";
const AppointmentVerticalTimeline = ({ Appointments, isLoading, }) => {
    if (isLoading) {
        return _jsx(LoadingSpinner, {});
    }
    const timeline = useMemo(() => (_jsx(Box, { className: "max-h-[500px] overflow-auto rounded-md bg-[#f5f5f5] p-4", children: _jsx(VerticalTimeline, { className: "!w-full !m-0", children: Object.values(Appointments).map((appointment, index) => (_jsx(VerticalTimelineElement, { className: "vertical-timeline-element--work", date: appointment.date, contentStyle: {
                    borderTop: "3px solid #76c5bf",
                }, dateClassName: "custom-date-color", contentArrowStyle: {
                    borderRight: "8px solid  #76c5bf",
                }, iconStyle: { background: "#76c5bf", color: "#fff" }, icon: _jsx(InsertInvitationOutlinedIcon, {}), children: _jsx("h3", { className: "vertical-timeline-element-title uppercase", children: appointment.note ? (_jsx("p", { children: appointment.note })) : ("Aucune remarque") }) }, index))) }) })), [Appointments]);
    return timeline;
};
export default AppointmentVerticalTimeline;
