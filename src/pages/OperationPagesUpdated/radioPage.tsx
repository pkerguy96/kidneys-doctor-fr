import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  SelectChangeEvent,
  ListSubheader,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Autocomplete,
} from "@mui/material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

import AddIcon from "@mui/icons-material/Add";
import { useState } from "react";
import Chip from "@mui/material/Chip";
import OutlinedInput from "@mui/material/OutlinedInput";
import addGlobal from "../../hooks/addGlobal";
import {
  xrayApiClient,
  XrayPreferencesByCategory,
  XrayProps,
  xraysWithCategoryApiClient,
} from "../../services/XrayService";
import { useSnackbarStore } from "../../zustand/useSnackbarStore";
import { useNavigate } from "react-router";
import { useQueryClient } from "@tanstack/react-query";
import { CACHE_KEY_XraysWithCategory } from "../../constants";
import getGlobal from "../../hooks/getGlobal";
import LoadingSpinner from "../../components/LoadingSpinner";

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
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

/* const data = {
  échographie: [
    { name: "Abdomino pelvienne", price: 200 },
    { name: "Scrotale", price: 250 },
  ],

  Cystoscopie: [
    { name: "Exploration", price: 700 },
    { name: "Ablation de sonde jj", price: 1200 },
  ],
  Gestes: [
    { name: "Biopsie prostatique", price: 300 },
    { name: "dilatation au béniquet", price: 200 },
  ],
  Urgences: [
    { name: "RA sondage vésicale", price: 800 },
    { name: "Hématurie sondage à 03 voies", price: 600 },
    { name: "CN / PNA injection IM,IV,VV", price: 750 },
  ],
}; */

const printables = {
  irm: ["Brain MRI", "Spine MRI", "Knee MRI"],
  ausp: ["Abdominal Ultrasound", "Pelvic Ultrasound", "Chest Ultrasound"],
  ecographie: [
    "Cardiac Echography",
    "Thyroid Echography",
    "Vascular Echography",
  ],
};

const RadioPage = ({ onNext }) => {
  const [radiology, setRadiology] = useState("");
  const [printable, setPrintable] = useState<string[]>([]);
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbarStore();
  const queryClient = useQueryClient();
  const queryParams = new URLSearchParams(location.search);
  const patient_id = queryParams.get("id");
  const { data, isLoading } = getGlobal(
    {} as XrayPreferencesByCategory,
    CACHE_KEY_XraysWithCategory,
    xraysWithCategoryApiClient,
    undefined
  );

  const addMutation = addGlobal({} as XrayProps, xrayApiClient, undefined);
  const radiologyChange = (value) => {
    setRadiology(value);
  };

  const printableChange = (event: SelectChangeEvent<string[]>) => {
    setPrintable(event.target.value as string[]);
  };

  const [fields, setFields] = useState([]);

  const handleAddRow = () => {
    if (!radiology) return;
    setFields((old) => [
      ...old,
      { type: radiology, name: "", price: 0, note: "" },
    ]);
    setRadiology("");
  };

  const handleRemoveRow = (index) => {
    setFields((old) => old.filter((current, _index) => _index !== index));
  };

  const changeRadiologyName = (value, type, index) => {
    const price = data[type].find((e) => e.name === value)?.price || 0;

    const newRows = [...fields].map((e, _index) => {
      if (index === _index) {
        e.price = price;
        e.name = value;
      }
      return e;
    });
    setFields(newRows);
  };

  /*  const changeRadiologyPrice = (value, index) => {
    const newRows = [...fields].map((e, _index) => {
      if (index === _index) {
        e.price = value;
      }
      return e;
    });
    setFields(newRows);
  }; */

  const changeRadiologyNote = (value, index) => {
    const newRows = [...fields].map((e, _index) => {
      if (index === _index) {
        e.note = value;
      }
      return e;
    });
    setFields(newRows);
  };

  const submit = async (e) => {
    e.preventDefault();
    const formatedxrays = [...fields].filter((carry) => carry.name);

    if (!formatedxrays.length) {
      showSnackbar("Veuillez choisir un type de radio", "error");
      return;
    }

    const formatedData: any = {
      patient_id: patient_id,
      xrays: formatedxrays,
    };

    await addMutation.mutateAsync(formatedData, {
      onSuccess: (data: any) => {
        const operationId = data.data;

        navigate(`?id=${patient_id}&operation_id=${operationId}`, {
          replace: true,
        });
        queryClient.invalidateQueries({
          queryKey: ["Waitinglist"],
          exact: false,
        });
        onNext();
      },
      onError: (error) => {
        console.log(error);
      },
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
            Diagnostic demandé
          </Typography>
        </Box>
        <Box className="flex flex-col items-center gap-6 flex-wrap">
          <Box className="w-full flex flex-wrap items-center gap-4">
            <FormControl className="flex-1">
              {/*     <InputLabel id="demo-simple-select-helper-label">
                Paraclinique
              </InputLabel> */}
              {/*    <Select
                className="w-full"
                labelId="demo-simple-select-helper-label"
                id="demo-simple-select-helper"
                value={radiology}
                label="Paraclinique"
                onChange={radiologyChange}
              >
                {Object.keys(data).length > 0
                  ? Object.keys(data).map((radio, index) => (
                      <MenuItem key={`radio_${index}`} value={radio}>
                        {radio}
                      </MenuItem>
                    ))
                  : [
                      <MenuItem key="no-data" disabled>
                        Aucune donnée disponible
                      </MenuItem>,
                      <MenuItem
                        key="add-data"
                        onClick={() => navigate("/settings/xrays")}
                        style={{ color: "blue" }}
                      >
                        Ajouter des données
                      </MenuItem>,
                    ]}
              </Select> */}
              <Autocomplete
                className="w-full"
                id="demo-autocomplete-paraclinique"
                options={Object.keys(data)} // Use Object.keys(data) as the options
                getOptionLabel={(option) => option} // Define how to display options
                value={radiology || null} // Bind selected value
                onChange={(event, newValue) => {
                  radiologyChange(newValue);
                }} // Handle change
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Paraclinique"
                    variant="outlined"
                    placeholder="Choisissez une option"
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props} key={`radio_${option}`}>
                    {option}
                  </li>
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
                      onClick={() => navigate("/settings/xrays")}
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
                    <TableCell width={300}>Operation</TableCell>

                    <TableCell>Note</TableCell>
                    <TableCell width={60} align="center">
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {fields.length > 0 ? (
                    fields.map((carry, index) => (
                      <TableRow
                        key={index}
                        className="border-t border-gray-300"
                      >
                        <TableCell>
                          <FormControl className="w-full" size="medium">
                            <InputLabel id={`rows.${index}.name.label`}>
                              {carry.type}
                            </InputLabel>
                            <Select
                              labelId={`rows.${index}.name.label`}
                              label={carry.type}
                              id={`row.${index}.name`}
                              value={carry.name}
                              onChange={(e) =>
                                changeRadiologyName(
                                  e.target.value,
                                  carry.type,
                                  index
                                )
                              }
                            >
                              {data[carry.type]?.map((radio, _index) => (
                                <MenuItem
                                  key={`radio_${_index}`}
                                  value={radio.name}
                                >
                                  {radio.name}
                                </MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </TableCell>
                        <TableCell>
                          <FormControl
                            className="w-full md:flex-1"
                            size="medium"
                          >
                            <TextField
                              id={`note_${index}`}
                              value={carry.note}
                              onChange={(e) =>
                                changeRadiologyNote(e.target.value, index)
                              }
                            />
                          </FormControl>
                        </TableCell>
                        <TableCell align="center">
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
                      <TableCell colSpan={3} align="center">
                        Désolé, aucun diagnostic pour le moment.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
            {/*  <Box className="flex justify-between items-center">
              <h2 className="font-semibold text-base text-start">
                Montant Total
              </h2>
              <span className="font-semibold text-sm text-end">
                {fields.reduce((carry, current) => carry + current.price, 0)}{" "}
                MAD
              </span>
            </Box> */}
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
              Nom & Prenom: {row?.nom}
              {row?.prenom}
            </p>
          </div>
          <div className="w-full flex flex-col gap-4">
            <div className="w-full flex flex-col gap-2">
              {printable.map((details: any, index: number) => (
                <div key={index}>
                  <h3 className="font-bold">
                    {index + 1}- {details}
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

export default RadioPage;
