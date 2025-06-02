import { Box, Typography, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import FichaCard from '../components/userClient/cards/fichaCard';
import FichaCancel from '../components/userClient/dialogsUser/FichaCancel';
import { getTicketsByUser, cancelTicket } from '../services/ticketService';

interface Ticket {
  id: number;
  stationName: string;
  zone: string;
  ticketNumber: number;
  status: 'Activa' | 'Usada' | 'Cancelada';
}

const MyActiveTickets = () => {
  const [fichas, setFichas] = useState<Ticket[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [fichaSeleccionada, setFichaSeleccionada] = useState<Ticket | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const tickets = await getTicketsByUser();
        setFichas(tickets.filter((t: Ticket) => t.status === 'Activa'));
      } catch (error) {
        console.error('Error al obtener fichas:', error);
      }
    };
    fetchTickets();
  }, []);

  const handleCancelarClick = (ticket: Ticket) => {
    setFichaSeleccionada(ticket);
    setDialogOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (fichaSeleccionada) {
      try {
        await cancelTicket(fichaSeleccionada.id);
        setFichas((prev) =>
          prev.map((f) =>
            f.id === fichaSeleccionada.id ? { ...f, status: 'Cancelada' } : f
          )
        );
      } catch (error) {
        console.error('Error al cancelar ficha');
      }
      setDialogOpen(false);
      setFichaSeleccionada(null);
    }
  };

  return (
    <Box mt={4}>
      <Typography variant="h6" gutterBottom>
        Mis Fichas Activas
      </Typography>

      <Grid container spacing={2}>
        {fichas.map((ficha) => (
          <Grid item key={ficha.id}>
            <FichaCard
              estacion={ficha.stationName}
              zona={ficha.zone}
              numeroFicha={ficha.ticketNumber}
              estado={ficha.status}
              onCancelClick={() => handleCancelarClick(ficha)}
            />
          </Grid>
        ))}
      </Grid>

      <FichaCancel
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleConfirmCancel}
        fichaNumero={fichaSeleccionada?.ticketNumber ?? 0}
      />
    </Box>
  );
};

export default MyActiveTickets;