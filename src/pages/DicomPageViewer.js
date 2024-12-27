import { jsx as _jsx } from "react/jsx-runtime";
//@ts-nocheck
import { Paper } from "@mui/material";
import { useParams } from "react-router";
const DicomPageViewer = () => {
    const { id } = useParams();
    const data = localStorage.getItem("user_login");
    let Userid;
    if (data) {
        const parsedData = JSON.parse(data);
        Userid = parsedData.user.id;
    }
    else {
        console.log("Data not found in localStorage");
    }
    /* http://127.0.0.1:8000/file-upload/${id}?userId=${Userid}&iframe=true */
    const iframeSrc = `/file-upload/${id}?iframe=true `;
    return (_jsx(Paper, { id: "paperContainer", className: "fullscreen-container flex flex-col", children: _jsx("iframe", { src: iframeSrc, className: "relative w-full aspect-[10/13] lg:aspect-[16/10]" }) }));
};
export default DicomPageViewer;
