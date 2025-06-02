// components/GasStationForm.tsx - Fixed version
import { Grid, TextField, Checkbox, FormControlLabel, Typography, Box } from "@mui/material";

interface GasStationFormProps {
  onChange: (e: React.ChangeEvent<any>) => void;
  onBlur: (e: React.FocusEvent<any>) => void;
  setFieldValue: (field: string, value: any) => void;
  values: {
    license: string;
    gasStationName: string;
    address: string;
    openTime: string;  // Changed to string
    closeTime: string; // Changed to string
    open: boolean;
    zone: number;
    serviceDays: string[]; // Fixed type
  };
  touched: {
    license?: boolean;
    gasStationName?: boolean;
    address?: boolean;
    openTime?: boolean;
    closeTime?: boolean;
    open?: boolean;
    zone?: boolean;
    serviceDays?: boolean;
  };
  errors: {
    license?: string;
    gasStationName?: string;
    address?: string;
    openTime?: string;
    closeTime?: string;
    open?: string;
    zone?: string;
    serviceDays?: string | string[];
  };
}

const daysOfWeek = [
  { value: "lunes", label: "lunes" },
  { value: "martes", label: "martes" },
  { value: "miercoles", label: "miércoles" },
  { value: "jueves", label: "jueves" },
  { value: "viernes", label: "viernes" },
  { value: "sábado", label: "sábado" },
  { value: "domingo", label: "domingo" },
];

const GasStationForm = ({ setFieldValue, onChange, onBlur, values, touched, errors }: GasStationFormProps) => {

  const handleDayChange = (day: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    let newDays: string[];

    if (event.target.checked) {
      // Add day if checked
      newDays = [...values.serviceDays, day];
    } else {
      // Remove day if unchecked
      newDays = values.serviceDays.filter(d => d !== day);
    }

    setFieldValue("serviceDays", newDays);
  };

  const isDayChecked = (day: string) => {
    return values.serviceDays.includes(day);
  };

  return (
    <Grid container spacing={3} sx={{ marginTop: 2, width: '100%' }}>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Nombre de la estación"
          variant="filled"
          name="gasStationName" // Fixed name to match Formik field
          onChange={onChange}
          onBlur={onBlur}
          value={values.gasStationName}
          helperText={touched.gasStationName && errors.gasStationName}
          error={touched.gasStationName && Boolean(errors.gasStationName)}
        />
      </Grid>
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
      <Grid size={12}>
        <TextField
          fullWidth
          label="Dirección"
          variant="filled"
          name="address"
          onChange={onChange}
          onBlur={onBlur}
          value={values.address}
          helperText={touched.address && errors.address}
          error={touched.address && Boolean(errors.address)}
        />
      </Grid>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Zona"
          type="number"
          variant="filled"
          name="zone"
          onChange={onChange}
          onBlur={onBlur}
          value={values.zone}
          helperText={touched.zone && errors.zone}
          error={touched.zone && Boolean(errors.zone)}
        />
      </Grid>
      <Grid size={6}>
        <FormControlLabel
          control={
            <Checkbox
              checked={values.open}
              onChange={onChange}
              name="open"
            />
          }
          label="Abierto actualmente"
        />
      </Grid>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Hora de apertura"
          type="time"
          variant="filled"
          name="openTime" // Fixed name to match Formik field
          onChange={onChange}
          onBlur={onBlur}
          value={values.openTime}
          helperText={touched.openTime && errors.openTime}
          error={touched.openTime && Boolean(errors.openTime)}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid size={6}>
        <TextField
          fullWidth
          label="Hora de cierre"
          type="time"
          variant="filled"
          name="closeTime" // Fixed name to match Formik field
          onChange={onChange}
          onBlur={onBlur}
          value={values.closeTime}
          helperText={touched.closeTime && errors.closeTime}
          error={touched.closeTime && Boolean(errors.closeTime)}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>

      <Grid size={12}>
        <Typography
          sx={{ fontWeight: '600', fontSize: '1.2rem', color: "#242424", marginBottom: 1 }}
          variant="h5"
          component="h4"
          gutterBottom
        >
          Seleccione sus Días de Atención:
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
          {/* First row - weekdays */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            {daysOfWeek.slice(0, 5).map(({ value, label }) => (
              <FormControlLabel
                key={value}
                control={
                  <Checkbox
                    checked={isDayChecked(value)}
                    onChange={handleDayChange(value)}
                    name={`serviceDays.${value}`}
                  />
                }
                label={label}
              />
            ))}
          </Box>
          
          {/* Second row - weekend */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            {daysOfWeek.slice(5).map(({ value, label }) => (
              <FormControlLabel
                key={value}
                control={
                  <Checkbox
                    checked={isDayChecked(value)}
                    onChange={handleDayChange(value)}
                    name={`serviceDays.${value}`}
                  />
                }
                label={label}
              />
            ))}
          </Box>
        </Box>

        {touched.serviceDays && errors.serviceDays && (
          <Typography color="error" variant="body2" sx={{ mt: 1 }}>
            {Array.isArray(errors.serviceDays) ? errors.serviceDays.join(', ') : errors.serviceDays}
          </Typography>
        )}
      </Grid>
    </Grid>
  );
};

export default GasStationForm;
