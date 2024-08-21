import React, { useState }  from "react";
import {
  Container,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  ButtonGroup,
  Button,
  IconButton,
  TextField,
  InputAdornment,
} from "@mui/material";
import {
  Visibility,
  CompareArrows,
  Search,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import StateButtons from "../components/StateButtons";
import "../styles/estados.css";

const FinalizadosPage = () => {
  const navigate = useNavigate(); // Inicializa useNavigate
  const [folders, setFolders] = useState([]); // Estado para las carpetas
  const [searchQuery, setSearchQuery] = useState(""); // Estado para la búsqueda

  const handleLogout = () => {
    // limpiar cualquier dato almacenado en localStorage o en el estado global
    navigate("/login"); // Redirige a la página de login
  };

  const handleVisualizar = (expediente) => {
    console.log("Visualizar expediente:", expediente);
  };

  const handleCambiarEstado = (expediente) => {
    console.log("Cambiar estado de:", expediente);
  };

  const filteredFolders = folders.filter((folder) =>
    folder.expediente.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="finalizados-container">
            <Container sx={{ paddingTop: 4 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Button
            variant="contained"
            color="secondary"
            onClick={handleLogout}
            sx={{ position: "absolute", top: 0, left: 45, margin: 4 }}
          >
            Cerrar Sesión
          </Button>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 2,
            }}
          >
            <Typography variant="h4" sx={{ marginBottom: 2 }}>
              Finalizados
            </Typography>
            <TextField
              label="Buscar Expediente"
              variant="outlined"
              size="small"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                width: "250px",
                backgroundColor: "#F5F5F5",
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
              InputLabelProps={{
                shrink: Boolean(searchQuery),
                style: { marginLeft: "30px" },
              }}
            />
          </Box>
          <StateButtons
            buttonSize="medium"
            buttonStyle={{
              fontSize: "0.875rem",
              padding: "6px 16px",
              minWidth: "100px",
            }}
          />
          <Box
            sx={{
              width: "100%",
              height: "50vh",
              overflowY: "auto",
              marginTop: 2,
            }}
          >
            <TableContainer component={Paper} sx={{ height: "100%" }}>
              <Table stickyHeader>
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: "25%" }}>Expediente</TableCell>
                    <TableCell sx={{ width: "20%" }}>Fecha</TableCell>
                    <TableCell sx={{ width: "35%" }}>Descripción</TableCell>
                    <TableCell sx={{ width: "15%" }}>Acciones</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredFolders.map((row, index) => (
                    <TableRow key={index}>
                      <TableCell>{row.expediente}</TableCell>
                      <TableCell>{row.fecha}</TableCell>
                      <TableCell>{row.descripcion}</TableCell>
                      <TableCell>
                        <ButtonGroup variant="contained">
                          <IconButton
                            onClick={() => handleVisualizar(row.expediente)}
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            onClick={() => handleCambiarEstado(row.expediente)}
                          >
                            <CompareArrows />
                          </IconButton>
                        </ButtonGroup>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default FinalizadosPage;
