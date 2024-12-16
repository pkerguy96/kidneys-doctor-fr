import {
  Paper,
  Box,
  Typography,
  FormControl,
  TextField,
  Button,
} from "@mui/material";

import { Controller, useForm } from "react-hook-form";
import updateItem from "../../hooks/updateItem";
import { noteoperationApiClient } from "../../services/OperationService";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  note: string;
}
const Cliniquerensignement = ({ onNext }) => {
  const queryClient = useQueryClient();
  const queryParams = new URLSearchParams(location.search);
  const patient_id = queryParams.get("id");
  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<Props>();
  const addMutation = updateItem({}, noteoperationApiClient);
  const onSubmit = async (data) => {
    try {
      addMutation.mutateAsync(
        { data, id: parseInt(patient_id) },
        {
          onSuccess: () => {
            console.log("success");
          },
          onError: () => {
            console.log("zaba");
          },
        }
      );
    } catch (error) {}
  };
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
            Renseignement clinique
          </Typography>
        </Box>
        <Box className="flex flex-col gap-4">
          <Box className="w-full flex flex-col gap-2">
            <label htmlFor="note" className="w-full">
              Note
            </label>
            <FormControl className="w-full md:flex-1">
              <Controller
                name="note"
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    id="outlined-required"
                    multiline
                    rows={3}
                    label="Note"
                    error={!!errors.note}
                    helperText={errors.note?.message}
                  />
                )}
              />
            </FormControl>
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
export default Cliniquerensignement;
