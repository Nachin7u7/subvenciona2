// components/ClientForm.jsx
import { Grid, TextField } from "@mui/material";

interface ClientFormProps {
  onChange: (e: React.ChangeEvent<any>) => void;
  onBlur: (e: React.FocusEvent<any>) => void;
  values: {
    license: string;
    carPlate: string;
  };
  touched: {
    license?: boolean;
    carPlate?: boolean;
  };
  errors: {
    license?: string;
    carPlate?: string;
  };
}

export const ClientForm = ({onChange,onBlur,values,touched,errors}:ClientFormProps) => {
  return (
    <Grid container spacing={3} sx={{ marginTop: 2, width: '100%' }}>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Licencia"
          variant="filled"
          name="license"
          onChange={onChange}
          onBlur={onBlur}
          value={values.license}
          helperText={touched.license && errors.license}
          error={touched.license && Boolean(errors.license)}
        />
      </Grid>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Placa del auto"
          variant="filled"
          name="car_plate"
          onChange={onChange}
          onBlur={onBlur}
          value={values.carPlate}
          helperText={touched.carPlate && errors.carPlate}
          error={touched.carPlate && Boolean(errors.carPlate)}
        />
      </Grid>
    </Grid>
  );
};

// export default ClientForm;
