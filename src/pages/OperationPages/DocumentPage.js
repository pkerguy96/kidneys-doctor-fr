import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Paper, Box, Typography, Checkbox, FormControlLabel, FormGroup, Button, } from "@mui/material";
import { useRef, useState } from "react";
const DocumentPage = ({ onNext }) => {
    const ahmedtag = useRef(null);
    const [selectedDocuments1, setSelectedDocuments1] = useState([
        { label: "Acromioplastie", checked: false, link: "/Acromioplastie.pdf" },
        { label: "Arthroscopie", checked: false, link: "/Arthroscopie.pdf" },
        {
            label: "L’arthrodèse de cheville",
            checked: false,
            link: "/Larthrodèsedecheville.pdf",
        },
        {
            label: "La prothèse totale de genou",
            checked: false,
            link: "/Laprothèseotaledegenou.pdf",
        },
        {
            label: "Le ligament croisé antérieur",
            checked: false,
            link: "/Leligamentcroiséantérieur.pdf",
        },
    ]);
    const [selectedDocuments2, setSelectedDocuments2] = useState([
        { label: "Document 1", checked: false, link: "/sample.pdf" },
        { label: "Document 2", checked: false, link: "/sample.pdf" },
        { label: "Document 3", checked: false, link: "/sample.pdf" },
        { label: "Document 4", checked: false, link: "/sample.pdf" },
    ]);
    const handleCheckboxChange1 = (index) => {
        const updatedDocuments = [...selectedDocuments1];
        updatedDocuments[index].checked = !updatedDocuments[index].checked;
        setSelectedDocuments1(updatedDocuments);
    };
    const handleCheckboxChange2 = (index) => {
        const updatedDocuments = [...selectedDocuments2];
        updatedDocuments[index].checked = !updatedDocuments[index].checked;
        setSelectedDocuments2(updatedDocuments);
    };
    /* const handlePrintAndNext = () => {
      const selectedPDFs = selectedDocuments.filter((doc) => doc.checked);
  
      selectedPDFs.forEach((doc) => {
        if (ahmedtag.current) {
          // Check if ref is defined
          ahmedtag.current.href = doc.link;
          ahmedtag.current.click();
        } */
    /*  const newWindow = window.open(doc.link, "_blank");
        if (newWindow) {
          newWindow.addEventListener("load", () => {
            newWindow.print();
          });
        } */
    /*  });
      onNext(); */
    /*   onNext(); */
    /* }; */
    const handlePrintAndNext = async () => {
        const selectedPDFs1 = selectedDocuments1.filter((doc) => doc.checked);
        const selectedPDFs2 = selectedDocuments2.filter((doc) => doc.checked);
        const selectedPDFs = [...selectedPDFs1, ...selectedPDFs2];
        const openAndPrintPDF = (doc) => new Promise((resolve) => {
            const newWindow = window.open(doc.link, "_blank");
            if (newWindow) {
                newWindow.addEventListener("load", () => {
                    newWindow.print();
                    resolve();
                });
            }
            else {
                resolve(); // Resolve immediately if window couldn't open (e.g., popup blocker)
            }
        });
        // Open and print each PDF, waiting for each to finish
        for (const doc of selectedPDFs) {
            await openAndPrintPDF(doc);
        }
        // Call onNext after all PDFs are opened and printed
        onNext();
    };
    return (_jsxs(Paper, { className: "!p-6 w-full flex flex-col gap-4", children: [_jsx("a", { className: "hidden", target: "_blank", ref: ahmedtag }), _jsxs(Box, { component: "form", noValidate: true, autoComplete: "off", 
                /*  onSubmit={handleSubmit(onSubmit)} */
                className: "grid grid-rows-1 grid-cols-1 lg:grid-cols-2 gap-4", children: [_jsxs(Box, { className: "flex flex-col gap-4", children: [_jsx(Box, { className: "flex justify-between", children: _jsx(Typography, { id: "modal-modal-title", variant: "h6", component: "h2", children: "fiche des informations" }) }), _jsx(FormGroup, { children: selectedDocuments1.map((doc, index) => (_jsx(FormControlLabel, { control: _jsx(Checkbox, { checked: doc.checked, onChange: () => handleCheckboxChange1(index) }), label: doc.label }, index))) })] }), _jsxs(Box, { className: "flex flex-col gap-4", children: [_jsx(Box, { className: "flex justify-between", children: _jsx(Typography, { id: "modal-modal-title", variant: "h6", component: "h2", children: "lettre de reeducation" }) }), _jsx(FormGroup, { children: selectedDocuments2.map((doc, index) => (_jsx(FormControlLabel, { control: _jsx(Checkbox, { checked: doc.checked, onChange: () => handleCheckboxChange2(index) }), label: doc.label }, index))) })] }), _jsxs(Box, { className: "flex justify-between flex-row mt-8 content-center lg:col-span-2", children: [_jsx(Button, { className: "w-full md:w-max !px-10 !py-3 rounded-lg ", variant: "outlined", onClick: () => {
                                    onNext();
                                }, children: _jsx("p", { className: "text-sm ", children: "Passer" }) }), _jsx(Button, { type: "button", onClick: handlePrintAndNext, variant: "contained", className: "w-full md:w-max !px-10 !py-3 rounded-lg !ms-auto", children: "Suivant" })] })] })] }));
};
export default DocumentPage;
