import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Box,
  Typography,
  Divider,
} from '@mui/material';
import {
  Home as HomeIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

interface SidebarProps {
  open: boolean;
  toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ open, toggleSidebar }) => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    toggleSidebar();
  };

  return (
    <>
      <IconButton onClick={toggleSidebar} sx={{ position: 'absolute', top: 16, left: 16, zIndex: 1300 }}>
        <MenuIcon />
      </IconButton>

      <Drawer anchor="left" open={open} onClose={toggleSidebar}>
        <Box width={250} role="presentation" p={2}>
          <Typography variant="h6" gutterBottom>
            Menú
          </Typography>
          <Box
            component="img"
            src="https://via.placeholder.com/150x100?text=Gasolina"
            alt="Logo"
            sx={{ width: '100%', mb: 2 }}
          />
          <Divider />
          <List>
            <ListItem button onClick={() => handleNavigation('/')}>
              <ListItemIcon><HomeIcon /></ListItemIcon>
              <ListItemText primary="Inicio" />
            </ListItem>
            <ListItem button onClick={() => handleNavigation('/misFichas')}>
              <ListItemIcon><AssignmentIcon /></ListItemIcon>
              <ListItemText primary="Mis fichas" />
            </ListItem>
            <ListItem button onClick={() => handleNavigation('/perfil')}>
              <ListItemIcon><PersonIcon /></ListItemIcon>
              <ListItemText primary="Perfil" />
            </ListItem>
          </List>
          <Divider sx={{ mt: 2 }} />
          <List>
            <ListItem button onClick={() => console.log('Cerrar sesión')}>
              <ListItemIcon><LogoutIcon /></ListItemIcon>
              <ListItemText primary="Cerrar sesión" />
            </ListItem>
          </List>
        </Box>
      </Drawer>
    </>
  );
};

export default Sidebar;