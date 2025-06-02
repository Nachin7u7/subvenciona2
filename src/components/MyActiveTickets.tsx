import { Box, Typography, Grid } from '@mui/material';
import { useEffect, useState } from 'react';
import FichaCard from '../components/userClient/cards/fichaCard';
import FichaCancel from '../components/userClient/dialogsUser/FichaCancel';
import { getTicketsByCustomer, deleteTicket } from '../services/ticketService';
import type { GetTicketsByCustomerResponse } from '../services/models/ticketModels';

const MyActiveTickets = () => {
  const [fichas, setFichas] = useState<GetTicketsByCustomerResponse[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [fichaSeleccionada, setFichaSeleccionada] = useState<GetTicketsByCustomerResponse | null>(null);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const tickets = await getTicketsByCustomer(1)
        console.log("tickets por susuario",tickets);
        setFichas(tickets.filter((t: GetTicketsByCustomerResponse) => t.details.ticketState !== "Cancelado"));
      } catch (error) {
        console.error('Error al obtener fichas:', error);
      }
    };
    fetchTickets();
  }, []);

  const handleCancelarClick = (ticket: GetTicketsByCustomerResponse) => {
    setFichaSeleccionada(ticket);
    setDialogOpen(true);
  };

  const handleConfirmCancel = async () => {
    if (fichaSeleccionada) {
      try {
        await deleteTicket(fichaSeleccionada.id,false);
        setFichas((prev) =>
          prev.map((f) =>
            f.id === fichaSeleccionada.id ? { ...f, status: 'Cancelada' } : f
          )
        );
      } catch (error) {
        console.error('Error al cancelar ficha', error);
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
              estacion={ficha.gasStation.gasSatationName}
              zona={ficha.gasStation.address}
              numeroFicha={ficha.ticketNumber}
              estado={ficha.details.ticketState}
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