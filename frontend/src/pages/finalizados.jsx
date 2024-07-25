import React from 'react';
import { Container, Box, Typography } from '@mui/material';
import StateButtons from '../components/StateButtons';
import "../styles/estados.css";

const FinalizadosPage = () => {
  return (
    <div className="finalizados-container">
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh'
        }}
      >
        <Typography variant="h4" sx={{ marginBottom: 2 }}>Finalizados</Typography>
        <StateButtons />
      </Box>
    </Container>
    </div>
  );
};

export default FinalizadosPage;