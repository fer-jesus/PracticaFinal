import React, { useState, useEffect } from "react";
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
import {
  Visibility,
  CompareArrows,
  Scanner,
  Search,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import StateButtons from "../components/StateButtons";
import "../styles/estados.css";

const ActivosPage = () => {
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // Estado para la búsqueda
  const [openVisualizar, setOpenVisualizar] = useState(false); // Estado para el modal de visualización
  const [selectedFolder, setSelectedFolder] = useState(null); // Estado para la carpeta seleccionada
  const [folderFiles, setFolderFiles] = useState([]); // Archivos de la carpeta seleccionada

  useEffect(() => {
    // Función para obtener la lista de carpetas desde la base de datos
    const fetchFolders = async () => {
      try {
        // API para obtener el directorio raíz del sistema de archivos
        const directoryHandle = await window.showDirectoryPicker();
        const folders = [];

        // Leer cada carpeta en el directorio raíz
        for await (const [name, handle] of directoryHandle) {
          if (handle.kind === "directory") {
            // Agregar la carpeta a la lista de folders
            folders.push({
              expediente: name,
              fecha: new Date().toISOString().split("T")[0],
              descripcion: "Nueva carpeta",
              handle,
            });
          }
        }

        setFolders(folders);
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
      // API que ayuda a mostrar el diálogo de selección de directorios
      const directoryHandle = await window.showDirectoryPicker();
      // Crea la nueva carpeta en el directorio seleccionado
      const newFolderHandle = await directoryHandle.getDirectoryHandle(
        newFolderName,
        { create: true }
      );

      // Agregar la nueva carpeta a la lista de folders
      setFolders([
        ...folders,
        {
          expediente: newFolderName,
          fecha: new Date().toISOString().split("T")[0],
          descripcion: "Nueva carpeta",
          handle: newFolderHandle,
        },
      ]);

      handleClose();
    } catch (error) {
      console.error("Error al crear la carpeta:", error);
      alert("Error al crear la carpeta");
    }
  };

  const handleVisualizar = async (folder) => {
    if (!folder.handle) return;

    try {
      const files = [];
      for await (const [name, handle] of folder.handle) {
        if (handle.kind === "file") {
          files.push({ name, handle });
        }
      }
      setSelectedFolder(folder);
      setFolderFiles(files);
      setOpenVisualizar(true);
    } catch (error) {
      console.error("Error al leer los archivos de la carpeta:", error);
      alert("Error al leer los archivos del expediente.");
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
    setSelectedFolder(null);
    setFolderFiles([]);
  };

  const handleCambiarEstado = async (expediente) => {
    try {
      // Seleccionar la carpeta de destino
      const newDirectoryHandle = await window.showDirectoryPicker();
  
      // Obtener el nombre de la carpeta a mover
      const folderName = expediente.handle.name;
  
      // Mover la carpeta completa
      await moveDirectory(expediente.handle, newDirectoryHandle, folderName);

      // Actualizar la lista de carpetas eliminando la carpeta movida
      setFolders((prevFolders) =>
        prevFolders.filter((folder) => folder.expediente !== expediente.expediente)
      );
  
      alert(`Expediente '${expediente.expediente}' movido exitosamente.`);
    } catch (error) {
      console.error("Error al mover el expediente:", error);
      alert(`Error al mover el expediente: ${error.message}`);
    }
  };
  
  // Función para mover una carpeta completa
  const moveDirectory = async (sourceDirHandle, targetDirHandle, folderName) => {
    // Crear un nuevo directorio en el destino
    const newDirHandle = await targetDirHandle.getDirectoryHandle(folderName, {
      create: true,
    });
  
    // Mover cada archivo o subdirectorio dentro de la carpeta
    for await (const [name, handle] of sourceDirHandle) {
      if (handle.kind === "file") {
        await moveFile(handle, newDirHandle, name);
      } else if (handle.kind === "directory") {
        await moveDirectory(handle, newDirHandle, name);
      }
    }
  
    // Eliminar la carpeta original después de mover su contenido
    await deleteDirectoryContents(sourceDirHandle);
  };
  
  // Función para mover un archivo
  const moveFile = async (fileHandle, targetDirHandle, fileName) => {
    const file = await fileHandle.getFile();
    const newFileHandle = await targetDirHandle.getFileHandle(fileName, {
      create: true,
    });
    const writable = await newFileHandle.createWritable();
    await writable.write(file);
    await writable.close();
  };
  
  // Función para eliminar el contenido de un directorio (sin eliminar la carpeta raíz)
  const deleteDirectoryContents = async (dirHandle) => {
    for await (const [name, handle] of dirHandle) {
      if (handle.kind === "file") {
        await dirHandle.removeEntry(name);
      } else if (handle.kind === "directory") {
        await deleteDirectoryContents(handle);
        await dirHandle.removeEntry(name);
      }
    }
  };
  
  

  const handleEscanear = (expediente) => {
    console.log("Escanear expediente:", expediente);
  };

  // Filtrado de los expedientes basado en la búsqueda
  const filteredFolders = folders.filter((folder) =>
    folder.expediente?.toLowerCase().includes(searchQuery.toLowerCase())
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
                            onClick={() => handleVisualizar(row)}
                          >
                            <Visibility />
                          </IconButton>
                          <IconButton
                            onClick={() => handleCambiarEstado(row)}
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
            <Button
              onClick={handleCreateFolder}
              color="primary"
              disabled={!newFolderName} // Deshabilitar si no se selecciona una ruta o nombre
            >
              Crear
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog open={openVisualizar} onClose={handleCloseVisualizar} maxWidth="sm" fullWidth>
          <DialogTitle>Expediente: {selectedFolder?.expediente}</DialogTitle>
          <DialogContent>
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    {/* <TableCell>Nombre del Archivo</TableCell>
                    <TableCell>Acciones</TableCell> */}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {folderFiles.map((file, index) => (
                    <TableRow key={index}>
                      <TableCell>{file.name}</TableCell>
                      <TableCell>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleOpenFile(file.handle)}
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
