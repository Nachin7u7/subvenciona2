import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  FormHelperText,
  RadioGroup,
  FormControlLabel,
  Radio,
  Typography,
  Grid,
} from '@mui/material';
import { Formik, Form} from 'formik';
import * as Yup from 'yup';

const horasDisponibles = [
  { value: '09:00', label: '09:00 AM', disponible: true },
  { value: '10:00', label: '10:00 AM', disponible: false },
  { value: '11:00', label: '11:00 AM', disponible: true },
  { value: '12:00', label: '12:00 PM', disponible: true },
  { value: '13:00', label: '01:00 PM', disponible: false },
];

const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);

const reservaSchema = Yup.object().shape({
  zona: Yup.string().required('Campo obligatorio'),
  estacion: Yup.string().required('Campo obligatorio'),
  combustible: Yup.string().required('Campo obligatorio'),
  fecha: Yup.string().required('Campo obligatorio'),
  hora: Yup.string().required('Selecciona una hora'),
});

const FichaReserva = ({ open, onClose }) => {
  const handleSubmit = (values) => {
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Grid container justifyContent="space-between">
          <Grid item>
            <Typography variant="subtitle2">#12345</Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6">Ficha de gasolina</Typography>
          </Grid>
        </Grid>
      </DialogTitle>
      <Formik
        initialValues={{
          zona: '',
          estacion: '',
          combustible: '',
          fecha: '',
          hora: '',
        }}
        validationSchema={reservaSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, setFieldValue }) => (
          <Form>
            <DialogContent dividers>
              <FormControl fullWidth margin="normal" error={touched.zona && !!errors.zona}>
                <InputLabel>Zona</InputLabel>
                <Select name="zona" value={values.zona} onChange={handleChange} label="Zona">
                  <MenuItem value="norte">Norte</MenuItem>
                  <MenuItem value="sur">Sur</MenuItem>
                  <MenuItem value="este">Este</MenuItem>
                  <MenuItem value="oeste">Oeste</MenuItem>
                </Select>
                <FormHelperText>{touched.zona && errors.zona}</FormHelperText>
              </FormControl>

              <FormControl fullWidth margin="normal" error={touched.estacion && !!errors.estacion}>
                <InputLabel>Estación de gasolina</InputLabel>
                <Select name="estacion" value={values.estacion} onChange={handleChange} label="Estación">
                  <MenuItem value="estacion1">Estación 1</MenuItem>
                  <MenuItem value="estacion2">Estación 2</MenuItem>
                </Select>
                <FormHelperText>{touched.estacion && errors.estacion}</FormHelperText>
              </FormControl>

              <FormControl fullWidth margin="normal" error={touched.combustible && !!errors.combustible}>
                <InputLabel>Tipo de combustible</InputLabel>
                <Select name="combustible" value={values.combustible} onChange={handleChange} label="Tipo de combustible">
                  <MenuItem value="diesel">Diesel</MenuItem>
                  <MenuItem value="gas">Gas</MenuItem>
                </Select>
                <FormHelperText>{touched.combustible && errors.combustible}</FormHelperText>
              </FormControl>

              <FormControl fullWidth margin="normal" error={touched.fecha && !!errors.fecha}>
                <InputLabel>Fecha</InputLabel>
                <Select name="fecha" value={values.fecha} onChange={handleChange} label="Fecha">
                  <MenuItem value={today.toISOString().split('T')[0]}>
                    {today.toLocaleDateString()}
                  </MenuItem>
                  <MenuItem value={tomorrow.toISOString().split('T')[0]}>
                    {tomorrow.toLocaleDateString()}
                  </MenuItem>
                </Select>
                <FormHelperText>{touched.fecha && errors.fecha}</FormHelperText>
              </FormControl>

              <FormControl component="fieldset" margin="normal" fullWidth error={touched.hora && !!errors.hora}>
                <Typography variant="subtitle1" gutterBottom>Hora</Typography>
                <RadioGroup
                  name="hora"
                  value={values.hora}
                  onChange={(e) => setFieldValue('hora', e.target.value)}
                  row
                >
                  <Grid container spacing={2}>
                    {horasDisponibles.map((hora) => (
                      <Grid item xs={4} key={hora.value}>
                        <FormControlLabel
                          value={hora.value}
                          control={
                            <Radio
                              disabled={!hora.disponible}
                              sx={{
                                color: hora.disponible ? 'grey.400' : 'grey.600',
                              }}
                            />
                          }
                          label={hora.label}
                          sx={{
                            backgroundColor: hora.disponible ? '#f0f0f0' : '#d0d0d0',
                            borderRadius: 1,
                            px: 2,
                            py: 1,
                            width: '100%',
                            m: 0,
                          }}
                        />
                      </Grid>
                    ))}
                  </Grid>
                </RadioGroup>
                <FormHelperText>{touched.hora && errors.hora}</FormHelperText>
              </FormControl>
            </DialogContent>

            <DialogActions>
              <Button onClick={onClose} color="secondary">Cancelar</Button>
              <Button type="submit" variant="contained" color="primary">
                Guardar reserva
              </Button>
            </DialogActions>
          </Form>
        )}
      </Formik>
    </Dialog>
  );
};

export default FichaReserva;
