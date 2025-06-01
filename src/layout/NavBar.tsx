import { AppBar, Toolbar, IconButton, CardMedia } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
interface NavbarProps {
  onMenuClick: () => void;
}

const Navbar = ({ onMenuClick }: NavbarProps) => {
  return (
    <AppBar
      position="fixed"
      sx={{ backgroundColor:"white", height:70, zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          
          onClick={onMenuClick}
          sx={{color:"black", mr: 2, display: { md: "none" } }}
        >
          <MenuIcon />
          
        </IconButton>
        <CardMedia
            component="img"
            height="70"
            image="https://sdmntprwestus.oaiusercontent.com/files/00000000-50f0-6230-ada1-9dbaa6c9417c/raw?se=2025-06-01T17%3A58%3A07Z&sp=r&sv=2024-08-04&sr=b&scid=d8c0f30e-93c7-5977-873a-2ef55e43fefc&skoid=61180a4f-34a9-42b7-b76d-9ca47d89946d&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2025-06-01T16%3A19%3A15Z&ske=2025-06-02T16%3A19%3A15Z&sks=b&skv=2024-08-04&sig=xPZGKZbOwFsmvPyxlRnN8hj9gMirXOtYb3H%2BckmW1yo%3D"
            sx={{width:70, objectFit: 'contain' }}
            alt="green iguana"
          />
      </Toolbar>
      
      
    </AppBar>
  );
};

export default Navbar; 