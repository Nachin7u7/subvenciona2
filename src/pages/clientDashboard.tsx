import { Box, Divider, Typography } from '@mui/material';
import ClientStationList from '../components/clientStationList';
import MyActiveTickets from '../components/MyActiveTickets';

const ClientDashboard = () => {
  return (
    <Box sx={{ minHeight: '100dvh', backgroundColor: '#F5FBFF' }}>
      <Box sx={{ backgroundColor: '#1DA1F2', textAlign: 'center', py: 2 }}>
        <Typography variant="h3" sx={{ color: '#ffffff', fontFamily: 'cursive' }}>
          Gasolina Ya!
        </Typography>
      </Box>

      <Box sx={{ px: 3, pt: 3 }}>
        <ClientStationList />
      </Box>

      <Divider sx={{ my: 3 }} />

      <Box sx={{ px: 3, pb: 4, minHeight: 500}}>
        <MyActiveTickets />
      </Box>
    </Box>
  );
};

export default ClientDashboard;