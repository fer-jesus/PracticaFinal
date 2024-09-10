import { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
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
import DataTable from "react-data-table-component";
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
  const [selectedFolder, setSelectedFolder] = useState(null);

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

  //const pathRelativo= "C:\\Users\\JFGL\\Desktop\\Expedientes\\Activos";

  const handleCreateFolder = async () => {
    try {
      // Selección del directorio
      const directoryHandle = await window.showDirectoryPicker();


      let pathRelativo = `${directoryHandle.name}\\${newFolderName}`;

      let path = "C:\\Users\\JFGL\\Desktop\\Expedientes\\" + pathRelativo;

      // Crea la nueva carpeta en el directorio seleccionado
      const newFolderHandle = await directoryHandle.getDirectoryHandle(
        newFolderName,
        { create: true }
      );

      // Agrega la nueva carpeta a la lista de folders
      setFolders([
        ...folders,
        {
          Id_carpeta: folders.length + 1,
          Nombre_expediente: newFolderName,
          Fecha_creación: new Date().toISOString().split("T")[0],
          Descripción: "Nueva carpeta",
          handle: newFolderHandle,
          RutaExpediente: path, // Agrega la ruta completa al objeto de la carpeta
        },
      ]);

      // Registra la nueva carpeta en la base de datos
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

  
  const handleVisualizar = async (expediente) => {
    
    try {
      // Busca la carpeta seleccionada
      const folder = folders.find(
        (folder) => folder.Nombre_expediente === expediente.Nombre_expediente
      );
      if (!folder) {
        throw new Error("Carpeta no encontrada");
      }

      // Establece la carpeta seleccionada
      setSelectedFolder(folder);

      // Obtiene los archivos de la carpeta directamente desde el path del expediente
      const folderPath = folder.RutaExpediente;

      // Verifica si la ruta de la carpeta está definida
      if (!folderPath) {
        throw new Error("Ruta de la carpeta es indefinida");
      }

      // Imprimir la ruta en la consola para verificarla
      console.log("Ruta de la carpeta seleccionada:", folderPath);


      // Hacer la solicitud al backend para obtener los archivos de la carpeta
      const response = await axios.get("http://localhost:3000/files", {
        params: { expedienteNombre: expediente.Nombre_expediente }, // Pasamos la ruta como parámetro
      });

      // Asignar los archivos seleccionados y abrir el diálogo
      const files = response.data; // Los archivos recibidos del backend
      setSelectedFiles(files);
      setOpenVisualizar(true);
      localStorage.setItem("pathAbsoluto", expediente.RutaExpediente);
   

    } catch (error) {
      console.error("Error al visualizar los archivos:", error);
      alert("Error al visualizar los archivos.");
    }
  };

  const handleOpenFile = async (file) => {

    try {
      console.log("Abriendo archivo:", file);

      const pathSimple = localStorage.getItem("pathAbsoluto");
      let pathAbsoluto = pathSimple.replace(/\\/g, "\\\\");
      
    

    // Enviar el path absoluto al backend
   // Hacer la solicitud POST al servidor para enviar el path absoluto
   await axios.post('http://localhost:3000/filesPath', { pathAbsoluto });

   // Obtener la URL del archivo
   const fileUrl = `http://localhost:3000/filesOpen/${file}`;

   // Abrir el archivo en una nueva pestaña
   window.open(fileUrl, '_blank');
      
    } catch (error) {
      console.error("Error al abrir el archivo:", error);
      alert("Error al abrir el archivo.");
    }
  };

  const handleCloseVisualizar = () => {
    setOpenVisualizar(false);
    setSelectedFiles([]);
    localStorage.removeItem("pathAbsoluto");
  };

  const handleCambiarEstado = (expediente) => {
    console.log("Cambio de estado:", expediente);
  };

  const handleEscanear = (expediente) => {
    console.log("Escanear expediente:", expediente);
  };

  // Filtrado de los expedientes basado en la búsqueda
  const filteredFolders = folders.filter((folder) =>
    folder.Nombre_expediente?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Define columns for DataTable
  const columns = [
    {
      name: "Expediente",
      selector: (row) => row.Nombre_expediente,
      sortable: true,
    },
    {
      name: "Fecha",
      selector: (row) =>
        new Date(row.Fecha_creación).toISOString().split("T")[0],
      sortable: true,
    },
    {
      name: "Descripción",
      selector: (row) => row.Descripción,
      sortable: true,
    },
    {
      name: "Acciones",
      cell: (row) => (
        <ButtonGroup variant="contained">
          <IconButton onClick={() => handleVisualizar(row)}>
            <Visibility />
          </IconButton>
          <IconButton
            onClick={() => handleCambiarEstado(row.Nombre_expediente)}
          >
            <CompareArrows />
          </IconButton>

          <IconButton onClick={() => handleEscanear(row.Nombre_expediente)}>
            <Scanner />
          </IconButton>
        </ButtonGroup>
      ),
    },
  ];

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
              marginTop: 2,
            }}
          >
            <DataTable
              columns={columns}
              data={filteredFolders}
              pagination
              highlightOnHover
              fixedHeader
              fixedHeaderScrollHeight="50vh"
              responsive
              customStyles={{
                headCells: {
                  style: {
                    fontSize: "16px", // Tamaño de la fuente del encabezado
                    fontWeight: "bold", // Negrita en el encabezado
                    backgroundColor: "#f5f5f5", // Color de fondo del encabezado
                    borderBottom: "2px solid #e0e0e0", // Línea en la parte inferior del encabezado
                    textAlign: "left", // Alinea el texto a la izquierda
                  },
                },
                cells: {
                  style: {
                    fontSize: "14px", // Tamaño de la fuente de las celdas
                  },
                },
                pagination: {
                  style: {
                    borderTop: "1px solid #e0e0e0", // Línea en la parte superior de la paginación
                  },
                },
                // Elimina el triángulo de ordenamiento
                sortIcon: {
                  style: {
                    display: "none", // Oculta el ícono de triángulo
                  },
                },
              }}
            />
          </Box>
        </Box>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>Crear nueva carpeta</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Introduce el nombre de la carpeta y selecciona la ubicación donde
              deseas guardarla
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

        <Dialog
          open={openVisualizar}
          onClose={handleCloseVisualizar}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            Expediente: {selectedFolder?.Nombre_expediente}
          </DialogTitle>
          <DialogContent>
            {selectedFiles.length > 0 ? (
              <TableContainer component={Paper}>
                <Table>
                  <TableBody>
                    {selectedFiles.map((file, index) => (
                      <TableRow key={index}>
                        <TableCell>{file}</TableCell>
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
            ) : (
              <Typography variant="h6" align="center" gutterBottom>
                No hay archivos en este expediente.
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseVisualizar}  color="primary">Cerrar</Button>
          </DialogActions>
        </Dialog>
      </Container>
    </div>
  );
};
export default ActivosPage;