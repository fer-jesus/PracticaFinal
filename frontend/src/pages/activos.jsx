import React, { useState } from "react";
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
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  InputAdornment,
} from "@mui/material";
import {
  Visibility,
  CompareArrows,
  Scanner,
  Search,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StateButtons from "../components/StateButtons";
import "../styles/estados.css";

const ActivosPage = () => {
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Estado para la búsqueda
  

  const handleLogout = () => {
    navigate("/login");
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNewFolderName("");
  };

  const handleCreateFolder = async () => {
    try {
      // Mostrar el diálogo de selección de directorios
      const directoryHandle = await window.showDirectoryPicker();
      // Crear la nueva carpeta en el directorio seleccionado
      const newFolderHandle = await directoryHandle.getDirectoryHandle(
        newFolderName,
        { create: true }
      );

      // Aquí podrías realizar alguna acción adicional si es necesario
      console.log("Nueva carpeta creada en:", newFolderHandle);

      // Agregar la nueva carpeta a la lista de folders
      setFolders([
        ...folders,
        {
          expediente: newFolderName,
          fecha: new Date().toISOString().split("T")[0],
          descripcion: "Nueva carpeta",
        },
      ]);

      // Registrar la nueva carpeta en la base de datos
      await axios.post("http://localhost:3000/register-folder", {
        expediente: newFolderName,
        fecha: new Date().toISOString().split("T")[0],
        descripcion: "Nueva carpeta",
      });

      handleClose();
    } catch (error) {
      console.error("Error al crear la carpeta:", error);
      alert("Error al crear la carpeta");
    }
  };

  const handleVisualizar = (expediente) => {
    console.log("Visualizar expediente:", expediente);
  };

  const handleCambiarEstado = (expediente) => {
    console.log("Cambiar estado de:", expediente);
  };

  const handleEscanear = (expediente) => {
    console.log("Escanear expediente:", expediente);
  };

  // Filtrado de los expedientes basado en la búsqueda
  const filteredFolders = folders.filter((folder) =>
    folder.expediente.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="activo-container">
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
              Activos
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
          <Button
            variant="contained"
            color="primary"
            onClick={handleClickOpen}
            sx={{ alignSelf: "flex-end", marginBottom: 2 }}
          >
            Nuevo
          </Button>
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
                          <IconButton
                            onClick={() => handleEscanear(row.expediente)}
                          >
                            <Scanner />
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
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Crear nueva carpeta</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Introduce el nombre de la nueva carpeta y selecciona la ubicación donde deseas guardarla.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Nombre de la carpeta"
              fullWidth
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
            />
            
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Cancelar
            </Button>
            <Button onClick={handleCreateFolder} 
            color="primary"
            disabled={!newFolderName} // Deshabilitar si no se selecciona una ruta o nombre
            >
              Crear
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
};

export default ActivosPage;
