import { Box, Divider } from '@mui/material';
import ClientStationList from '../components/clientStationList';
import MyActiveTickets from '../components/MyActiveTickets';

const ClientDashboard = () => {
  return (
    <Box sx={{height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column'}}>
      <Box sx={{ flex: 1, overflowY: 'auto', minHeight: 0, pr: 1 }}>
        <ClientStationList />
      </Box>

      <Divider sx={{ my: 2 }} />

      <Box sx={{ flex: 1, overflowY: 'auto', minHeight: 0, pr: 1 }}>
        <MyActiveTickets />
      </Box>
    </Box>
  );
};

export default ClientDashboard;