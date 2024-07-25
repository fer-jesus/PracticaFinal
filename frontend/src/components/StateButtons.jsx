import React from 'react';
import { Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const StateButtons = () => {
  const navigate = useNavigate();
  
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        gap: 2
      }}
    >
      <Button variant="contained" onClick={() => navigate('/activos')}>ACTIVOS</Button>
      <Button variant="contained" onClick={() => navigate('/pendientes')}>PENDIENTES</Button>
      <Button variant="contained" onClick={() => navigate('/finalizados')}>FINALIZADOS</Button>
    </Box>
  );
};

export default StateButtons;