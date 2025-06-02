import React from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
} from '@mui/material';

interface StationCardProps {
  id: string;
  nombre: string;
  imagen: string;
  horario: string;
  dias: string;
  fichas: number;
  fichaActual: number;
  direccion: string;
  onClick: (id: string) => void;
}

const StationCard: React.FC<StationCardProps> = ({
  id,
  nombre,
  imagen,
  horario,
  dias,
  fichas,
  fichaActual,
  direccion,
  onClick,
}) => {
  return (
    <Card sx={{ cursor: 'pointer', height: '100%' }} onClick={() => onClick(id)}>
      <CardMedia component="img" height="200" image={imagen} alt={nombre} />
      <CardContent>
        <Typography variant="h6">{nombre}</Typography>
        <Typography variant="body2">
          <strong>Horario:</strong> {horario}
        </Typography>
        <Typography variant="body2">
          <strong>Días:</strong> {dias}
        </Typography>
        <Typography variant="body2">
          <strong>Fichas totales:</strong> {fichas}
        </Typography>
        <Typography variant="body2">
          <strong>Ficha actual:</strong> {fichaActual}
        </Typography>
        <Typography variant="body2">
          <strong>Dirección:</strong> {direccion}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default StationCard;