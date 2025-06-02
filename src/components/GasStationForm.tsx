// components/GasStationForm.jsx
import { Grid, TextField, Checkbox, FormGroup, FormControlLabel, Typography } from "@mui/material";

const GasStationForm = () => {
  return (
    <Grid container spacing={3} sx={{ marginTop: 2, width: '100%' }}>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Nombre de la estación"
          variant="filled"
          name="gas_station_name"
        />
      </Grid>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Licencia"
          variant="filled"
          name="license"
        />
      </Grid>
      <Grid size={12}>
        <TextField
          fullWidth
          label="Dirección"
          variant="filled"
          name="address"
        />
      </Grid>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Hora de apertura"
          type="time"
          variant="filled"
          name="open_time"
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Hora de cierre"
          type="time"
          variant="filled"
          name="close_time"
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid size={12}>
      <Typography
              sx={{ fontWeight: '600', fontSize: '1.2rem', color: "#242424", marginBottom:1 }}
              variant="h5"
              component="h4"
              gutterBottom
            >
              Seleccione sus Días de Atención:
            </Typography>
        <FormGroup row>
          {["lunes", "martes", "miercoles", "jueves", "viernes", "sábado", "domingo"].map(day => (
            <FormControlLabel
              key={day}
              control={<Checkbox name="service_days" />}
              label={day}
            />
          ))}
        </FormGroup>
      </Grid>
    </Grid>
  );
};

export default GasStationForm;
