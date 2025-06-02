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

interface FichaCancelProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fichaNumero: number;
}

const FichaCancel = ({ open, onClose, onConfirm, fichaNumero }: FichaCancelProps) => {
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
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancelar
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Sí, cancelar ficha
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FichaCancel;