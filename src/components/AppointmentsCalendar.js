import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useCallback, useMemo, useState } from "react";
import interactionPlugin from "@fullcalendar/interaction";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import timeGridPlugin from "@fullcalendar/timegrid"; // a plugin!
import { Paper } from "@mui/material";
import AppointmentModal from "./AppointmentModal";
import moment from "moment";
import AppointmentConfirmation from "./AppointmentConfirmation";
import getGlobal from "../hooks/getGlobal";
import appointmentAPIClient from "../services/AppointmentService";
import { CACHE_KEY_APPOINTMENTS } from "../constants";
import LoadingSpinner from "./LoadingSpinner";
import frLocale from "@fullcalendar/core/locales/fr";
const AppointmentsCalendar = () => {
    const [openModal, setOpenModal] = useState(false);
    const [openModalConfirmation, setOpenModalConfirmation] = useState(false);
    const [selectedDateStr, setSelectedDateStr] = useState("");
    const [confirmationData, setConfirmationData] = useState({
        id: 0,
        patient_name: "",
        patient_id: 0,
        note: "",
        date: "",
    });
    const { data, isLoading } = getGlobal({}, [CACHE_KEY_APPOINTMENTS[0]], appointmentAPIClient, undefined);
    // Format event data to be displayed in the calendar
    const formattedEvents = useMemo(() => {
        return data?.map((appointment) => {
            const startDate = moment(appointment.date).format("YYYY-MM-DDTHH:mm:ss");
            return {
                id: appointment.id,
                start: startDate,
                title: appointment.patient_name || "No Name",
                extendedProps: {
                    note: appointment.note,
                    patient_id: appointment.patient_id,
                },
                end: moment(appointment.date)
                    .add(30, "minutes")
                    .format("YYYY-MM-DDTHH:mm:ss"),
            };
        });
    }, [data]);
    const openAppointmentConfirmationModal = useCallback((data) => {
        setConfirmationData(data);
        setOpenModalConfirmation(true);
    }, []);
    const handleCloseModal = useCallback(() => {
        setOpenModal(false);
        setOpenModalConfirmation(false);
    }, []);
    const handleEventClick = useCallback((info) => {
        const { extendedProps, title, startStr, id } = info.event;
        openAppointmentConfirmationModal({
            id: Number(id),
            patient_id: extendedProps.patient_id,
            note: extendedProps.note,
            patient_name: title,
            date: startStr,
        });
    }, [openAppointmentConfirmationModal]);
    const handleDateClick = useCallback((info) => {
        setOpenModal(true);
        const selectedDate = moment(info.dateStr);
        const currentHour = selectedDate.hour();
        if (currentHour < 8) {
            selectedDate.hour(8).minute(0).second(0);
        }
        else if (currentHour > 18) {
            selectedDate.hour(18).minute(0).second(0);
        }
        setSelectedDateStr(selectedDate.format("YYYY-MM-DDTHH:mm:ss"));
    }, []);
    if (isLoading)
        return _jsx(LoadingSpinner, {});
    return (_jsxs(Paper, { className: "p-4", elevation: 3, children: [_jsx(FullCalendar, { plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin], headerToolbar: {
                    left: "title",
                    right: "prev,next,dayGridMonth,timeGridWeek,timeGridDay",
                }, initialView: "dayGridMonth", timeZone: "Africa/Casablanca", events: formattedEvents, eventClick: handleEventClick, dateClick: handleDateClick, slotDuration: "00:01:00", slotMinTime: "08:00:00", slotMaxTime: "19:00:00", allDaySlot: false, locales: [frLocale], validRange: {
                    start: moment().format("YYYY-MM-DD"),
                } }), _jsx(AppointmentConfirmation, { data: confirmationData, open: openModalConfirmation, onClose: handleCloseModal }), openModal ? (_jsx(AppointmentModal, { dateTime: selectedDateStr, open: openModal, onClose: handleCloseModal })) : ("")] }));
};
export default AppointmentsCalendar;
