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
  MenuItem,
  Select,
} from "@mui/material";
import {
  Visibility,
  CompareArrows,
  Scanner,
  Search,
  FileUpload,
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
  const [newFolderDescription, setNewFolderDescription] = useState('');
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openVisualizar, setOpenVisualizar] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [openCambiarEstado, setOpenCambiarEstado] = useState(false);
  const [nuevoEstado, setNuevoEstado] = useState("");
  const [folderToChange, setFolderToChange] = useState(null);
  // const [destinationPath, setDestinationPath] = useState("");
  // const [openEscanear, setOpenEscanear] = useState(false);

  // useEffect(() => {
  //   const fetchFolders = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:3000/get-folders");
  //       setFolders(response.data);
  //     } catch (error) {
  //       console.error("Error al obtener las carpetas:", error);
  //       alert("Error al obtener las carpetas.");
  //     }
  //   };
    
  //   fetchFolders();
  // }, []);

  const fetchFolders = async () => {
    try {
      const response = await axios.get("http://localhost:3000/get-folders/Activos");
      console.log(response.data);
      setFolders(response.data);
    } catch (error) {
      console.error("Error al obtener las carpetas:", error);
      alert("Error al obtener las carpetas.");
    }
  };
  // Llama a fetchFolders cuando el componente se monte
  useEffect(() => {
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
    if (!newFolderName.trim()) {
      alert("El nombre de la carpeta no puede estar vacío.");
      return;
    }

    if (!newFolderDescription.trim()) {
      alert("La descripción de la carpeta no puede estar vacía.");
      return;
    }
  
    try {
      // Selección del directorio
      const directoryHandle = await window.showDirectoryPicker();

      let pathRelativo = `${directoryHandle.name}\\${newFolderName}`;

      let path = `C:\\Users\\JFGL\\Desktop\\Expedientes\\${pathRelativo}`;

      // Verificar si la carpeta ya existe en el sistema de archivos
    try {
      await directoryHandle.getDirectoryHandle(newFolderName);
      alert("Ya existe una carpeta con este nombre.");
      return;
    } catch (error) {
      // Si la carpeta no existe, continua con la creación
    }

      // Crea la nueva carpeta en el directorio seleccionado
      const newFolderHandle = await directoryHandle.getDirectoryHandle(
        newFolderName,
        { create: true }
      );

       // Registra la nueva carpeta en la base de datos
       const response = await axios.post("http://localhost:3000/register-folder", {
        expediente: newFolderName,
        fecha: new Date().toISOString().split("T")[0],
        descripcion: newFolderDescription,
        ruta: path, // Usar la ruta completa
        id_estado: 1,
      });

      if (response.status === 200) {
        // Solo actualiza el estado de la UI si la carpeta se registró correctamente en la base de datos
      // Agrega la nueva carpeta a la lista de folders
      setFolders(prevFolders =>[
        ...prevFolders,
        {
          Id_carpeta: prevFolders.length + 1,
          Nombre_expediente: newFolderName,
          Fecha_creación: new Date().toISOString().split("T")[0],
          Descripción: newFolderDescription,
          handle: newFolderHandle,
          RutaExpediente: path, // Agrega la ruta completa al objeto de la carpeta
        },
      ]);

      fetchFolders();//actualiza la lista de carpetas
      handleClose();
    }else{
      alert("Error al registrar la carpeta.");
    }
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
      await axios.post("http://localhost:3000/filesPath", { pathAbsoluto });

      // Obtener la URL del archivo
      const fileUrl = `http://localhost:3000/filesOpen/${file}`;

      // Abrir el archivo en una nueva pestaña
      window.open(fileUrl, "_blank");
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

  const handleCambiarEstado = async () => {
    if (!folderToChange || !nuevoEstado) {
      alert("Seleccione una carpeta y un estado válido.");
      return;
    }
  
    try {
 // Realiza la solicitud PUT para cambiar el estado de la carpeta
      await axios.put("http://localhost:3000/cambiarEstado", {
        idCarpeta: folderToChange.Id_carpeta,// Enviar el ID correcto de la carpeta
        nuevoEstado, // Enviar el nuevo estado a la ruta
      });
  
      alert("El estado ha sido cambiado exitosamente y la carpeta fue movida.");
      setOpenCambiarEstado(false);
      setFolderToChange(null);
      setNuevoEstado("");

      fetchFolders();//// Vuelve a cargar las carpetas de activos actualizadas
      
    } catch (error) {
      console.error("Error al cambiar el estado:", error);
      alert("Error al cambiar el estado del expediente.");
    }
  };
  
  const handleOpenCambiarEstado = (folder) => {
    setFolderToChange(folder);// Establece la carpeta seleccionada
    setOpenCambiarEstado(true);
  };
  
 
  const handleOpenEscanear = (expediente) => {
    setSelectedFolder(expediente);
    //setOpenEscanear(true);
    // Abre la página de escaneo en una nueva pestaña
    window.open('https://demo.dynamsoft.com/web-twain/', '_blank');
  };
  
  // const handleCloseEscanear = () => {
  //   setOpenEscanear(false);
  // };
  
  // const handleDestinationChange = (e) => {
  //   setDestinationPath(e.target.value);
  // };
  
  // const handleFileChange = (e) => {
  //   setSelectedFiles(e.target.files[0]); // Guardamos el primer archivo seleccionado
  // };
  
  // const handleScanner = (rutaArchivo) => {
  //   if (!rutaArchivo || !selectedFolder) {
  //     alert('Por favor, selecciona una ruta de archivo válida.');
  //     return;
  //   }
  
  //   // Aquí enviamos la ruta del archivo escaneado y el expediente seleccionado al backend para guardarlo
  //   fetch('http://localhost:3000/escanear', {
  //     method: 'POST',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify({
  //       expedienteId: selectedFolder.id,
  //       filePath: rutaArchivo, // Esta ruta la obtendrás de la herramienta de escaneo
  //     }),
  //   })
  //     .then((response) => response.json())
  //     .then((data) => {
  //       console.log("Datos recibidos del servidor:", data);
  //     })
  //     .catch((error) => {
  //       console.error('Error al guardar el escaneo:', error);
  //     });
  // };
  
  const handleImportarArchivos = async (folder) => {
    try {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.multiple = true; // Permite múltiples archivos
  
      // Cuando se seleccionan los archivos
      fileInput.onchange = async (event) => {
        const files = event.target.files;
        if (!files.length) {
          alert("No se seleccionaron archivos.");
          return;
        }
  
        const formData = new FormData();
        Array.from(files).forEach((file) => formData.append("files", file));
        formData.append("carpetaId", folder.Id_carpeta);

        try {
          const response = await axios.post("http://localhost:3000/upload-file", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          });
  
          alert(response.data.message);
          fetchFolders();//actualiza la lista de carpetas
        } catch (error) {
          console.error("Error al subir archivos:", error);
          alert("Error al subir archivos.");
        }
      };
  
      // Abre el diálogo de selección de archivos
      fileInput.click();
    } catch (error) {
      console.error("Error al subir archivos:", error);
      alert("Error al subir archivos.");
    }
  };

  // Filtrado de los expedientes basado en la búsqueda
  const filteredFolders = folders.filter((folder) =>
    folder.Nombre_expediente?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Define columns for DataTable component
  const columns = [
    {
      name: "Expediente",
      selector: (row) => row.Nombre_expediente,
      sortable: true,
      minWidth: "250px",
    },
    {
      name: "Fecha",
      selector: (row) =>
        new Date(row.Fecha_creación).toISOString().split("T")[0],
      sortable: true,
      width: "150px",
    },
    {
      name: "Descripción",
      selector: (row) => row.Descripción || "Sin descripción",
      sortable: true,
      minWidth: "250px",
    },
    {
      name: "Acciones",
      cell: (row) => (
        <ButtonGroup variant="contained">
          <IconButton onClick={() => handleVisualizar(row) } color="primary">
            <Visibility />
          </IconButton>
          <IconButton
            onClick={() => handleOpenCambiarEstado(row) } color="primary"
          >
            <CompareArrows />
          </IconButton>

          <IconButton onClick ={() => handleOpenEscanear(row)} color="primary">
            <Scanner />
          </IconButton>
          <IconButton onClick={() => handleImportarArchivos(row)} color="primary">
            <FileUpload />
          </IconButton>

        </ButtonGroup>
      ),
      width: "200px",
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
              {/* Activos */}
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
                table: {
                  style: {
                    height: "300px", // Altura fija para la tabla completa
                  },
                },
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
            <TextField
              margin="dense"
              label="Descripción"
              fullWidth
              variant="outlined"
              value={newFolderDescription}
              onChange={(e) => setNewFolderDescription(e.target.value)}
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
                        <TableCell>{decodeURIComponent(escape(file))}</TableCell>
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
            <Button onClick={handleCloseVisualizar} color="primary">
              Cerrar
            </Button>
          </DialogActions>
        </Dialog>

        <Dialog
          open={openCambiarEstado}
          onClose={() => setOpenCambiarEstado(false)}
        >
          <DialogTitle>Cambiar Estado del Expediente</DialogTitle>
          <DialogContent>
            <Select
              label="Nuevo Estado"
              variant="outlined"
              size="small"
              value={nuevoEstado}
              onChange={(e) => setNuevoEstado(e.target.value)}
              fullWidth
              displayEmpty
            >
              <MenuItem value="" disabled>
                <em>Elija el estado</em>
              </MenuItem>
              <MenuItem value="Pendientes">Pendientes</MenuItem>
              <MenuItem value="Finalizados">Finalizados</MenuItem>
            </Select>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCambiarEstado(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCambiarEstado} color="primary">
              Cambiar
            </Button>
          </DialogActions>
        </Dialog>

        {/* <Dialog open={openEscanear} onClose={handleCloseEscanear}>
  <DialogTitle>Escanear Expediente</DialogTitle>
  <DialogContent>
    <DialogContentText>
      Selecciona el archivo escaneado y especifica la ubicación donde deseas guardarlo.
    </DialogContentText>
    <TextField
      margin="dense"
      label="Ruta de destino"
      fullWidth
      variant="outlined"
      value={destinationPath}
      onChange={handleDestinationChange}
      sx={{ marginTop: 2 }}
    />
    <input
      type="file"
      onChange={handleFileChange}
      style={{ marginTop: 16, width: '100%' }}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={handleCloseEscanear}>Cancelar</Button>
    <Button onClick={handleEscanear} color="primary">
      Guardar Escaneo
    </Button>
  </DialogActions>
</Dialog> */}
      </Container>
    </div>
  );
};

export default ActivosPage;

