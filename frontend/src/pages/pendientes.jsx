import React from "react";
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
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import StateButtons from "../components/StateButtons";
import "../styles/estados.css";

const PendientesPage = () => {
  const navigate = useNavigate(); // Inicializa useNavigate

  const handleLogout = () => {
    //limpiar cualquier dato almacenado en localStorage o en el estado global
    navigate("/login"); // Redirige a la página de login
  };

  // Datos quemados
  const data = [
    {
      expediente: "001",
      fecha: "2024-07-31",
      descripcion: "Descripción del expediente 001",
    },
    {
      expediente: "002",
      fecha: "2024-08-01",
      descripcion: "Descripción del expediente 002",
    },
    {
      expediente: "003",
      fecha: "2024-08-02",
      descripcion: "Descripción del expediente 003",
    },
    {
      expediente: "004",
      fecha: "2024-07-31",
      descripcion: "Descripción del expediente 004",
    },
    {
      expediente: "005",
      fecha: "2024-08-01",
      descripcion: "Descripción del expediente 005",
    },
  ];

  return (
    <div className="pendientes-container">
      <Container>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            height: "100vh",
          }}
        >
          <Button
            variant="contained"
            color="secondary"
            onClick={handleLogout}
            sx={{ position: "absolute", top: 0, left: 0, margin: 2 }}
          >
            Cerrar Sesión
          </Button>
          <Typography variant="h4" sx={{ marginBottom: 2}}>
            Pendientes
          </Typography>
          <StateButtons />

          <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Expediente</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.expediente}</TableCell>
                    <TableCell>{row.fecha}</TableCell>
                    <TableCell>{row.descripcion}</TableCell>
                    <TableCell>
                      <ButtonGroup
                        variant="contained"
                        aria-label="outlined primary button group"
                      >
                        <Button>Acción 1</Button>
                        <Button>Acción 2</Button>
                        <Button>Acción 3</Button>
                      </ButtonGroup>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Box>
      </Container>
    </div>
  );
};

export default PendientesPage;
