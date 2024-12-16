import {
  Box,
  FormControl,
  TextField,
  Button,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Autocomplete,
  Chip,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import {
  OperationPreference,
  XrayPreference,
  XrayPreferenceApiClient,
  XrayPreferencesResponse,
} from "../../services/SettingsService";
import { useSnackbarStore } from "../../zustand/useSnackbarStore";
import { AddoperationPreference } from "../../hooks/AddoperationPreference";
import { AxiosError } from "axios";
import deleteItem from "../../hooks/deleteItem";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import { useGlobalOperationPreference } from "../../hooks/getOperationPrefs";
import getGlobal from "../../hooks/getGlobal";
import { CACHE_KEY_XrayPreferences } from "../../constants";
import addGlobal from "../../hooks/addGlobal";
import LoadingSpinner from "../LoadingSpinner";
interface xrayProps {
  xray_type: string;
  price: number;
  diagnostic: string[];
}
const XraySettings = () => {
  const { showSnackbar } = useSnackbarStore();
  const { data, refetch, isLoading } = getGlobal(
    {} as XrayPreferencesResponse,
    CACHE_KEY_XrayPreferences,
    XrayPreferenceApiClient,
    undefined
  );
  const addmutation = addGlobal({}, XrayPreferenceApiClient);
  const { control, handleSubmit, reset } = useForm<xrayProps>();

  const onSubmit = async (data: xrayProps) => {
    await addmutation.mutateAsync(
      {
        xray_type: data.xray_type,
        price: data.price,
      },
      {
        onSuccess: () => {
          showSnackbar("L'Opération a été créé", "success");
          reset();
          refetch();
        },
        onError: (error: any) => {
          const message =
            error instanceof AxiosError
              ? error.response?.data?.message
              : error.message;
          showSnackbar(message, "error");
        },
      }
    );
  };
  const onDelete = async (key: number) => {
    const response = await deleteItem(key, XrayPreferenceApiClient);
    if (response) {
      refetch();
      showSnackbar("La suppression d'Opération a réussi", "success");
    } else {
      showSnackbar("La suppression d'Opération a échoué", "error");
    }
  };
  const Maladies = ["zaba", "l7wa"];
  if (isLoading) return <LoadingSpinner />;
  return (
    <Box
      className="flex flex-col w-full gap-6"
      component="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Box className="flex justify-center">
        <Typography
          id="modal-modal-title"
          component="h2"
          className="text-center !text-2xl font-medium"
        >
          Ajouter une radiographie
        </Typography>
      </Box>
      <Box className=" flex flex-col md:flex-row gap-4 flex-wrap">
        {/* <p className=" text-start font-thin  text-sm md:text-lg">
          Entrez les détails de la radiographie.
        </p> */}
        {/*      <Box className="w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center ">
          <label htmlFor="nom" className="w-full md:w-[200px]">
            Radiographie:
          </label>
          <FormControl className="w-full md:flex-1">
            <Controller
              name="diagnostic"
              control={control}
              render={({ field }) => (
                <Autocomplete
                  className="bg-white"
                  id="tags-filled"
                  options={Maladies.map((option) => option)}
                  defaultValue={""}
                  value={field.value || ""}
                  onChange={(event, newValue) => field.onChange(newValue)}
                  freeSolo
                  renderTags={(value: readonly string[], getTagProps) => (
                    <Chip variant="outlined" label={value} />
                  )}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      variant="outlined"
                      placeholder="maladies"
                      sx={autocompleteStyles}
                    />
                  )}
                />
              )}
            />
          </FormControl>
        </Box> */}
        <Box className="w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center ">
          <label htmlFor="nom" className="w-full md:w-[200px]">
            Radiographie:
          </label>
          <FormControl className="w-full md:flex-1">
            <Controller
              defaultValue=""
              name="xray_type"
              control={control}
              render={({ field }) => (
                <TextField {...field} id="xray_type" label="Radiographie" />
              )}
            />
          </FormControl>
        </Box>
        <Box className="w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center">
          <label htmlFor="price" className="w-full md:w-[200px]">
            Prix:
          </label>
          <FormControl className="w-full md:flex-1">
            <Controller
              //@ts-ignore
              defaultValue={0.0}
              name="price"
              control={control}
              render={({ field }) => (
                <TextField {...field} id="price" type="number" label="Prix" />
              )}
            />
          </FormControl>
        </Box>
      </Box>
      <Box className="flex">
        <Button
          type="submit"
          variant="contained"
          className="w-full md:w-max !px-10 !py-3 rounded-lg !ms-auto"
        >
          Ajouter
        </Button>
      </Box>
      <Box className="w-full flex flex-col gap-2 md:flex-row md:flex-wrap items-center mt-2">
        <TableContainer
          component={Paper}
          elevation={0}
          className="border border-gray-300"
        >
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead className="bg-gray-200">
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell width={200}>Prix</TableCell>
                <TableCell width={60} align="center">
                  Action
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data?.length ? (
                data.map((row, index) => (
                  <TableRow key={index} className="border-t border-gray-300">
                    <TableCell component="th" scope="row">
                      {row.xray_type}
                    </TableCell>
                    <TableCell component="th">{row.price}</TableCell>
                    <TableCell>
                      <IconButton onClick={() => onDelete(row.id)}>
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
                      Désolé, aucun radiographie pour le moment.
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
      {/* <TableContainer className="w-full max-h-[400px] flex-wrap overflow-auto border border-gray-300">
        <Table aria-label="simple table">
          <TableHead>
            <TableRow className="bg-gray-300 !rounded-2xl	sticky top-0 z-10">
              <TableCell>
                <strong>Nom de la radiographie</strong>
              </TableCell>

              <TableCell>
                <strong>Prix</strong>
              </TableCell>
              <TableCell className="w-20" />
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.map((xray: XrayPreference, index: number) => (
              <TableRow key={index}>
                <TableCell>{xray.xray_type}</TableCell>

                <TableCell>{xray.price}</TableCell>
                <TableCell className="w-20">
                  <Button
                    onClick={() => onDelete(xray.id!)}
                    className="w-max mx-auto"
                    variant="outlined"
                    color="error"
                    disabled={xray.id === undefined}
                  >
                    <DeleteOutlineIcon />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer> */}
    </Box>
  );
};
const autocompleteStyles = {
  "& .MuiOutlinedInput-root": {
    backgroundColor: "white",
    borderColor: "rgba(0, 0, 0, 0.23)",
    "& fieldset": {
      borderColor: "rgba(0, 0, 0, 0.23)", // Ensures the border is visible when not focused
    },
    "&:hover fieldset": {
      borderColor: "dark", // Darker border on hover
    },
    "&.Mui-focused fieldset": {
      borderColor: "primary.main", // Border color on focus
    },
  },
};
export default XraySettings;
