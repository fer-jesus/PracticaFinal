import React from 'react';
import { Button, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const StateButtons = () => {
  const navigate = useNavigate();
    const location = useLocation();


    const getButtonStyle = (path) => {
        if (location.pathname === path) {
          return { backgroundColor: '#114B79' }; 
        } else {
          return { backgroundColor: '#2196F3' }; 
        }
      };
  
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        gap: 2
      }}
    >
        <Button
            variant="contained"
            sx={getButtonStyle('/activos')}
            onClick={() => navigate('/activos')}
        >
            Activos
        </Button>
        <Button
            variant="contained"
            sx={getButtonStyle('/pendientes')}
            onClick={() => navigate('/pendientes')}
        >
            Pendientes
        </Button>
        <Button
            variant="contained"
            sx={getButtonStyle('/finalizados')}
            onClick={() => navigate('/finalizados')}
        >
            Finalizados
        </Button>
    </Box>
  );
};

export default StateButtons;