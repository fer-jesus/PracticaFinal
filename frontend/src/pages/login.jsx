import React from "react";
import { useState, useRef } from "react";
import { useNavigate } from 'react-router-dom';
import "../styles/login.css";

import {
  Container,
  TextField,
  Button,
  Box,
  Typography,
  Grid,
  Paper,
  Avatar,
  IconButton,
  InputAdornment,
} from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

const LoginPage = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = useRef(null);
  const navigate = useNavigate();

  const handleLogin = () => {
    // Datos quemados para validación
    const staticUser = "test123";
    const staticPassword = "pass123";

    if (user === staticUser && password === staticPassword) {
      console.log("Login exitoso");
      navigate('/menu');
    } else {
      console.log("Credenciales incorrectas");
    }
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

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  return (
    <div className="login-container">
      <Container component="main" maxWidth="xs">
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Iniciar Sesión
            </Typography>
            <Box component="form" sx={{ mt: 1 }}>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="user"
                label="Usuario"
                name="user"
                autoComplete="user"
                autoFocus
                value={user}
                onChange={(e) => setUser(e.target.value)}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Contraseña"
                type={showPassword ? "text" : "password"}
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                inputRef={passwordRef}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                type="button"
                fullWidth
                variant="contained"
                color="primary"
                sx={{ mt: 3, mb: 2 }}
                onClick={handleLogin}
              >
                Iniciar Sesión
              </Button>
              <Grid container>
                <Grid item>
                  <Button
                    variant="body2"
                    onClick={() =>
                      console.log("Redirigir a la página de registro")
                    }
                  >
                    {"¿No tienes una cuenta? Regístrate"}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Box>
        </Paper>
      </Container>
    </div>
  );
};

export default LoginPage;
