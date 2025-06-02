import { Card, Typography, Box, Button, Chip } from '@mui/material';

interface FichaCardProps {
  estacion: string;
  zona: string;
  numeroFicha: number;
  estado: string;
  onCancelClick: () => void;
}

const FichaCard = ({ estacion, zona, numeroFicha, estado, onCancelClick }: FichaCardProps) => {
  return (
    <Card
      variant="outlined"
      sx={{
        width: 250,
        height: 250,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        p: 2,
        m: 1,
      }}
    >
      <Box>
        <Typography variant="h6">{estacion}</Typography>
        <Typography color="textSecondary">{zona}</Typography>
        <Box mt={2}>
          <Typography>N° Ficha: {numeroFicha}</Typography>
          <Typography>Estado: {estado}</Typography>
        </Box>
      </Box>

      {estado === 'Cancelada' ? (
        <Chip label="Cancelada" color="error" variant="outlined" sx={{ alignSelf: 'center' }} />
      ) : (
        <Button
          variant="contained"
          color="error"
          fullWidth
          onClick={onCancelClick}
          disabled={estado !== 'Activa'}
        >
          Cancelar
        </Button>
      )}
    </Card>
  );
};

export default FichaCard;