import { Box, Typography, Grid } from '@mui/material';
import { useState } from 'react';
import FichaCard from '../../components/userClient/cards/fichaCard';
import FichaCancel from '../../components/userClient/dialogsUser/FichaCancel';

interface Ficha {
  estacion: string;
  zona: string;
  numeroFicha: number;
  estado: 'Activa' | 'Usada' | 'Cancelada';
}

const MyFichasPage = () => {
  const [fichas, setFichas] = useState<Ficha[]>([
    { estacion: 'Estación Central', zona: 'Centro', numeroFicha: 56, estado: 'Activa' },
    { estacion: 'Estación Sur', zona: 'Zona Sur', numeroFicha: 22, estado: 'Cancelada' },
  ]);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [fichaSeleccionada, setFichaSeleccionada] = useState<number | null>(null);

  const handleCancelarClick = (numeroFicha: number) => {
    setFichaSeleccionada(numeroFicha);
    setDialogOpen(true);
  };

  const handleConfirmCancel = () => {
    if (fichaSeleccionada !== null) {
      setFichas(prev =>
        prev.map(f =>
          f.numeroFicha === fichaSeleccionada ? { ...f, estado: 'Cancelada' } : f
        )
      );
    }
    setDialogOpen(false);
    setFichaSeleccionada(null);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>
        Mis Fichas
      </Typography>

      <Grid container spacing={2}>
        {fichas.map((ficha, index) => (
          <Grid item key={index}>
            <FichaCard
              estacion={ficha.estacion}
              zona={ficha.zona}
              numeroFicha={ficha.numeroFicha}
              estado={ficha.estado}
              onCancelClick={() => handleCancelarClick(ficha.numeroFicha)}
            />
          </Grid>
        ))}
      </Grid>

      <FichaCancel
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleConfirmCancel}
        fichaNumero={fichaSeleccionada ?? 0}
      />
    </Box>
  );
};

export default MyFichasPage;