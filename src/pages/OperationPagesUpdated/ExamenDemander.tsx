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
  CACHE_KEY_ExamenWithCategory,
  CACHE_KEY_PatienttinyData,
} from "../../constants";
import { useQueryClient } from "@tanstack/react-query";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import { useNavigate } from "react-router";
import addGlobal from "../../hooks/addGlobal";
import { XrayProps, xrayApiClient } from "../../services/XrayService";
import { useSnackbarStore } from "../../zustand/useSnackbarStore";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import getGlobalById from "../../hooks/getGlobalById";
import { patientTinyDataAPIClient } from "../../services/PatientService";
import getGlobal from "../../hooks/getGlobal";
import { ExamenPreferencewithCategoriesApiClient } from "../../services/ExamenService";
import LoadingSpinner from "../../components/LoadingSpinner";
import usePrint from "../PrintGlobal";

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
  const navigate = useNavigate();
  const { print, Printable } = usePrint();
  const { data } = getGlobalById(
    {},
    CACHE_KEY_PatienttinyData,
    patientTinyDataAPIClient,
    undefined,
    parseInt(patient_id)
  );
  const { data: printables, isLoading } = getGlobal(
    {},
    CACHE_KEY_ExamenWithCategory,
    ExamenPreferencewithCategoriesApiClient,
    undefined
  );
  const examenChange = (value) => {
    setExamen(value);
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

    print(() => {
      onNext();
    });
  };
  const FormattedDate = new Date().toISOString().split("T")[0].split("-");
  if (isLoading) return <LoadingSpinner />;
  return (
    <Paper className="!p-6 w-full flex flex-col gap-4">
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={submit}
        className="flex flex-col gap-6"
      >
        <Box className="flex justify-center">
          <Typography
            id="modal-modal-title"
            component="h2"
            className="text-center !text-2xl font-bold"
          >
            Examens demandée
          </Typography>
        </Box>
        <Box className="flex flex-col items-center gap-4 flex-wrap">
          <Box className="w-full flex flex-wrap items-center gap-4">
            <FormControl className="flex-1">
              {/*  <InputLabel id="demo-simple-select-helper-label">
                Examen
              </InputLabel> */}
              {/*        <Select
                className="w-full"
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={examen}
                label="Examen"
                onChange={examenChange}
              >
                {Object.keys(printables).length > 0
                  ? Object.keys(printables).reduce((acc, header) => {
                      acc.push(
                        <ListSubheader key={`header_${header}`}>
                          {header}
                        </ListSubheader>
                      );
                      acc.push(
                        ...printables[header].map((print, index) => (
                          <MenuItem
                            key={`print_${header}_${index}`}
                            value={print}
                          >
                            {print}
                          </MenuItem>
                        ))
                      );
                      return acc;
                    }, [])
                  : [
                      <MenuItem key="no-data" disabled>
                        Aucune donnée disponible
                      </MenuItem>,
                      <MenuItem
                        key="add-data"
                        onClick={() => navigate("/Settings/Examen")}
                        style={{ color: "blue" }}
                      >
                        Ajouter des données
                      </MenuItem>,
                    ]}
              </Select> */}
              <Autocomplete
                className="w-full"
                id="demo-autocomplete-examen"
                options={Object.entries(printables).flatMap(
                  ([header, prints]: [string, string[]]) =>
                    prints.map((print) => ({ group: header, label: print }))
                )} // Flatten and structure options
                groupBy={(option) => option.group} // Group by the header
                getOptionLabel={(option) => option.label} // Display the label
                value={examen ? { group: "", label: examen } : null} // Bind selected value
                onChange={(event, newValue) => {
                  if (newValue) {
                    examenChange(newValue.label);
                  }
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Examen"
                    variant="outlined"
                    placeholder="Choisissez un examen"
                  />
                )}
                noOptionsText={
                  <div>
                    <div style={{ padding: "8px 16px" }}>
                      Aucune donnée disponible
                    </div>
                    <div
                      style={{
                        color: "blue",
                        cursor: "pointer",
                        padding: "8px 16px",
                      }}
                      onClick={() => navigate("/Settings/Examen")}
                    >
                      Ajouter des données
                    </div>
                  </div>
                }
              />
            </FormControl>
            <Button
              className="!px-4 !py-2 !min-w-max !rounded-full"
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
                    <TableCell width={60} align="center">
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fields.length ? (
                    fields.map((carry, index) => (
                      <TableRow
                        key={index}
                        className="border-t border-gray-300"
                      >
                        <TableCell>{carry.name}</TableCell>
                        <TableCell>
                          <FormControl className="w-full" size="medium">
                            <Select
                              labelId={`rows.${index}.type.label`}
                              id={`row.${index}.type`}
                              value={carry.type}
                              onChange={(e) =>
                                changeExamenType(e.target.value, index)
                              }
                            >
                              {[
                                "Sans Injection (C-)",
                                "Avec Injection (C+)",
                              ].map((radio, _index) => (
                                <MenuItem key={`radio_${_index}`} value={radio}>
                                  {radio}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => handleRemoveRow(index)}>
                            <DeleteOutlineIcon
                              color="error"
                              className="pointer-events-none"
                              fill="currentColor"
                            />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow className="border-t border-gray-300">
                      <TableCell
                        colSpan={3}
                        align="center"
                        className="!text-gray-600 p-4"
                      >
                        <p className="text-lg">
                          Désolé, aucun examen pour le moment.
                        </p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
        <Box className="flex justify-between flex-row content-center">
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
      <Printable
        name={data?.nom + " " + data?.prenom}
        items={fields}
        render={(item, index) => (
          <div key={index}>
            <h3 className="font-bold">
              {index + 1}- {item.name} {item.type}
            </h3>
          </div>
        )}
      />
      {/* <div
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
      </div> */}
    </Paper>
  );
};

export default ExamenDemander;
