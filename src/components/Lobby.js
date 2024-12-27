import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useEffect, useRef, useState } from "react";
import getGlobal from "../hooks/getGlobal";
import { CACHE_KEY_TvWaitingRoom } from "../constants";
import { tvWaitingListApiClient } from "../services/WaitingroomService";
import LoadingSpinner from "../components/LoadingSpinner";
const scroll = (i, waiting) => {
    var active = waiting.children[i + 1];
    if (!active)
        active = waiting.children[waiting.children.length - 1];
    active.scrollIntoView({
        behavior: "smooth",
        block: "center",
    });
};
const Lobby = () => {
    const { data, isLoading } = getGlobal({}, CACHE_KEY_TvWaitingRoom, tvWaitingListApiClient, {
        refetchInterval: 5000, // Fetch data every 5 seconds
    });
    const [current, setCurrent] = useState(1);
    const waiting = useRef();
    useEffect(() => {
        if (!waiting.current)
            return;
        var current = 1;
        if (data) {
            data.forEach((carry, index) => {
                if (carry.status === "current")
                    current = index + 1;
            });
        }
        scroll(current, waiting.current);
    }, [data]);
    if (isLoading)
        return _jsx(LoadingSpinner, {});
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "bg" }), _jsx("div", { className: "bg bg2" }), _jsx("div", { className: "bg bg3" }), _jsx("main", { className: "flex items-center justify-center w-full h-[100dvh] p-4", children: _jsxs("section", { className: "h-[90dvh] w-full max-w-[1000px] relative", children: [data && data.length > 0 && (_jsx("div", { className: "ui-grid-cursor rounded-2xl bg-green-500 bg-opacity-30" })), data && data.length > 0 ? (_jsxs("ul", { ref: waiting, className: "ui-grid w-full h-full scroll-smooth overflow-hidden", children: [_jsx("li", {}), _jsx("li", { className: "start" }), data.map((carry, index) => (_jsxs("li", { className: "flex flex-wrap bg-white rounded-2xl shadow-xl items-center p-4 px-10 gap-8", children: [_jsxs("h1", { className: "text-gray-900 font-black text-5xl w-max", children: [index + 1, "."] }), _jsx("div", { className: "block h-full aspect-square object-cover object-center bg-gray-200 rounded-full" }), _jsx("h1", { className: "text-gray-900 font-black text-3xl w-0 flex-1", children: carry.patient_name })] }, index))), _jsx("li", { className: "end" }), _jsx("li", {})] })) : (_jsx("div", { className: "flex flex-col items-center justify-center h-full", children: _jsx("p", { className: "z-50 text-white font-semibold text-2xl", children: "Aucun patient n'attend actuellement" }) }))] }) })] }));
};
export default Lobby;
