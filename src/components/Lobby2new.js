import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React, { useEffect, useRef, useState } from "react";
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
const Lobby2new = () => {
    const { data, isLoading } = getGlobal({}, CACHE_KEY_TvWaitingRoom, tvWaitingListApiClient, {
        refetchInterval: 5000, // Fetch data every 5 seconds
    });
    const [current, setCurrent] = useState(1);
    const waiting = useRef();
    useEffect(() => {
        if (!waiting.current)
            return;
        if (data) {
            var current = 1;
            data.forEach((carry, index) => {
                if (carry.status === "current")
                    current = index + 1;
            });
            scroll(current, waiting.current);
        }
    }, [data]);
    if (isLoading)
        return _jsx(LoadingSpinner, {});
    return (_jsxs(_Fragment, { children: [_jsx("div", { className: "bg" }), _jsx("div", { className: "bg bg2" }), _jsx("div", { className: "bg bg3" }), _jsx("main", { className: "flex items-center justify-center w-full h-[100dvh] p-4", children: data && data.length && data.some((p) => p.status !== "completed") ? (_jsxs("section", { className: "h-[90dvh] w-full max-w-[300px] relative", children: [_jsx("div", { className: "ui-grid-cursor rounded-2xl bg-green-500 bg-opacity-30" }), _jsxs("ul", { ref: waiting, className: "ui-grid w-full h-full scroll-smooth overflow-hidden", children: [_jsx("li", {}), _jsx("li", { className: "start" }), data.map((carry, index) => carry.status === "completed" ? (_jsx(React.Fragment, {}, index)) : (_jsx("li", { className: "flex flex-wrap bg-white justify-center rounded-2xl shadow-xl items-center p-4 px-10 gap-8", children: _jsx("h1", { className: "text-gray-900 font-black text-[8rem] w-max leading-[0]", children: index + 1 }) }, index))), _jsx("li", { className: "end" }), _jsx("li", {})] })] })) : (_jsx("div", { className: "flex flex-col items-center justify-center h-full", children: _jsx("p", { className: "z-50 text-white font-semibold text-2xl", children: "Aucun patient n'attend actuellement" }) })) })] }));
};
export default Lobby2new;
