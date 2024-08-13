import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import StateButtons from '../components/StateButtons';
import "../styles/menu.css";

const MenuPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Aquí puedes limpiar cualquier dato almacenado en localStorage o en el estado global
    navigate('/login');  // Redirige a la página de login
  };


  return (
    <div className="activo-container">
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >

           {/* Botón de Cerrar Sesión */}
           <Button
            variant="contained"
            color="secondary"
            onClick={handleLogout}
            sx={{ position: 'absolute', top: 0, left: 0, margin: 2 }}
          >
            Cerrar Sesión
          </Button>

          <Typography variant="h3" sx={{ marginBottom: 2 }}>Elija el estado</Typography>
          <StateButtons />
        </Box>
      </Container>
    </div>
  );
};

export default MenuPage;