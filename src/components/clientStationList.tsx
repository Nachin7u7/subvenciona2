import { useEffect, useState } from 'react';
import { Box, Typography, Tabs, Tab, Grid, Snackbar, Alert } from '@mui/material';
import StationCard from './userClient/cards/StationCard';
import FichaCancel from './userClient/dialogUser/FichaCancel';
import { getGasStations } from '../services/gasStationService';
import { deleteTicket } from '../services/ticketService'; 

interface GetGasStationResponse {
  id: number;
  gasSatationName: string;
  openTime: string;
  closeTime: string;
  serviceDays: string[];
  totalTickets: number;
  currentTicket: number;
  address: string;
  zone: string;
}

const zonas = ['Centro', 'Miraflores', 'Sopocachi', 'Zona Sur', 'El Alto'];

const ClientStationList = () => {
  const [zonaSeleccionada, setZonaSeleccionada] = useState('Centro');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [fichaNumero, setFichaNumero] = useState<number | null>(null);
  const [gasStations, setGasStations] = useState<GetGasStationResponse[]>([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const data = await getGasStations();
        setGasStations(data);
      } catch (err) {
        setSnackbar({
          open: true,
          message: 'Error al cargar estaciones de servicio.',
          severity: 'error',
        });
      }
    };

    fetchStations();
  }, []);

  const handleOpenDialog = (ticketNumber: number) => {
    setFichaNumero(ticketNumber);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFichaNumero(null);
  };

  const handleConfirmCancel = async () => {
    if (fichaNumero !== null) {
      try {
        await deleteTicket(fichaNumero);
        setSnackbar({
          open: true,
          message: 'Ficha cancelada exitosamente.',
          severity: 'success',
        });
      } catch (error) {
        setSnackbar({
          open: true,
          message: 'Error al cancelar la ficha.',
          severity: 'error',
        });
      } finally {
        handleCloseDialog();
      }
    }
  };

 return (
    <Box sx={{ p: 3, fontFamily: '"Quicksand", sans-serif', backgroundColor: '#F5FBFF', minHeight: '100dvh' }}>
      <Box display="flex" alignItems="center" mb={2}>
        <Typography
          variant="h6"
          mr={2}
          sx={{ color: '#1DA1F2', fontWeight: 'bold' }}
        >
          Zona:
        </Typography>
        <Tabs
          value={zonaSeleccionada}
          onChange={(_, newValue) => setZonaSeleccionada(newValue)}
          textColor="primary"
          indicatorColor="primary"
          sx={{
            '& .MuiTab-root': {
              fontFamily: '"Quicksand", sans-serif',
              color: '#1DA1F2',
              fontWeight: 'bold',
            },
          }}
        >
          {zonas.map((zona) => (
            <Tab key={zona} label={zona} value={zona} />
          ))}
        </Tabs>
      </Box>

      <Grid container spacing={3}>
        {gasStations
          .filter((station) => station.zone === zonaSeleccionada)
          .map((station) => (
            <Grid  xs={12} sm={6} md={6} lg={4} key={station.id}>
              <StationCard
                id={station.id}
                nombre={station.gasSatationName}
                imagen={`https://via.placeholder.com/400x200?text=${station.gasSatationName}`}
                horario={`${station.openTime} - ${station.closeTime}`}
                dias={station.serviceDays.join(', ')}
                fichas={station.totalTickets}
                fichaActual={station.currentTicket}
                direccion={station.address}
                onClick={() => handleOpenDialog(station.currentTicket)}
              />
            </Grid>
          ))}
      </Grid>

      <FichaCancel
        open={dialogOpen}
        onClose={handleCloseDialog}
        onConfirm={handleConfirmCancel}
        fichaNumero={fichaNumero ?? 0}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
      >
        <Alert
          severity={snackbar.severity as 'success' | 'error'}
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ClientStationList;