import {
  Paper,
  Box,
  Typography,
  FormControl,
  Autocomplete,
  Chip,
  TextField,
  Button,
  SelectChangeEvent,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useState } from "react";
import { Controller } from "react-hook-form";
import {
  BoneDoctorBloodTests,
  CACHE_KEY_PatienttinyData,
} from "../../constants";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import addGlobal from "../../hooks/addGlobal";
import { XrayProps, xrayApiClient } from "../../services/XrayService";
import { useSnackbarStore } from "../../zustand/useSnackbarStore";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import getGlobalById from "../../hooks/getGlobalById";
import { patientTinyDataAPIClient } from "../../services/PatientService";

const printables = {
  Scanner: [
    "TDM abdominale",
    "TDM abdomino-pelve",
    "TDM uro-scanner",
    "TDM pelvienne",
    "TDM Cérébrale",
    "TDM Thoracique",
    "TDM TAP",
  ],
  IRM: [
    "IRM abdominale",
    "IRM abdomino-pelve",
    "IRM uro",
    "IRM pelvienne",
    "IRM Cérébrale",
    "IRM Thoracique",
    "IRM TAP",
  ],
  échographie: ["Échographie abdominale"],
  radio: ["AUCP"],
};
function $tempkate(opts: any) {
  const { lang, dir, size, margin, css, page } = opts;
  return `<!DOCTYPE html><html lang="${lang}"dir="${dir}"><head><meta charset="UTF-8"/><meta http-equiv="X-UA-Compatible"content="IE=edge"/><meta name="viewport"content="width=device-width, initial-scale=1.0"/><style>@page{size:${size.page};margin:${margin}}#page{width:100%}#head{height:${size.head}}#foot{height:${size.foot}}</style>${css}</head><body><table id="page"><thead><tr><td><div id="head"></div></td></tr></thead><tbody><tr><td><main id="main">${page}</main></td></tr></tbody><tfoot><tr><td><div id=foot></div></td></tr></tfoot></table></body></html>`;
}
function Print(target: any, callback: Function = () => {}) {
  const page = document.querySelector(target);

  var iframe = document.createElement("iframe");
  iframe.style.display = "none";
  document.body.appendChild(iframe);
  var iframeDoc = iframe.contentDocument || iframe?.contentWindow?.document;
  iframeDoc?.open();
  iframeDoc?.write(
    $tempkate({
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
    })
  );
  iframeDoc?.close();
  iframe.onload = function () {
    iframe?.contentWindow?.print();
    callback();
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1000);
  };
}
const ExamenDemander = ({ onNext }) => {
  const [examen, setExamen] = useState("");
  const [fields, setFields] = useState([]);
  const queryParams = new URLSearchParams(location.search);
  const patient_id = queryParams.get("id");
  const { data } = getGlobalById(
    {},
    CACHE_KEY_PatienttinyData,
    patientTinyDataAPIClient,
    undefined,
    parseInt(patient_id)
  );

  const examenChange = (event: SelectChangeEvent) => {
    setExamen(event.target.value);
  };

  const handleAddRow = () => {
    if (!examen) return;
    setFields((old) => [...old, { name: examen, type: "" }]);
    setExamen("");
  };

  const handleRemoveRow = (index) => {
    setFields((old) => old.filter((current, _index) => _index !== index));
  };

  const changeExamenType = (value, index) => {
    const newRows = [...fields].map((e, _index) => {
      if (index === _index) {
        e.type = value;
      }
      return e;
    });
    setFields(newRows);
  };
  const submit = async (e) => {
    e.preventDefault();
    if (!fields.length) return;

    Print("#page", () => {
      onNext();
    });
  };
  const FormattedDate = new Date().toISOString().split("T")[0].split("-");
  return (
    <Paper className="!p-6 w-full flex flex-col gap-4">
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={submit}
        className="flex flex-col gap-4"
      >
        <Box className="flex justify-center mb-4">
          <Typography
            id="modal-modal-title"
            component="h2"
            className="text-center !text-2xl font-bold"
          >
            Examens demandée
          </Typography>
        </Box>
        <Box className="flex flex-col items-center gap-6 flex-wrap">
          <Box className="w-full flex flex-wrap items-center gap-4">
            <FormControl className="flex-1">
              <InputLabel id="demo-simple-select-helper-label">
                Examen
              </InputLabel>
              <Select
                className="w-full"
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={examen}
                label="Examen"
                onChange={examenChange}
              >
                {Object.keys(printables).reduce((acc, header) => {
                  acc.push(
                    <ListSubheader key={`header_${header}`}>
                      {header}
                    </ListSubheader>
                  );
                  acc.push(
                    ...printables[header].map((print, index) => (
                      <MenuItem key={`print_${header}_${index}`} value={print}>
                        {print}
                      </MenuItem>
                    ))
                  );
                  return acc;
                }, [])}
              </Select>
            </FormControl>
            <Button
              sx={{ borderRadius: 16 }}
              style={{
                minWidth: 100,
              }}
              variant="outlined"
              onClick={handleAddRow}
            >
              <AddIcon />
            </Button>
          </Box>
          <Box className="w-full flex flex-col gap-2">
            <TableContainer
              component={Paper}
              elevation={0}
              className="border border-gray-300"
            >
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead className="bg-gray-200">
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell width={300}>Type</TableCell>
                    <TableCell align="center" width="120px">
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fields.map((carry, index) => (
                    <TableRow key={index} className="border-t border-gray-300">
                      <TableCell>{carry.name}</TableCell>
                      <TableCell width={300}>
                        <FormControl className="w-full" size="medium">
                          <Select
                            labelId={`rows.${index}.type.label`}
                            id={`row.${index}.type`}
                            value={carry.type}
                            onChange={(e) =>
                              changeExamenType(e.target.value, index)
                            }
                          >
                            {["Sans Injection (C-)", "Avec Injection (C+)"].map(
                              (radio, _index) => (
                                <MenuItem key={`radio_${_index}`} value={radio}>
                                  {radio}
                                </MenuItem>
                              )
                            )}
                          </Select>
                        </FormControl>
                      </TableCell>
                      <TableCell align="center" width="120px">
                        <IconButton
                          /* variant="contained" */
                          color="error"
                          onClick={() => handleRemoveRow(index)}
                        >
                          <DeleteOutlineOutlinedIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
        <Box className="flex justify-between flex-row mt-8 content-center">
          <Button
            className="w-full md:w-max !px-10 !py-3 rounded-lg "
            variant="outlined"
            onClick={() => {
              onNext();
            }}
          >
            <p className="text-sm ">Passer</p>
          </Button>
          <Button
            type="submit"
            variant="contained"
            className="w-full md:w-max !px-10 !py-3 rounded-lg !ms-auto"
          >
            Enregistrer
          </Button>
        </Box>
      </Box>
      <div
        id="page"
        className="hidden w-full flex-col gap-4 bg-white rounded-sm"
      >
        <div className="w-full flex flex-col gap-6">
          <div className="w-full flex gap-4 items-center flex-col">
            <p className="font-semibold">
              Fait a beni mellal Le {FormattedDate[0]}/{FormattedDate[1]}/
              {FormattedDate[2]}
            </p>
            <p className="font-semibold">
              Nom & Prenom: {data?.nom} {data?.prenom}
            </p>
          </div>
          <div className="w-full flex flex-col gap-4">
            <div className="w-full flex flex-col gap-2">
              {fields.map((examen: any, index: number) => (
                <div key={index}>
                  <h3 className="font-bold">
                    {index + 1}- {examen.name} {examen.type}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Paper>
  );
};

export default ExamenDemander;
