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
  Tooltip,
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
import usePrint from "../PrintGlobal";
import { CliniquerensignementProps } from "../OperationPagesUpdated/Cliniquerensignement";
import KeyboardBackspaceOutlinedIcon from "@mui/icons-material/KeyboardBackspaceOutlined";

interface Props {
  blood_test: string[];
}
interface BloodTestItem {
  code: string;
  title: string;
  price?: number;
  DELAI?: string | null;
}
const BloodTest: React.FC<CliniquerensignementProps> = ({ onNext, onBack }) => {
  const location = useLocation();
  const [analyse, setAnalyse] = useState<number>(NaN);
  const [fields, setFields] = useState<BloodTestItem[]>([]);
  const queryParams = new URLSearchParams(location.search);
  const patient_id = queryParams.get("id");
  const operationId = queryParams.get("operation_id");
  const [row, setRow] = useState<any>();
  const { handleSubmit } = useForm<Props>();
  const { print, Printable } = usePrint();
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

  const handleAddRow = () => {
    if (Number.isNaN(analyse)) return;
    setFields((old) => [...old, BoneDoctorBloodTests[analyse]]);
    setAnalyse(NaN);
  };

  const handleRemoveRow = (index: any) => {
    setFields((old) => old.filter((_current, _index) => _index !== index));
  };

  const onSubmit = async () => {
    const formatedData: any = {
      patient_id: patient_id,
      operation_id: operationId ? parseInt(operationId) : null,
      blood_test: fields,
    };

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

  useEffect(() => {
    if (!row) return;
    print(() => {
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
        className="flex gap-6 flex-col relative"
      >
        <Tooltip title="Retour">
          <IconButton className="!absolute -top-1 left-0" onClick={onBack}>
            <KeyboardBackspaceOutlinedIcon
              color="primary"
              className="pointer-events-none"
              fill="currentColor"
            />
          </IconButton>
        </Tooltip>
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
                      colSpan={5}
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
      <Printable
        name={row?.nom + " " + row?.prenom}
        items={fields as never[]}
        render={(item, index) => (
          <div key={index}>
            <h3 className="font-bold">
              {index + 1}- {item.title}
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
      </div> */}
    </Paper>
  );
};

export default BloodTest;
