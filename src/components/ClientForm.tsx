// components/ClientForm.jsx

import { Grid, TextField } from "@mui/material";

const ClientForm = () => {
  return (
    <Grid container spacing={3} sx={{ marginTop: 2, width: '100%' }}>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Licencia"
          variant="filled"
          name="license"
        />
      </Grid>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Placa del auto"
          variant="filled"
          name="car_plate"
        />
      </Grid>
    </Grid>
  );
};

export default ClientForm;
