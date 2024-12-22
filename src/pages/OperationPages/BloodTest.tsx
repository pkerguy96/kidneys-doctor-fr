import {
  Paper,
  Box,
  Typography,
  FormControl,
  Autocomplete,
  TextField,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CACHE_KEY_BloodtestList } from "../../constants";
import addGlobal from "../../hooks/addGlobal";
import {
  bloodTestApiClient,
  bloodTestpreflistApiClient,
  BloodTestProps,
} from "../../services/BloodTest";
import { useLocation } from "react-router";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
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
interface Props {
  blood_test: string[];
}
const BloodTest = ({ onNext }) => {
  const location = useLocation();
  const [analyse, setAnalyse] = useState<number>(NaN);
  const [fields, setFields] = useState([]);
  const queryParams = new URLSearchParams(location.search);
  const patient_id = queryParams.get("id");
  const operationId = queryParams.get("operation_id");
  const [row, setRow] = useState<any>();
  const { handleSubmit, control, watch } = useForm<Props>();
  const addMutation = addGlobal({} as BloodTestProps, bloodTestApiClient);
  const { data: BoneDoctorBloodTests, isLoading } = getGlobal(
    {},
    CACHE_KEY_BloodtestList,
    bloodTestpreflistApiClient,
    undefined
  );
  if (!patient_id) {
    return (
      <Typography variant="h6" color="error" align="center">
        Quelque chose s'est mal passé, veuillez refaire les étapes, si cela ne
        fonctionne pas, signalez ce bug au développeur.
      </Typography>
    );
  }

  /*   const analyseChange = (event: SelectChangeEvent) => {
    setAnalyse(event.target.value);
  }; */

  const handleAddRow = () => {
    if (Number.isNaN(analyse)) return;
    setFields((old) => [...old, BoneDoctorBloodTests[analyse]]);
    setAnalyse(NaN);
  };

  const handleRemoveRow = (index) => {
    setFields((old) => old.filter((current, _index) => _index !== index));
  };

  const onSubmit = async (data) => {
    const formatedData: any = {
      patient_id: patient_id,
      operation_id: operationId ? parseInt(operationId) : null,
      blood_test: fields,
    };
    console.log(formatedData);

    try {
      addMutation.mutateAsync(formatedData, {
        onSuccess: (data: any) => {
          setRow(data.data);
        },
        onError: (error) => {
          console.log(error);
        },
      });
    } catch (error) {}
  };
  // const rows = watch("blood_test") || [];
  const FormattedDate = new Date().toISOString().split("T")[0].split("-");
  useEffect(() => {
    if (!row) return;
    Print("#page", () => {
      onNext();
    });
  }, [row]);
  if (isLoading) return <LoadingSpinner />;
  return (
    <Paper className="!p-6 w-full flex flex-col gap-4">
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
        className="flex gap-6 flex-col"
      >
        <Box className="flex justify-center">
          <Typography
            id="modal-modal-title"
            component="h2"
            className="text-center !text-2xl font-bold"
          >
            Sélection d'analyses
          </Typography>
        </Box>
        <Box className="flex gap-4 flex-col">
          <Box className="w-full flex flex-wrap items-center gap-4">
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
                  <TableCell width={200}>Délai</TableCell>
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
                        {carry.DELAI === null || carry.DELAI === ""
                          ? "n/a"
                          : carry.DELAI}
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
              Nom & Prenom: {row?.nom} {row?.prenom}
            </p>
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
export default BloodTest;
