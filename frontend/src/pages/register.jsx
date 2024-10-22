import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Paper,
  InputAdornment,
  IconButton,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import "../styles/register.css";
import Swal from "sweetalert2";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nombres: "",
    apellidos: "",
    telefono: "",
    email: "",
    fechaNacimiento: "",
    edad: "",
    direccion: "",
    rol: "",
    nombreUsuario: "",
    contrasena: "",
    confirmarContrasena: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  // const [myClass, setMyClass] = useState("");
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (e.target.value) {
      setErrors((prevErrors) => ({ ...prevErrors, [e.target.name]: "" }));
    }
  };

  const handleDateChange = (event) => {
    const birthDate = event.target.value;
    setFormData({
      ...formData,
      fechaNacimiento: birthDate,
      edad: calculateAge(birthDate),
    });
  };

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDateObj.getDate())
    ) {
      age--;
    }
    return age;
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
    if (passwordRef.current) {
      const length = passwordRef.current.value.length;
      setTimeout(() => {
        passwordRef.current.focus();
        passwordRef.current.setSelectionRange(length, length);
      }, 0);
    }
  };

  const handleClickShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword);
    if (confirmPasswordRef.current) {
      const length = confirmPasswordRef.current.value.length;
      setTimeout(() => {
        confirmPasswordRef.current.focus();
        confirmPasswordRef.current.setSelectionRange(length, length);
      }, 0);
    }
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const validateForm = () => {
    const newErrors = {};
    Object.keys(formData).forEach((key) => {
      if (!formData[key]) {
        newErrors[key] = "Llena este campo";
      }
    });

    if (formData.contrasena !== formData.confirmarContrasena) {
      newErrors.confirmarContrasena = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    try {
      const response = await axios.post("http://backend:3000/register", {
        nombres: formData.nombres,
        apellidos: formData.apellidos,
        telefono: formData.telefono,
        email: formData.email,
        fechaNacimiento: formData.fechaNacimiento,
        edad: formData.edad,
        direccion: formData.direccion,
        rol: formData.rol,
        nombreUsuario: formData.nombreUsuario,
        contrasena: formData.contrasena,
      });

      if (response.status === 200) {
        console.log("Usuario registrado exitosamente");
        Swal.fire({
          icon: "success",
          title: "Registro exitoso",
          text: "Usuario registrado exitosamente.",
        }).then(() => {
          navigate("/login");
        });
      }
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      if (error.response && error.response.data.error) {
        Swal.fire({
          icon: "error",
          title: "Error de registro",
          text: error.response.data.error,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Error al registrar usuario. Inténtalo de nuevo más tarde.",
        });
      }
    }
  };

  return (
    <div
      className="register-container"
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "20px",
        boxSizing: "border-box",
      }}
    >
      <Container component="main" maxWidth="xs">
        <Paper
          elevation={3}
          sx={{
            padding: 3,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            maxHeight: "90vh",
            overflowY: "auto",
          }}
        >
          <Typography
            component="h1"
            variant="h5"
            sx={{ mb: 2, fontWeight: "bold" }}
          >
            REGISTRO
          </Typography>
          <Box
            component="form"
            sx={{
              width: "100%",
              mt: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
            onSubmit={handleRegister}
          >
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              id="nombres"
              label="Nombres"
              name="nombres"
              autoComplete="nombres"
              autoFocus
              value={formData.nombres}
              onChange={handleChange}
              error={!!errors.nombres}
              helperText={errors.nombres}
            />
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              id="apellidos"
              label="Apellidos"
              name="apellidos"
              autoComplete="apellidos"
              value={formData.apellidos}
              onChange={handleChange}
              error={!!errors.apellidos}
              helperText={errors.apellidos}
            />
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              id="telefono"
              label="Teléfono"
              name="telefono"
              autoComplete="telefono"
              value={formData.telefono}
              onChange={handleChange}
              error={!!errors.telefono}
              helperText={errors.telefono}
            />
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              id="email"
              label="Correo electrónico"
              name="email"
              type="email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              error={!!errors.email}
              helperText={errors.email}
            />
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              id="fechaNacimiento"
              label="Fecha de nacimiento"
              name="fechaNacimiento"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={formData.fechaNacimiento}
              onChange={handleDateChange}
              error={!!errors.fechaNacimiento}
              helperText={errors.fechaNacimiento}
            />
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              id="edad"
              placeholder="Edad"
              label="Edad"
              name="edad"
              autoComplete="edad"
              value={formData.edad}
              InputProps={{
                readOnly: true,
              }}
              error={!!errors.edad}
              helperText={errors.edad}
            />
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              id="direccion"
              label="Dirección"
              name="direccion"
              autoComplete="direccion"
              value={formData.direccion}
              onChange={handleChange}
              error={!!errors.direccion}
              helperText={errors.direccion}
            />
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              id="rol"
              label="Rol"
              name="rol"
              autoComplete="rol"
              value={formData.rol}
              onChange={handleChange}
              error={!!errors.rol}
              helperText={errors.rol}
            />
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              id="nombreUsuario"
              label="Nombre de usuario"
              name="nombreUsuario"
              autoComplete="nombreUsuario"
              value={formData.nombreUsuario}
              onChange={handleChange}
              error={!!errors.nombreUsuario}
              helperText={errors.nombreUsuario}
            />
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              name="contrasena"
              label="Contraseña"
              type={showPassword ? "text" : "password"}
              id="contrasena"
              autoComplete="current-password"
              value={formData.contrasena}
              onChange={handleChange}
              inputRef={passwordRef}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={!!errors.contrasena}
              helperText={errors.contrasena}
            />
            <TextField
              variant="outlined"
              margin="dense"
              required
              fullWidth
              name="confirmarContrasena"
              label="Confirmar contraseña"
              type={showConfirmPassword ? "text" : "password"}
              id="confirmarContrasena"
              autoComplete="current-password"
              value={formData.confirmarContrasena}
              onChange={handleChange}
              inputRef={confirmPasswordRef}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowConfirmPassword}
                      onMouseDown={handleMouseDownPassword}
                    >
                      {showConfirmPassword ? <Visibility /> : <VisibilityOff />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              error={!!errors.confirmarContrasena}
              helperText={errors.confirmarContrasena}
            />
            <Button
              type="submit"
              variant="contained"
              sx={{
                mt: 3,
                mb: 2,
                backgroundColor: "#171F4D",
                width: "150px",
                fontWeight: "bold",
                alignSelf: "center",
                "&:hover": {
                  backgroundColor: "#0f1436",
                },
              }}
            >
              Registrarse
            </Button>
            <Button variant="body2" onClick={() => navigate("/login")}>
              {"¿Ya tienes una cuenta? Inicia Sesión"}
            </Button>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default RegisterPage;
