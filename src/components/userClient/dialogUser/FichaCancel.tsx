import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useState } from 'react';
import { deleteTicket } from '../../../services/ticketService';

interface FichaCancelProps {
  open: boolean;
  onClose: () => void;
  fichaNumero: number;
  ticketId: number; // necesario para identificar el ticket a cancelar
}

const FichaCancel = ({ open, onClose, fichaNumero, ticketId }: FichaCancelProps) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      await deleteTicket(ticketId, false);
      onClose();
    } catch (err) {
      setError('Ocurrió un error al cancelar la ficha.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        ¿Está seguro de cancelar la ficha N° {fichaNumero}?
        <IconButton edge="end" color="inherit" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Typography>
          Esta acción no se puede deshacer. ¿Desea continuar?
        </Typography>
        {error && <Typography color="error" sx={{ mt: 1 }}>{error}</Typography>}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary" disabled={loading}>
          Cancelar
        </Button>
        <Button onClick={handleConfirm} color="error" variant="contained" disabled={loading}>
          {loading ? 'Cancelando...' : 'Sí, cancelar ficha'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FichaCancel;