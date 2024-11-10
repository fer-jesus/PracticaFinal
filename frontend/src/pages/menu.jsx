import { Container, Box, Typography, IconButton, Menu, MenuItem } from "@mui/material";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { useState, useContext } from "react";
import StateButtons from "../components/StateButtons";
import { UserContext } from "../components/UserContext";
import { useNavigate } from "react-router-dom";
import "../styles/menu.css";
import eduSuperior from "../assets/EduSuperior.png";

const MenuPage = () => {
  const { nombreCompleto, logoutUser } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();

 
  const handleLogout = () => {
    logoutUser();
    navigate("/login"); // Redirige a la página de login
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div className="menu-container">
      <Container component="main" maxWidth="md">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: { xs: "16px", sm: "24px", md: "32px" },
            minHeight: "100vh",
            maxWidth: "100vw",
          }}
        >
          <img src={eduSuperior} alt="Logo Bufete" className="edu-superior" />
          
          <Box sx={{ position: "absolute", top: 16, right: 16, display: "flex", alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold", marginRight: 1 }}>
              {nombreCompleto}
            </Typography>
            <IconButton onClick={handleMenu} color="inherit">
              <AccountCircle fontSize="large" />
            </IconButton>
          </Box>

          {/* Menu desplegable */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleClose}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <MenuItem onClick={handleLogout}>Cerrar Sesión</MenuItem>
          </Menu>
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
