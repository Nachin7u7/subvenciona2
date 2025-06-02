import React, { useState } from 'react';
import {
  Box,
  Typography,
  Tabs,
  Tab,
  Grid
} from '@mui/material';
import FichaReserva from '../../components/userClient/dialogsUser/fichaReserva';
import Sidebar from '../../layout/userClient/Sidebar';
import StationCard from '../../components/userClient/cards/StationCard';

const zonas = ['Centro', 'Miraflores', 'Sopocachi', 'Zona Sur', 'El Alto'];
const estaciones = [
  {
    id: '12345',
    nombre: 'Estación Central',
    imagen: 'https://via.placeholder.com/400x200?text=Estación+Central',
    horario: '07:00 - 19:00',
    dias: 'Lunes a Sábado',
    fichas: 120,
    fichaActual: 56,
    direccion: 'Av. 16 de Julio, La Paz',
    zona: 'Centro',
  },
  {
    id: '67890',
    nombre: 'Estación Sur',
    imagen: 'https://via.placeholder.com/400x200?text=Estación+Sur',
    horario: '08:00 - 18:00',
    dias: 'Todos los días',
    fichas: 80,
    fichaActual: 22,
    direccion: 'Calle 21, Zona Sur',
    zona: 'Zona Sur',
  },
  // Puedes agregar más estaciones aquí...
];

const ClientHome = () => {
  const [zonaSeleccionada, setZonaSeleccionada] = useState('Centro');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [fichaId, setFichaId] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleOpenDialog = (id: string) => {
    setFichaId(id);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setFichaId(null);
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Box display="flex" alignItems="center" mb={2}>
          <Typography variant="h6" mr={2}>
            Zona:
          </Typography>
          <Tabs
            value={zonaSeleccionada}
            onChange={(e, newValue) => setZonaSeleccionada(newValue)}
            textColor="primary"
            indicatorColor="primary"
          >
            {zonas.map((zona) => (
              <Tab key={zona} label={zona} value={zona} />
            ))}
          </Tabs>
        </Box>
        <Grid container spacing={3}>
          {estaciones
            .filter((e) => e.zona === zonaSeleccionada)
            .map((estacion) => (
              <Grid item xs={12} md={6} lg={4} key={estacion.id}>
                <StationCard
                  id={estacion.id}
                  nombre={estacion.nombre}
                  imagen={estacion.imagen}
                  horario={estacion.horario}
                  dias={estacion.dias}
                  fichas={estacion.fichas}
                  fichaActual={estacion.fichaActual}
                  direccion={estacion.direccion}
                  onClick={handleOpenDialog}
                />
              </Grid>
            ))}
        </Grid>
        <FichaReserva open={dialogOpen} onClose={handleCloseDialog} />
      </Box>
    </Box>
  );
};

export default ClientHome;