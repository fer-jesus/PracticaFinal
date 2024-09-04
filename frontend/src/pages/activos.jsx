import { useState, useEffect } from "react";
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
  IconButton,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  InputAdornment,
  Button,
} from "@mui/material";
import { Visibility, CompareArrows, Scanner, Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import StateButtons from "../components/StateButtons";
import "../styles/estados.css";

const ActivosPage = () => {
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openVisualizar, setOpenVisualizar] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [folderPath, setFolderPath] = useState(""); // Nuevo estado para la ruta completa

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await axios.get("http://localhost:3000/get-folders");
        setFolders(response.data);
      } catch (error) {
        console.error("Error al obtener las carpetas:", error);
        alert("Error al obtener las carpetas.");
      }
    };

    fetchFolders();
  }, []);

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
      // Selección del directorio
      const directoryHandle = await window.showDirectoryPicker();
  
      //hacer un metodo o función para capturar la ruta relativa de la carpeta raiz donde se va a guardar dentro de la API 
      // Construcción del path completo para la nueva carpeta
      let path = `${directoryHandle.name}/${newFolderName}`;

      //let baseDirectoryHandle = "C:\Users\JFGL\Desktop\Expedientes";
      //poner condicional que diga que solo en esta carpeta se pueda crear los expedientes 
      
      // Crear la nueva carpeta en el directorio seleccionado
      const newFolderHandle = await directoryHandle.getDirectoryHandle(newFolderName, { create: true });
      
      // Actualizar el estado de la ruta completa
      setFolderPath(path);
  
      // Agregar la nueva carpeta a la lista de folders
      setFolders([
        ...folders,
        {
          Id_carpeta: folders.length + 1,
          Nombre_expediente: newFolderName,
          Fecha_creación: new Date().toISOString().split("T")[0],
          Descripción: "Nueva carpeta",
          handle: newFolderHandle,
          Ruta: path, // Agregar la ruta completa al objeto de la carpeta
        },
      ]);
  
      // Registrar la nueva carpeta en la base de datos
      await axios.post("http://localhost:3000/register-folder", {
        expediente: newFolderName,
        fecha: new Date().toISOString().split("T")[0],
        descripcion: "Nueva carpeta",
        ruta: path, // Usar la ruta completa
      });
  
      handleClose();
    } catch (error) {
      console.error("Error al crear la carpeta:", error);
      alert("Error al crear la carpeta");
    }
  };
  

  // const handleVisualizar = (expediente) => {
  //   console.log("Visualizar:", expediente);
  // };
  const handleVisualizar = async (expediente) => {
    try {
      // Buscar la carpeta seleccionada
      const folder = folders.find((folder) => folder.Nombre_expediente === expediente.Nombre_expediente);
      if (!folder) {
        throw new Error("Carpeta no encontrada");
      }

      // Obtener el handle de la carpeta utilizando el path almacenado
      const directoryHandle = await window.showDirectoryPicker();
      const folderHandle = await directoryHandle.getDirectoryHandle(folder.Nombre_expediente);

      const files = [];
      for await (const entry of folderHandle.values()) {
        if (entry.kind === "file") {
          files.push(entry);
        }
      }

      setSelectedFiles(files);
      setOpenVisualizar(true);
    } catch (error) {
      console.error("Error al visualizar los archivos:", error);
      alert("Error al visualizar los archivos.");
    }
  };

  const handleOpenFile = async (fileHandle) => {
    try {
      const file = await fileHandle.getFile();
      const url = URL.createObjectURL(file);
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error al abrir el archivo:", error);
      alert("Error al abrir el archivo.");
    }
  };

  const handleCloseVisualizar = () => {
    setOpenVisualizar(false);
    setSelectedFiles([]);
  };
  


  const handleCambiarEstado = (expediente) => {
    console.log("Cambiar estado de:", expediente);
  };
  
  const handleEscanear = (expediente) => {
    console.log("Escanear expediente:", expediente);
  };

  // Filtrado de los expedientes basado en la búsqueda
  const filteredFolders = folders.filter((folder) =>
    folder.Nombre_expediente?.toLowerCase().includes(searchQuery.toLowerCase())
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
                  {filteredFolders.map((row) => (
                    <TableRow key={row.Id_carpeta}>
                      <TableCell>{row.Nombre_expediente}</TableCell>
                      <TableCell>{new Date(row.Fecha_creación).toISOString().split("T")[0]}</TableCell>
                      <TableCell>{row.Descripción}</TableCell>
                      <TableCell>
                        <ButtonGroup variant="contained">
                          <IconButton
                            onClick={() => handleVisualizar(row)}
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            onClick={() => handleCambiarEstado(row.Nombre_expediente)}
                          >
                            <CompareArrows />
                          </IconButton>
                          <IconButton
                            onClick={() => handleEscanear(row.Nombre_expediente)}
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
              Introduce el nombre de carpeta y selecciona la ubicación donde deseas guardarla
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Nombre de la carpeta"
              fullWidth
              variant="outlined"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              sx={{ marginTop: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button onClick={handleCreateFolder}>Crear</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openVisualizar} onClose={handleCloseVisualizar} maxWidth="sm" fullWidth>
          <DialogTitle>Expedientes {selectedFiles?.Nombre_expediente}  </DialogTitle>
          <DialogContent>
          <TableContainer component={Paper}>
          <Table>
          <TableBody>
                 
              {selectedFiles.map((file, index) => (
                <TableRow key={index}>
                  <TableCell>{file.name}</TableCell>
                  <TableCell>
                  <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleOpenFile(file)}
                        >
                          Abrir
                        </Button>
                  </TableCell>
                </TableRow>
              ))}
              </TableBody>
              </Table>
            </TableContainer>
            
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseVisualizar} color="primary">
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>

        

      </Container>
    </div>
  );
};

export default ActivosPage;
