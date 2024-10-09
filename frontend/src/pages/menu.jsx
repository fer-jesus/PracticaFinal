//import React from 'react';
import { Container, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import StateButtons from "../components/StateButtons";
import "../styles/menu.css";
import eduSuperior from "../assets/EduSuperior.png";

const MenuPage = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/login"); // Redirige a la página de login
  };

  return (
    <div className="menu-container">
      <Container component="main" maxWidth="xs">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <img src={eduSuperior} alt="Logo Bufete" className="edu-superior" />
          <Button
            variant="contained"
            onClick={handleLogout}
            sx={{
              position: "absolute",
              top: 0,
              left: 45,
              margin: 4,
              backgroundColor: "#ff0000",
              fontWeight: "bold",
              fontSize: "12px",
              padding: "6px 12px",
              "&:hover": {
                backgroundColor: "#cc0000",
              },
            }}
          >
            Cerrar Sesión
          </Button>

          {/* <Typography variant="h3" sx={{ marginBottom: 2 }}>Elija el estado</Typography> */}
          <StateButtons
            buttonSize="large"
            buttonStyle={{
              padding: "16px 32px",
              fontSize: "1.9rem",
              minWidth: "200px",
              fontWeight: "bold",
            }}
          />
        </Box>
      </Container>
    </div>
  );
};

export default MenuPage;
