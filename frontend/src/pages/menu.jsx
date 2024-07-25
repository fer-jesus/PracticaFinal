import React from 'react';
import { Container, Typography, Box } from '@mui/material';
//import { useNavigate } from 'react-router-dom';
import StateButtons from '../components/StateButtons';
import "../styles/menu.css";

const MenuPage = () => {
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
          <Typography variant="h3" sx={{ marginBottom: 2 }}>Elija el estado</Typography>
          <StateButtons />
        </Box>
      </Container>
    </div>
  );
};

export default MenuPage;