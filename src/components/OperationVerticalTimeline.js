import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { VerticalTimeline, VerticalTimelineElement,
//@ts-ignore
 } from "react-vertical-timeline-component";
import VaccinesOutlinedIcon from "@mui/icons-material/VaccinesOutlined";
import LoadingSpinner from "./LoadingSpinner";
import { useMemo } from "react";
import { Box } from "@mui/material";
const OperationVerticalTimeline = ({ Operations, isLoading, }) => {
    if (isLoading)
        return _jsx(LoadingSpinner, {});
    const Operationtimeline = useMemo(() => (_jsx(Box, { className: "max-h-[500px] overflow-auto rounded-md bg-[#f5f5f5] p-4", children: _jsx(VerticalTimeline, { className: "!w-full !m-0", children: Operations.map((operation) => operation.operation_type.map((operation_type, index) => (_jsx(VerticalTimelineElement, { className: "vertical-timeline-element--work", date: operation_type.date, contentStyle: {
                    borderTop: "3px solid #76c5bf",
                }, dateClassName: "custom-date-color !py-0 lg:!py-[.7rem]", contentArrowStyle: {
                    borderRight: "8px solid  #76c5bf",
                }, iconStyle: { background: "#76c5bf", color: "#fff" }, icon: _jsx(VaccinesOutlinedIcon, {}), children: _jsxs("div", { className: "flex flex-col", children: [_jsxs("div", { className: "flex gap-1", children: [_jsxs("h6", { children: [index + 1, "."] }), _jsx("h4", { className: "vertical-timeline-element-subtitle", children: operation_type.operation_type })] }), _jsxs("div", { className: "flex gap-2 text-sm", children: [_jsxs("div", { className: "flex gap-1", children: [_jsx("h6", { children: "Source:" }), _jsx("span", { children: operation_type.source })] }), _jsxs("div", { className: "flex gap-1", children: [_jsx("h6", { children: "Prix:" }), _jsxs("span", { children: [operation_type.price, " MAD"] })] })] })] }, index) }, index)))) }) })), [Operations]);
    return Operationtimeline;
};
export default OperationVerticalTimeline;
{
    /* <VerticalTimeline className="!w-full !m-0">
    {Operations.map((operation: Operation, index: number) => (
      <VerticalTimelineElement
        key={index}
        className="vertical-timeline-element--work"
        date={operation.date}
        contentStyle={{
          borderTop: "3px solid rgb(33, 150, 243)",
        }}
        dateClassName="custom-date-color !py-0 lg:!py-[.7rem]"
        contentArrowStyle={{
          borderRight: "8px solid  rgb(33, 150, 243)",
        }}
        iconStyle={{ background: "rgb(33, 150, 243)", color: "#fff" }}
        icon={<VaccinesOutlinedIcon />}
      >
        <h3 className="vertical-timeline-element-title uppercase font-semibold text-base">
          OPÉRATIONS:
        </h3>
        <div className="flex flex-col gap-2 my-2 lg:mb-0">
          {operation.operation_type.map((operationType: any, index: number) => (
            <div key={index} className="flex flex-col">
              <div className="flex gap-1">
                <h6>{index + 1}.</h6>
                <h4 className="vertical-timeline-element-subtitle">
                  {operationType.operation_type}
                </h4>
              </div>
              <div className="flex gap-2 text-sm">
                <div className="flex gap-1">
                  <h6>Source:</h6>
                  <span>{operationType.source}</span>
                </div>
                <div className="flex gap-1">
                  <h6>Prix:</h6>
                  <span>{operationType.price} MAD</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </VerticalTimelineElement>
    ))}
  </VerticalTimeline>; */
}
