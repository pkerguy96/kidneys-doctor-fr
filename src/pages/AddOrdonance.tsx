import {
  Paper,
  Box,
  TextField,
  Button,
  Typography,
  FormControl,
  IconButton,
} from "@mui/material";
import { items } from "../services/Medicines.json";
import AddIcon from "@mui/icons-material/Add";
import { useState, useEffect, useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import LoadingSpinner from "../components/LoadingSpinner";
import { useLocation, useNavigate } from "react-router";
import { AxiosError } from "axios";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useSnackbarStore } from "../zustand/useSnackbarStore";
import { useQueryClient } from "@tanstack/react-query";
import { CACHE_KEY_PATIENTS } from "../constants";
import patientAPIClient from "../services/PatientService";
import updateItem from "../hooks/updateItem";
import ordonanceApiClient, { Ordonance } from "../services/OrdonanceService";
import addGlobal from "../hooks/addGlobal";
import getGlobalById from "../hooks/getGlobalById";
import PatientSearchAutocomplete from "../components/PatientSearchAutocomplete";
import usePrint from "./PrintGlobal";
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
    setTimeout(() => {
      document.body.removeChild(iframe);
      callback();
    }, 1000);
  };
}
interface FormData {
  date: string;
  patient: { id: number; name: string } | null;
}
const AddOrdonanceUpdated = ({ onNext }: any) => {
  const [drugs, setDrugs] = useState([]);
  const [name, setName] = useState("");
  const [fromOperation, setFromOperation] = useState(false);
  const [optionsArray, setOptionsArray] = useState(null);
  const [iserror, setIsError] = useState(false);
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbarStore();
  const { print, Printable } = usePrint();

  const { handleSubmit, setValue, getValues, control } = useForm<FormData>({
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
    },
  });
  const Addmutation = addGlobal({} as Ordonance, ordonanceApiClient);
  const useUpdateOrdonance = updateItem<Ordonance>(
    {} as Ordonance,
    ordonanceApiClient
  );
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const id = queryParams.get("id");
  const ordonanceID = queryParams.get("ordonanceID");
  const direct = queryParams.get("direct");
  const navigate = useNavigate();

  const { data: SpecifiedPatient, isLoading: isLoading3 } = id
    ? getGlobalById(
        {},
        [CACHE_KEY_PATIENTS[0], id],
        patientAPIClient,
        undefined,
        parseInt(id)
      )
    : { data: {}, isLoading: false };

  const isAddMode = !id;

  useEffect(() => {
    if (!isAddMode) {
      if (SpecifiedPatient && id && !ordonanceID) {
        const formattedPatient = {
          id: SpecifiedPatient.id,
          name: `${SpecifiedPatient.nom} ${SpecifiedPatient.prenom}`,
        };

        setOptionsArray([formattedPatient]);
        setValue("patient", formattedPatient);
        console.log("im entered", formattedPatient);
        setFromOperation(true);
      } else if (SpecifiedPatient) {
        const formattedPatient = {
          id: SpecifiedPatient.id,
          name: `${SpecifiedPatient.nom} ${SpecifiedPatient.prenom}`,
        };

        setOptionsArray([formattedPatient]);
        setValue("patient", formattedPatient);

        const SpecifiedOrdonance = SpecifiedPatient.ordonances.find(
          (ordonance) => ordonance.id === parseInt(ordonanceID)
        );

        if (SpecifiedOrdonance) {
          setValue("date", SpecifiedOrdonance.date);

          const DrugsDetails = SpecifiedOrdonance.ordonance_details.map(
            (item) => ({
              id: item.id,
              medicine_name: item.medicine_name,
              note: item.note,
              price: "",
              type: "",
            })
          );

          setDrugs(DrugsDetails);
        }
      }
    }
  }, [SpecifiedPatient, id]);

  const onSubmit = async (data: any) => {
    data.drugs = drugs;

    if (data.drugs && data.drugs.length === 0) {
      setIsError(true);
    } else {
      const formData = {
        patient_id: data.patient.id,
        medicine: data.drugs,
        date: data.date,
      };

      let response;
      try {
        if (isAddMode || fromOperation) {
          response = await createUser(formData);
        } else {
          await editUser(formData, parseInt(ordonanceID));
        }
        queryClient.invalidateQueries({ queryKey: ["ordonance"] });
      } catch (error) {
        const message =
          error instanceof AxiosError
            ? error.response?.data?.message
            : error.message;
        showSnackbar(message, "error");
      }
    }
  };

  const createUser = async (formData: Ordonance) => {
    return await Addmutation.mutateAsync(formData, {
      onSuccess: () => {
        print(() => {
          if (direct) {
            showSnackbar("Ordonnance ajoutée avec succès.", "success");
            navigate("/Ordonnance");
          } else if (onNext) {
            onNext();
          }
        });
      },
      onError: (error: any) => {
        const message =
          error instanceof AxiosError
            ? error.response?.data?.message
            : error.message;
        showSnackbar(message, "warning");
      },
    });
  };
  const editUser = async (formData: Ordonance, ordonanceID: number) => {
    await useUpdateOrdonance.mutateAsync(
      { data: formData, id: ordonanceID },
      {
        onSuccess: () => {
          showSnackbar("Ordonnance Modifiée avec succès.", "success");
          navigate("/Ordonnance");
        },
        onError: (error: any) => {
          const message =
            error instanceof AxiosError
              ? error.response?.data?.message
              : error.message;
          showSnackbar(message, "warning");
        },
      }
    );
  };

  const handleNoteChange = (id, value) => {
    setDrugs((prevDrugs) =>
      prevDrugs.map((drug) =>
        drug.id === id ? { ...drug, note: value } : drug
      )
    );
  };

  const FormattedDate = new Date().toISOString().split("T")[0].split("-");
  const removeOrdonance = (id: any) => {
    setDrugs((old) => old.filter((e) => e.id !== id));
  };

  if (isLoading3) {
    return <LoadingSpinner />;
  }

  return (
    <Paper className="p-4">
      <Box
        component="form"
        noValidate
        autoComplete="off"
        onSubmit={handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-6"
      >
        <Box className="flex justify-center">
          <Typography
            id="modal-modal-title"
            component="h2"
            className="text-center !text-2xl font-bold"
          >
            {isAddMode ? "Ajouter une ordonance" : "Modifier l'ordonance"}
          </Typography>
        </Box>
        <Box className="w-full flex flex-col gap-4">
          <Box className="w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2">
            <label htmlFor="nom" className="w-full md:w-[160px]">
              Patient:
            </label>
            <Box className={`w-full md:flex-1 `}>
              <Controller
                name="patient"
                control={control}
                render={({ field }) => (
                  <PatientSearchAutocomplete
                    options={optionsArray || []}
                    showExternalLabel={false}
                    setPatient={field.onChange}
                    defaultValue={field.value}
                  />
                )}
              />
            </Box>
          </Box>
          <Box className="w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2">
            <label htmlFor="nom" className="w-full md:w-[160px]">
              Date:
            </label>
            <FormControl className="w-full md:flex-1">
              <Controller
                name="date"
                control={control}
                rules={{
                  validate: (value) => {
                    const selectedDate = new Date(value);
                    const currentDate = new Date();
                    return (
                      selectedDate <= currentDate ||
                      "La date ne peut pas être dans le futur."
                    );
                  },
                }}
                render={({ field }) => (
                  <TextField
                    type="date"
                    {...field}
                    id="outlined-required"
                    size="medium"
                  />
                )}
              />
            </FormControl>
          </Box>
          <Box className="w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-end md:items-center mt-2">
            <label htmlFor="nom" className="w-full md:w-[160px]">
              Médicament:
            </label>
            <Box className="w-full md:flex-1">
              <TextField
                className="w-full"
                id="outlined-basic"
                label="Medicament"
                variant="outlined"
                value={name}
                inputProps={{ list: "browsers" }}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
              <datalist id="browsers">
                {items.map((e, i) => (
                  <option key={i} value={e.name} />
                ))}
              </datalist>
            </Box>
            <Button
              className="!px-4 !py-2 !min-w-max !rounded-full"
              variant="outlined"
              onClick={() => {
                const valid =
                  name.trim() !== "" &&
                  !drugs.some(
                    (e) => e.medicine_name.toUpperCase() === name.toUpperCase()
                  );
                if (valid) {
                  const found = items.find((e) => e.name === name);
                  setDrugs([
                    ...drugs,
                    {
                      ...(found
                        ? {
                            medicine_name: found.name,
                            type: found.type,
                            price: found.price || "",
                            note: "",
                          }
                        : {
                            medicine_name: name,
                            type: "",
                            price: "",
                            note: "",
                          }),
                      id: drugs.length,
                    },
                  ]);
                }
                setName("");
              }}
            >
              <AddIcon />
            </Button>
          </Box>
          {iserror && (
            <Typography color="error" className="flex justify-center">
              S'il vous plaît, sélectionnez au moins un médicament.
            </Typography>
          )}
          <Box className="w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2">
            <TableContainer
              component={Paper}
              elevation={0}
              className="border border-gray-300"
            >
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead className="bg-gray-200">
                  <TableRow>
                    <TableCell width={300}>Nom du médicament</TableCell>
                    <TableCell>Type</TableCell>
                    <TableCell>Prix</TableCell>
                    <TableCell>Note</TableCell>
                    <TableCell width={60} align="center">
                      Action
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {drugs.length ? (
                    drugs.map((row, index) => (
                      <TableRow
                        key={index}
                        className="border-t border-gray-300"
                      >
                        <TableCell component="th" scope="row">
                          {row.medicine_name}
                        </TableCell>
                        <TableCell component="th">
                          {row.type ? row.type : "n/a"}
                        </TableCell>
                        <TableCell component="th">
                          {row.price} {row.price === "" ? "n/a" : "MAD"}
                        </TableCell>
                        <TableCell style={{ minWidth: 200 }}>
                          <TextField
                            fullWidth
                            value={row.note || ""}
                            onChange={(e) =>
                              handleNoteChange(row.id, e.target.value)
                            }
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton onClick={() => removeOrdonance(row.id)}>
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
                        colSpan={5}
                        align="center"
                        className="!text-gray-600 p-4"
                      >
                        <p className="text-lg">
                          Désolé, aucune medicament pour le moment.
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
          {!direct && !ordonanceID && (
            <Button
              className="w-full md:w-max !px-10 !py-3 rounded-lg "
              variant="outlined"
              type="button"
              onClick={() => {
                onNext();
              }}
            >
              <p className="text-sm ">Passer</p>
            </Button>
          )}
          <Button
            type="submit"
            variant="contained"
            className="w-full md:w-max !px-10 !py-3 rounded-lg !ms-auto"
          >
            {useUpdateOrdonance.isLoading ? "mise à jour..." : "Enregistrer"}
          </Button>
        </Box>
      </Box>
      <Printable
        name={getValues("patient")?.name}
        items={drugs}
        render={(item, index) => (
          <div key={index}>
            <h3 className="font-bold">
              {index + 1}- {item.medicine_name}
            </h3>
            <p className="ms-4">{item.note}</p>
          </div>
        )}
      />
    </Paper>
  );
};

export default AddOrdonanceUpdated;
