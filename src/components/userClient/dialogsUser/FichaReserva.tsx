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
  TextField
} from '@mui/material';
import { useEffect, useState } from 'react';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';
import jsonServerInstance from '../../../api/jsonServerInstance';

const today = new Date();
const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);

const reservaSchema = Yup.object().shape({
  gas_station_id: Yup.number().required('Campo obligatorio'),
  customer_data_id: Yup.number().required('Campo obligatorio'),
  gas_type_id: Yup.number().required('Campo obligatorio'),
  fecha: Yup.string().required('Campo obligatorio'),
  hora: Yup.string().required('Selecciona una hora'),
  quantity_lt: Yup.number().required('Cantidad requerida').min(1),
  amount: Yup.number().required('Total requerido').min(1),
});

const FichaReserva = ({ open, onClose }) => {
  const [horasDisponibles, setHorasDisponibles] = useState([]);
  const [gasStations, setGasStations] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [gasTypes, setGasTypes] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [horasRes, estacionesRes, clientesRes, tiposRes] = await Promise.all([
          jsonServerInstance.get('/horas_disponibles'),
          jsonServerInstance.get('/gas_station_data'),
          jsonServerInstance.get('/customer_data'),
          jsonServerInstance.get('/gas_type'),
        ]);
        setHorasDisponibles(horasRes.data);
        setGasStations(estacionesRes.data);
        setClientes(clientesRes.data);
        setGasTypes(tiposRes.data);
      } catch (error) {
        console.error('Error cargando datos:', error);
      }
    };

    if (open) fetchData();
  }, [open]);

  const handleSubmit = async (values) => {
    const newTicket = {
      gas_station_id: values.gas_station_id,
      customer_data_id: values.customer_data_id,
      load_id: 1,
      ticket_number: Date.now(),
      date: `${values.fecha}T${values.hora}`,
      details: {
        gas_type_id: values.gas_type_id,
        ticket_state_id: 1,
        quantity_lt: values.quantity_lt,
        amount: values.amount,
      }
    };

    try {
      await jsonServerInstance.post('/tickets', newTicket);
      onClose();
    } catch (error) {
      console.error('Error creando ticket:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Grid container justifyContent="space-between">
          <Grid item>
            <Typography variant="subtitle2">#Reserva</Typography>
          </Grid>
          <Grid item>
            <Typography variant="h6">Ficha de gasolina</Typography>
          </Grid>
        </Grid>
      </DialogTitle>
      <Formik
        initialValues={{
          gas_station_id: '',
          customer_data_id: '',
          gas_type_id: '',
          fecha: '',
          hora: '',
          quantity_lt: '',
          amount: '',
        }}
        validationSchema={reservaSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, handleChange, setFieldValue }) => (
          <Form>
            <DialogContent dividers>
              <FormControl fullWidth margin="normal" error={touched.gas_station_id && !!errors.gas_station_id}>
                <InputLabel>Estación de gasolina</InputLabel>
                <Select name="gas_station_id" value={values.gas_station_id} onChange={handleChange} label="Estación">
                  {gasStations.map((station) => (
                    <MenuItem key={station.id} value={station.id}>{station.gas_station_name}</MenuItem>
                  ))}
                </Select>
                <FormHelperText>{touched.gas_station_id && errors.gas_station_id}</FormHelperText>
              </FormControl>

              <FormControl fullWidth margin="normal" error={touched.customer_data_id && !!errors.customer_data_id}>
                <InputLabel>Cliente</InputLabel>
                <Select name="customer_data_id" value={values.customer_data_id} onChange={handleChange} label="Cliente">
                  {clientes.map((c) => (
                    <MenuItem key={c.id} value={c.id}>{c.license} - {c.car_plate}</MenuItem>
                  ))}
                </Select>
                <FormHelperText>{touched.customer_data_id && errors.customer_data_id}</FormHelperText>
              </FormControl>

              <FormControl fullWidth margin="normal" error={touched.gas_type_id && !!errors.gas_type_id}>
                <InputLabel>Tipo de combustible</InputLabel>
                <Select name="gas_type_id" value={values.gas_type_id} onChange={handleChange} label="Tipo">
                  {gasTypes.map((t) => (
                    <MenuItem key={t.id} value={t.id}>{t.name}</MenuItem>
                  ))}
                </Select>
                <FormHelperText>{touched.gas_type_id && errors.gas_type_id}</FormHelperText>
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
                              sx={{ color: hora.disponible ? 'grey.400' : 'grey.600' }}
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

              <TextField
                fullWidth
                margin="normal"
                label="Cantidad (litros)"
                name="quantity_lt"
                type="number"
                value={values.quantity_lt}
                onChange={handleChange}
                error={touched.quantity_lt && !!errors.quantity_lt}
                helperText={touched.quantity_lt && errors.quantity_lt}
              />

              <TextField
                fullWidth
                margin="normal"
                label="Total a pagar ($)"
                name="amount"
                type="number"
                value={values.amount}
                onChange={handleChange}
                error={touched.amount && !!errors.amount}
                helperText={touched.amount && errors.amount}
              />
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