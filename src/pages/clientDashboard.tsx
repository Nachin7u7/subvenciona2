import { Box, Divider } from '@mui/material';
import ClientStationList from '../components/clientStationList';
import MyActiveTickets from '../components/MyActiveTickets';

const ClientDashboard = () => {
  return (
    <Box sx={{ p: 3, height: '100vh', overflow: 'auto' }}>
      <Box sx={{ height: '50%', overflowY: 'auto', pr: 1 }}>
        <ClientStationList />
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ height: '50%', overflowY: 'auto', pr: 1 }}>
        <MyActiveTickets />
      </Box>
    </Box>
  );
};

export default ClientDashboard;