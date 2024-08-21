import React from 'react';
import { Button, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';

const StateButtons = ({ buttonSize = "medium", buttonStyle = {}}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const getButtonStyle = (path) => {
    if (location.pathname === path) {
      return { 
        backgroundColor: '#4B4B4B', // Gris oscuro
        color: '#FFFFFF',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease', // Transición suave
        ':hover': {
          backgroundColor: '#2F2F2F' // Más oscuro en hover
        }
        };
    } else {
      return { 
        backgroundColor: '#A9A9A9', // Gris claro
        color: '#FFFFFF',
        border: 'none',
        padding: '10px 20px',
        borderRadius: '8px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease', // Transición suave
        ':hover': {
          backgroundColor: '#4B4B4B' // Gris oscuro en hover
        }
       };
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
        size={buttonSize}
        sx={{
          ...getButtonStyle('/activos'),
          ...buttonStyle,
          
        }}
        onClick={() => navigate('/activos')}
      >
        Activos
      </Button>
      <Button
        variant="contained"
        size={buttonSize} 
        sx={{
          ...getButtonStyle('/pendientes'),
          ...buttonStyle,  
        }}
        onClick={() => navigate('/pendientes')}
      >
        Pendientes
      </Button>
      <Button
        variant="contained"
        size={buttonSize} 
        sx={{
          ...getButtonStyle('/finalizados'),
          ...buttonStyle,   
        }}
        onClick={() => navigate('/finalizados')}
      >
        Finalizados
      </Button>
    </Box>
  );
};

export default StateButtons;
