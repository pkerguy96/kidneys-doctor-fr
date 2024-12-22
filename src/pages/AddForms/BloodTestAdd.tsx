import {
  Paper,
  Box,
  FormControl,
  TextField,
  Button,
  Autocomplete,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useState } from "react";
import LoadingSpinner from "../../components/LoadingSpinner";
import addGlobal from "../../hooks/addGlobal";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddIcon from "@mui/icons-material/Add";
import { CACHE_KEY_BloodtestList } from "../../constants";
import {
  bloodTestApiClient,
  bloodTestpreflistApiClient,
  BloodTestProps,
} from "../../services/BloodTest";
import { useNavigate } from "react-router";
import getGlobal from "../../hooks/getGlobal";
import PatientSearchAutocomplete from "../../components/PatientSearchAutocomplete";

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
const BloodTestAdd = () => {
  const navigate = useNavigate();
  const [patient, setPatient] = useState<any>();
  const [analyse, setAnalyse] = useState<number>(NaN);
  const [fields, setFields] = useState([]);
  const { data: BoneDoctorBloodTests, isLoading } = getGlobal(
    {},
    CACHE_KEY_BloodtestList,
    bloodTestpreflistApiClient,
    undefined
  );
  const addMutation = addGlobal({} as BloodTestProps, bloodTestApiClient);

  const handleAddRow = () => {
    if (Number.isNaN(analyse)) return;
    setFields((old) => [...old, BoneDoctorBloodTests[analyse]]);
    setAnalyse(NaN);
  };

  const handleRemoveRow = (index) => {
    setFields((old) => old.filter((current, _index) => _index !== index));
  };

  const onSubmit = (e: any) => {
    e.preventDefault();
    const formdata = {
      operation_id: null,
      patient_id: patient.id,
      blood_test: fields,
    };

    try {
      addMutation.mutateAsync(formdata, {
        onSuccess: (data: any) => {
          Print("#page", () => navigate("/bloodtest"));
        },
        onError: (error) => {
          console.log(error);
        },
      });
    } catch (error) {}
  };
  const FormattedDate = new Date().toISOString().split("T")[0].split("-");

  if (isLoading) return <LoadingSpinner />;
  return (
    <Paper className="p-4">
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={onSubmit}
        className="w-full flex flex-col gap-6"
      >
        <Box className="flex justify-center">
          <Typography
            id="modal-modal-title"
            component="h2"
            className="text-center !text-2xl font-bold"
          >
            Ajouter un bilan sanguin
          </Typography>
        </Box>

        <Box className="w-full flex flex-col gap-4">
          <Box className="w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2">
            <PatientSearchAutocomplete
              setPatient={setPatient}
              label="Rechercher un patient"
            />
          </Box>
          <Box className="w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2">
            <label htmlFor="nom" className="w-full md:w-[200px]">
              Analyses
            </label>
            <FormControl className="flex-1">
              <Autocomplete
                className="w-full"
                id="demo-autocomplete-helper"
                options={BoneDoctorBloodTests} // Array of options
                getOptionLabel={(option) => option.title} // Define how to display options
                value={BoneDoctorBloodTests[analyse] || null} // Bind selected value
                onChange={(event, newValue) => {
                  setAnalyse(
                    newValue ? BoneDoctorBloodTests.indexOf(newValue) : NaN
                  );
                }} // Handle change
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Analyses"
                    variant="outlined"
                    placeholder="Choisissez une analyse"
                  />
                )}
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
                  <TableCell width={100}>Code</TableCell>
                  <TableCell>Analyse</TableCell>
                  <TableCell width={200}>Prix</TableCell>
                  <TableCell width={60} align="center">
                    Action
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {fields.length ? (
                  fields.map((carry, index) => (
                    <TableRow key={index} className="border-t border-gray-300">
                      <TableCell>{carry.code}</TableCell>
                      <TableCell>{carry.title}</TableCell>
                      <TableCell>
                        {carry.price} {carry.price ? "MAD" : "n/a"}
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
                        Désolé, aucun analyse pour le moment.
                      </p>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
        <Box className="flex">
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
            <p className="font-semibold">Nom & Prenom: {patient?.name}</p>
          </div>
          <div className="w-full flex flex-col gap-4">
            <div className="w-full flex flex-col gap-2">
              {fields.map((details: any, index: number) => (
                <div key={index}>
                  <h3 className="font-bold">
                    {index + 1}- {details.title}
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
const autocompleteStyles = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "white",
    borderColor: "rgba(0, 0, 0, 0.23)",
    "& fieldset": {
      borderColor: "rgba(0, 0, 0, 0.23)",
    },
    "&:hover fieldset": {
      borderColor: "dark",
    },
    "&.Mui-focused fieldset": {
      borderColor: "primary.main",
    },
  },
};
export default BloodTestAdd;
