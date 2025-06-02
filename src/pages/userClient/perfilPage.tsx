import React from 'react';
import {
  Container,
  Typography,
  Avatar,
  Box,
  Paper,
  Grid,
} from '@mui/material';

const PerfilPage: React.FC = () => {
  const userProfile = {
    nombre: 'Juan Pérez',
    email: 'juan.perez@example.com',
    tipoUsuario: 'Cliente',
    licencia: 'ABC123456',
    placaAuto: 'XYZ-789',
    avatarUrl: '',
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Perfil
        </Typography>

        <Box display="flex" justifyContent="center" mb={3}>
          <Avatar
            alt={userProfile.nombre}
            src={userProfile.avatarUrl}
            sx={{ width: 100, height: 100 }}
          />
        </Box>

        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" color="textSecondary">
              Nombre:
            </Typography>
            <Typography variant="body1">{userProfile.nombre}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" color="textSecondary">
              Correo electrónico:
            </Typography>
            <Typography variant="body1">{userProfile.email}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" color="textSecondary">
              Tipo de usuario:
            </Typography>
            <Typography variant="body1">{userProfile.tipoUsuario}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" color="textSecondary">
              Licencia:
            </Typography>
            <Typography variant="body1">{userProfile.licencia}</Typography>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" color="textSecondary">
              Placa del auto:
            </Typography>
            <Typography variant="body1">{userProfile.placaAuto}</Typography>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default PerfilPage;