import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { Box, Button } from "@mui/material";
import PrintIcon from "@mui/icons-material/Print";
import { useParams } from "react-router";
import getGlobalById from "../hooks/getGlobalById";
import LoadingSpinner from "./LoadingSpinner";
import { CACHE_KEY_Bloodtest } from "../constants";
import { bloodTestApiClient } from "../services/BloodTest";
import usePrint from "../pages/PrintGlobal";
function $tempkate(opts) {
    const { lang, dir, size, margin, css, page } = opts;
    return `<!DOCTYPE html><html lang="${lang}"dir="${dir}"><head><meta charset="UTF-8"/><meta http-equiv="X-UA-Compatible"content="IE=edge"/><meta name="viewport"content="width=device-width, initial-scale=1.0"/><style>@page{size:${size.page};margin:${margin}}#page{width:100%}#head{height:${size.head}}#foot{height:${size.foot}}</style>${css}</head><body><table id="page"><thead><tr><td><div id="head"></div></td></tr></thead><tbody><tr><td><main id="main">${page}</main></td></tr></tbody><tfoot><tr><td><div id=foot></div></td></tr></tfoot></table></body></html>`;
}
function Print(target) {
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
        setTimeout(() => {
            document.body.removeChild(iframe);
        }, 1000);
    };
}
const BloodTestPrintableComponent = () => {
    const { id } = useParams();
    if (!id) {
        return _jsx("div", { children: "No ID specified." });
    }
    const { print, Printable } = usePrint();
    const { data, isLoading } = getGlobalById({}, [CACHE_KEY_Bloodtest[0], id], bloodTestApiClient, undefined, parseInt(id));
    if (isLoading) {
        return _jsx(LoadingSpinner, {});
    }
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "w-full flex flex-col gap-4 bg-white rounded-sm p-4 relative z-[1]", children: _jsxs("div", { className: "w-2/3 mx-auto flex flex-col gap-6", children: [_jsxs("div", { className: "w-full flex gap-4 items-center flex-col", children: [_jsxs("p", { className: "font-semibold", children: ["Fait a beni mellal Le ", data?.created_at] }), _jsxs("p", { className: "font-semibold", children: ["Nom & Prenom: ", data?.patient_name] })] }), _jsx("div", { className: "w-full flex flex-col gap-4 my-10", children: _jsx("div", { className: "w-full flex flex-col gap-2", children: Array.isArray(data?.blood_tests) &&
                                    data.blood_tests.length > 0 ? (data.blood_tests.map((test, index) => (_jsx("div", { children: _jsxs("h3", { className: "font-bold", children: [index + 1, " - ", test.title] }) }, index)))) : (_jsx("p", { className: "italic text-gray-500", children: "No blood tests available." })) }) })] }) }), _jsx(Printable, { name: data?.patient_name, date: data?.created_at, items: data.blood_tests, render: (item, index) => (_jsx("div", { children: _jsxs("h3", { className: "font-bold", children: [index + 1, " - ", item.title] }) }, index)) }), _jsx(Box, { className: "flex flex-col gap-4 sm:flex-row justify-end  mt-2 w-full ", children: _jsx(Button, { className: "mt-4", variant: "contained", size: "large", color: "primary", startIcon: _jsx(PrintIcon, {}), onClick: () => print(), children: "Print" }) })] }));
};
export default BloodTestPrintableComponent;
