import { useContext, useState, useEffect } from "react";
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
  Button,
  IconButton,
  TextField,
  InputAdornment,
  Dialog,
  MenuItem,
  Menu,
  Select,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
} from "@mui/material";
import { Visibility,  CompareArrows, Delete, Search } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import DataTable from "react-data-table-component";
import AccountCircle from "@mui/icons-material/AccountCircle";
import { UserContext } from "../components/UserContext";
import Swal from "sweetalert2";
import StateButtons from "../components/StateButtons";
import axios from "axios";
import "../styles/estados.css";

const FinalizadosPage = () => {
  const navigate = useNavigate(); // Inicializa useNavigate
  const [folders, setFolders] = useState([]); // Estado para las carpetas
  const [searchQuery, setSearchQuery] = useState(""); // Estado para la búsqueda
  const [openVisualizar, setOpenVisualizar] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [selectedFolder, setSelectedFolder] = useState(null);
  const [openCambiarEstado, setOpenCambiarEstado] = useState(false);
  const [nuevoEstado, setNuevoEstado] = useState("");
  const [folderToChange, setFolderToChange] = useState(null);
  const [openEliminar, setOpenEliminar] = useState(false);
  const [folderToDelete, setFolderToDelete] = useState(null);
  const {nombreCompleto } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState(null);

 
    const fetchFolders = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/get-folders/Finalizados"
        );
        if (response.status === 200) {
          setFolders(response.data);
        }
      } catch (error) {
        if (error.response && error.response.status === 404) {
          console.warn("No se encontraron carpetas.");
          setFolders([]); // Cuando no hay carpetas, se establece como un array vacío
        } else {
          console.error("Error al obtener las carpetas:", error);
          alert("Error al obtener las carpetas.");
        }
      }
    };

    useEffect(() => {
    fetchFolders();
  }, []); // Se ejecuta cuando el componente se monta

  // Función para manejar la apertura del menú
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Función para cerrar el menú
  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    // limpiar cualquier dato almacenado en localStorage o en el estado global
    navigate("/login"); // Redirige a la página de login
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
      const fileUrl = `http://localhost:3000/filesOpen/${encodeURIComponent(file)}`;
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

  const handleOpenEliminar = (folder) => {
    setFolderToDelete(folder);
    setOpenEliminar(true);
  };

  const handleCloseEliminar = () => {
    setOpenEliminar(false);
    setFolderToDelete(null);
  };

  const handleEliminar = async () => {
    try {
      // Eliminar la carpeta utilizando el ID
      await axios.delete("http://localhost:3000/delete-folder", {
        data: { Id_carpeta: folderToDelete.Id_carpeta }, 
      });

      // Actualiza la lista de carpetas eliminando la que fue borrada
      setFolders(
        folders.filter(
          (folder) => folder.Id_carpeta !== folderToDelete.Id_carpeta
        )
      );

      handleCloseEliminar();
      //alert("Carpeta eliminada exitosamente.");
      // Mostrar confirmación
      await Swal.fire({
        icon: "success",
        title: "¡Eliminado!",
        text: "El expediente ha sido eliminado exitosamente.",
      });
    } catch (error) {
      console.error("Error al eliminar la carpeta:", error);
      //alert("Error al eliminar la carpeta.");
      await Swal.fire({
        icon: "error",
        title: "Error",
        text: "Hubo un error al eliminar la carpeta.",
      });
    }
  };

  const handleReporteFinalizados = () => {
    const nombreUsuario = localStorage.getItem("nombreUsuario");

    const newTab = window.open(
      `http://localhost:3000/reporte-estados/Finalizados?usuario=${encodeURIComponent(
        nombreUsuario
      )}`,
      "_blank"
    );

    if (newTab) {
      newTab.document.title = "Reporte Expedientes Finalizados";
    }
  };

  const filteredFolders = folders.filter((folder) =>
    folder.Nombre_expediente.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns = [
    {
      name: "Expediente",
      selector: (row) => row.Nombre_expediente,
      sortable: true,
      minWidth: "300px",
    },
    {
      name: "Fecha",
      selector: (row) => {
        //new Date(row.Fecha_creación).toISOString().split("T")[0],
        return row.Fecha_cambioEstado
          ? new Date(row.Fecha_cambioEstado).toISOString().split("T")[0]
          : ""; // Si no hay fecha, no mostrar nada
      },
      sortable: true,
      width: "150px",
    },
    {
      name: "Descripción",
      selector: (row) => row.Descripción,
      sortable: true,
      minWidth: "150px",
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
          <IconButton
            onClick={() => handleOpenEliminar(row)}
            sx={{ color: "#171F4D" }}
          >
            <Delete />
          </IconButton>
        </ButtonGroup>
      ),
      width: "150px",
    },
  ];

  return (
    <div className="finalizados-container">
      <Container sx={{ paddingTop: "80px", height: "100vh" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
            {/* Navbar Superior */}
           <Box sx={{
            width: "100%", 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            padding: "20px 20px", 
            position: "fixed", 
            top: 0, 
            left: 0, 
            right: 0, 
            zIndex: 10, 
            backgroundColor: "#355d75", 
            boxShadow: "0 4px 6px rgba(0,0,0,0.1)"
          }}>
            {/* Buscador (lado izquierdo) */}
            <Box sx={{ flexGrow: 1, paddingLeft: "20px" }}>
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
            {/* Nombre Completo e Icono de Usuario (lado derecho) */}
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Typography variant="h6" sx={{ fontWeight: "bold", marginRight: 1 }}>
                {nombreCompleto}
              </Typography>
              <IconButton onClick={handleMenu} color="inherit">
                <AccountCircle fontSize="large" />
              </IconButton>
            </Box>
          </Box>
          {/* Menu desplegable */}
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleCloseMenu}
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
          <Box
            sx={{
              //marginTop: "100px",
              width: "100%",
              display: "flex",
              justifyContent: "flex-start",
              alignItems: "center",
              marginBottom: 2,
            }}
          >
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
          <Box
            sx={{
              width: "100%",
              height: "50vh",
              marginTop: 8,
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
                    width: "100%",
                  },
                },
                headCells: {
                  style: {
                    fontSize: "22px", // Tamaño de la fuente del encabezado
                    fontWeight: "bold", // Negrita en el encabezado
                    backgroundColor: "#d3d3d3", // Color de fondo del encabezado
                    borderBottom: "2px solid #e0e0e0", // Línea en la parte inferior del encabezado
                    textAlign: "left", // Alinea el texto a la izquierda
                  },
                },
                cells: {
                  style: {
                    fontSize: "19px", // Tamaño de la fuente de las celdas
                  },
                },
                pagination: {
                  style: {
                    backgroundColor: "#d3d3d3", // Color gris para la paginación
                    fontSize: "15px", // Tamaño de la fuente de la paginación 
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
          color="secondary"
          onClick={handleReporteFinalizados} // Función que manejará el evento al hacer clic en el botón
          sx={{
            marginTop: 8,
            fontSize: "12px",
            padding: "6px 12px",
            backgroundColor: "#DC5F00",
            "&:hover": {
              backgroundColor: "#FFED38", 
            },
          }}
        >
          Generar reporte
        </Button>
      </Container>
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
              <MenuItem value="Activos">Activos</MenuItem>
              <MenuItem value="Pendientes">Pendientes</MenuItem>
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
      <Dialog open={openEliminar} onClose={handleCloseEliminar}>
        <DialogTitle>Eliminar Carpeta</DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que deseas eliminar el expediente{" "}
            <strong>{folderToDelete?.Nombre_expediente}</strong>? Esta acción no
            se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEliminar} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleEliminar} color="secondary">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FinalizadosPage;
