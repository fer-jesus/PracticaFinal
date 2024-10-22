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
import Swal from "sweetalert2";
import axios from "axios";
import StateButtons from "../components/StateButtons";
import "../styles/estados.css";

const ActivosPage = () => {
  const navigate = useNavigate();
  const [folders, setFolders] = useState([]);
  const [newFolderName, setNewFolderName] = useState("");
  const [newFolderDescription, setNewFolderDescription] = useState("");
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openVisualizar, setOpenVisualizar] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [openCambiarEstado, setOpenCambiarEstado] = useState(false);
  const [nuevoEstado, setNuevoEstado] = useState("");
  const [folderToChange, setFolderToChange] = useState(null);

  // Función para obtener las carpetas de la base de datos
  const fetchFolders = async () => {
    try {
      const response = await axios.get(
        "http://backend:3000/get-folders/Activos"
      );
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

  //const pathRelativo= "E:\Expedientes";

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      //alert("El nombre de la carpeta no puede estar vacío.");
      await Swal.fire({
        icon: "warning",
        title: "Nombre vacío",
        text: "El nombre de la carpeta no puede estar vacío.",
      });
      return;
    }

    if (!newFolderDescription.trim()) {
      //alert("La descripción de la carpeta no puede estar vacía.");
      await Swal.fire({
        icon: "warning",
        title: "Descripción vacía",
        text: "La descripción de la carpeta no puede estar vacía.",
      });
      return;
    }

    try {
      // Selección del directorio
      const directoryHandle = await window.showDirectoryPicker();

      let pathRelativo = `${directoryHandle.name}/${newFolderName}`;

      let path = `/app/Expedientes/${pathRelativo}`;

      // Verificar si la carpeta ya existe en el sistema de archivos
      try {
        await directoryHandle.getDirectoryHandle(newFolderName);
        //alert("Ya existe una carpeta con este nombre.");
        await Swal.fire({
          icon: "error",
          title: "Carpeta existente",
          text: "Ya existe una carpeta con este nombre.",
        });
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
      const response = await axios.post(
        "http://localhost:3000/register-folder",
        {
          expediente: newFolderName,
          fecha: new Date().toISOString().split("T")[0],
          descripcion: newFolderDescription,
          ruta: path, // Usar la ruta completa
          id_estado: 1,
        }
      );

      if (response.status === 200) {
        // Solo actualiza el estado de la UI si la carpeta se registró correctamente en la base de datos
        // Agrega la nueva carpeta a la lista de folders
        setFolders((prevFolders) => [
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

        fetchFolders(); //actualiza la lista de carpetas
        handleClose();
        //alert("Carpeta registrada exitosamente.");
        await Swal.fire({
          icon: "success",
          title: "¡Carpeta creada!",
          text: "La carpeta ha sido creada y registrada exitosamente.",
        });

        // Limpia los campos de texto después de crear la carpeta
        setNewFolderName(""); // Limpiar el nombre
        setNewFolderDescription(""); // Limpiar la descripción
      } else {
        //alert("Error al registrar la carpeta.");
        await Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al registrar la carpeta.",
        });
      }
    } catch (error) {
      console.error("Error al crear la carpeta:", error);
      //alert("Error al crear la carpeta");
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al crear la carpeta.",
      });
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
      console.log("Path Absoluto:", pathAbsoluto);

      // Enviar el path absoluto al backend
      // Hacer la solicitud POST al servidor para enviar el path absoluto
      await axios.post("http://localhost:3000/filesPath", { pathAbsoluto });

      // Obtener la URL del archivo
      const fileUrl = `http://localhost:3000/filesOpen/${encodeURIComponent(
        file
      )}`;
      console.log("URL del archivo:", fileUrl);

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
      //alert("Seleccione una carpeta y un estado válido.");
      Swal.fire({
        icon: "warning",
        title: "Advertencia",
        text: "Seleccione una carpeta y un estado válido.",
        confirmButtonText: "OK",
      });
      return;
    }

    try {
      // Realiza la solicitud PUT para cambiar el estado de la carpeta
      await axios.put("http://localhost:3000/cambiarEstado", {
        idCarpeta: folderToChange.Id_carpeta, // Enviar el ID correcto de la carpeta
        nuevoEstado, // Enviar el nuevo estado a la ruta
        //fechaCambioEstado: new Date().toISOString().split("T")[0],
      });

      //alert("El estado ha sido cambiado exitosamente y la carpeta fue movida.");
      Swal.fire({
        icon: "success",
        title: "Éxito",
        text: "El expediente ha sido actualizado.",
        confirmButtonText: "OK",
      });

      fetchFolders(); //// Vuelve a cargar las carpetas de activos actualizadas
      setOpenCambiarEstado(false);
      setFolderToChange(null);
      setNuevoEstado("");
    } catch (error) {
      console.error("Error al cambiar el estado:", error);
      //alert("Error al cambiar el estado del expediente.");
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al cambiar el estado del expediente.",
        confirmButtonText: "OK",
      });
    }
  };

  const handleOpenCambiarEstado = (folder) => {
    setFolderToChange(folder); // Establece la carpeta seleccionada
    setOpenCambiarEstado(true);
  };

  // Función para escanear archivos
  const handleScan = async () => {
    try {
      // Hacer una solicitud GET a la API para abrir NAPS2
      await axios.get("http://localhost:4000/abrir-naps2");
      //alert(response.data.message);  // Mostrar un mensaje cuando NAPS2 se abra
    } catch (error) {
      //alert("Hubo un error al intentar abrir NAPS2.");
      Swal.fire({ 
        icon: "error",
        title: "Error",
        text: "Hubo un error al intentar abrir NAPS2.",
        confirmButtonText: "OK",
      });
      console.error(error);
    }
  };

  const Escanear = () => {
    handleScan(); // Llama a la función handleScan cuando sea necesario
  };

  const handleImportarArchivos = async (folder) => {
    try {
      const fileInput = document.createElement("input");
      fileInput.type = "file";
      fileInput.multiple = true; // Permite múltiples archivos

      // Cuando se seleccionan los archivos
      fileInput.onchange = async (event) => {
        const files = event.target.files;
        if (!files.length) {
          //alert("No se seleccionaron archivos.");
          await Swal.fire({
            icon: "warning",
            title: "No se seleccionaron archivos",
            text: "Por favor selecciona al menos un archivo para importar.",
          });
          return;
        }

        const formData = new FormData();
        Array.from(files).forEach((file) =>
          formData.append("files", file, file.name)
        );
        formData.append("carpetaId", folder.Id_carpeta);

        try {
          const response = await axios.post(
            "http://localhost:3000/upload-file",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          );

          await Swal.fire({
            icon: "success",
            title: "Archivos importados",
            text: response.data.message,
          });

          //alert(response.data.message);
          fetchFolders(); //actualiza la lista de carpetas
        } catch (error) {
          console.error("Error al subir archivos:", error);
          //alert("Error al subir archivos.");
          await Swal.fire({
            icon: "error",
            title: "Error",
            text: "Error al subir archivos.",
          });
        }
      };

      // Abre el diálogo de selección de archivos
      fileInput.click();
    } catch (error) {
      console.error("Error al subir archivos:", error);
      //alert("Error al subir archivos.");
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Error al subir archivos.",
      });
    }
  };

  const handleReporteActivos = () => {
    const nombreUsuario = localStorage.getItem("nombreUsuario");

    const newTab = window.open(
      `http://localhost:3000/reporte-estados/Activos?usuario=${encodeURIComponent(
        nombreUsuario
      )}`,
      "_blank"
    );

    if (newTab) {
      newTab.document.title = "Reporte Expedientes Activos";
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
      selector: (row) => {
        // new Date(row.Fecha_creación).toISOString().split("T")[0],
        // Si el expediente fue movido a "Activo" desde otro estado, muestra la fecha de cambio
        if (row.Fecha_cambioEstado) {
          return new Date(row.Fecha_cambioEstado).toISOString().split("T")[0];
        }
        // Si no, muestra la fecha de creación
        return new Date(row.Fecha_creación).toISOString().split("T")[0];
      },
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
          <IconButton
            onClick={() => handleVisualizar(row)}
            sx={{ color: "#171F4D" }}
          >
            <Visibility />
          </IconButton>
          <IconButton
            onClick={() => handleOpenCambiarEstado(row)}
            sx={{ color: "#171F4D" }}
          >
            <CompareArrows />
          </IconButton>

          <IconButton onClick={Escanear} sx={{ color: "#171F4D" }}>
            <Scanner />
          </IconButton>
          <IconButton
            onClick={() => handleImportarArchivos(row)}
            sx={{ color: "#171F4D" }}
          >
            <FileUpload />
          </IconButton>
        </ButtonGroup>
      ),
      width: "200px",
    },
  ];

  return (
    <div className="activo-container">
      <Container sx={{ paddingTop: 4, height: "100vh", overflowY: "auto" }}>
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
            //color="secondary"
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
              fontWeight: "bold",
            }}
          />
          <Button
            variant="contained"
            //color="primary"
            onClick={handleClickOpen}
            sx={{
              alignSelf: "flex-end",
              marginBottom: 2,
              backgroundColor: "#171F4D",
              fontWeight: "bold",
              fontSize: "12px",
              padding: "6px 12px",
              "&:hover": {
                backgroundColor: "#0f1436",
              },
            }}
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
                    height: "500px", // Altura fija para la tabla completa
                  },
                },
                headCells: {
                  style: {
                    fontSize: "16px", // Tamaño de la fuente del encabezado
                    fontWeight: "bold", // Negrita en el encabezado
                    backgroundColor: "#d3d3d3", // Color de fondo del encabezado
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
                    backgroundColor: "#e8e8e8", // Color gris para la paginación
                    fontSize: "15px", // Tamaño de la fuente de la paginación (puedes ajustar esto)
                    height: "5px",
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

        <Button
          variant="contained"
          //color="secondary"
          onClick={handleReporteActivos} // Función que manejará el evento al hacer clic en el botón
          sx={{
            marginTop: 8,
            fontSize: "12px",
            padding: "6px 12px",
            backgroundColor: "#171F4D",
            "&:hover": {
              backgroundColor: "#0f1436",
            },
          }}
        >
          Generar reporte
        </Button>

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
      </Container>
    </div>
  );
};

export default ActivosPage;
