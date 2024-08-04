import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
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

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [myClass, setMyClass] = useState("");
  const passwordRef = useRef(null);
  const confirmPasswordRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

  const handleRegister = async (e) => {
    e.preventDefault();
    setMyClass("");
    if (formData.contrasena !== formData.confirmarContrasena) {
      setMyClass("is-invalid");
      return;
    }

    // lógica de registro

    navigate("/login");
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
          <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
            Registro
          </Typography>
          <Box
            component="form"
            sx={{ width: "100%", mt: 1 }}
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
              className={myClass}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              sx={{ mt: 2, mb: 1 }}
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
