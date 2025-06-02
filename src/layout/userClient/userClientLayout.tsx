import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { Box, Typography } from '@mui/material';

const UserClientLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />

      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {/* Título principal fijo */}
        <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
          Gasolina Ya
        </Typography>
        <Outlet />
      </Box>
    </Box>
  );
};

export default UserClientLayout;