import { Button, Box } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import "../styles/menu.css";

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
          width: { xs: "100%", sm: "75%", md: "50%" },
          fontSize: { xs: "0.8rem", sm: "1rem", md: "1.2rem" },
          marginBottom: { xs: "10px", sm: "0" },
          
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
          width: { xs: "100%", sm: "75%", md: "50%" },
          fontSize: { xs: "0.8rem", sm: "1rem", md: "1.2rem" },
          marginBottom: { xs: "10px", sm: "0" },  
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
          width: { xs: "100%", sm: "75%", md: "50%" },
          fontSize: { xs: "0.8rem", sm: "1rem", md: "1.2rem" },
          marginBottom: { xs: "10px", sm: "0" },
        }}
        onClick={() => navigate('/finalizados')}
      >
        Finalizados
      </Button>
    </Box>
  );
};

export default StateButtons;
