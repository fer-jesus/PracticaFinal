import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
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
import logoBufete from "../assets/Bufete-popular.png";
//import logoUSAC from "../assets/Usac_logo.png";

const LoginPage = () => {
  const [user, setUser] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorUser, setErrorUser] = useState(false);
  const [errorPassword, setErrorPassword] = useState(false);
  const passwordRef = useRef(null);
  const navigate = useNavigate();

  const handleLogin = async () => {
    // Validar si el  usuario o contraseña con correctos
    if (user.trim() === "" || password.trim() === "") {
      setErrorUser(user.trim() === "");
      setErrorPassword(password.trim() === "");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/login", {
        nombreUsuario: user,
        contrasena: password,
      });

      if (response.status === 200) {
        console.log("Login exitoso");

        // Almacena el nombre de usuario en localStorage o sessionStorage
        localStorage.setItem("nombreUsuario", user);

        navigate("/menu");
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert("Usuario o contraseña incorrectos");
        setUser("");
        setPassword("");
      } else {
        console.log("Error al iniciar sesión:", error);
      }
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
      {/* <img src={logoUSAC} alt="Logo USAC" className="logo-usac" /> */}
      <img src={logoBufete} alt="Logo Bufete" className="logo-bufete" />

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
            <Box
              component="form"
              sx={{
                mt: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
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
                onChange={(e) => {
                  setUser(e.target.value);
                  setErrorUser(false);
                }}
                error={errorUser}
                helperText={errorUser ? "Este campo no puede estar vacío" : ""}
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
                onChange={(e) => {
                  setPassword(e.target.value);
                  setErrorPassword(false);
                }}
                inputRef={passwordRef}
                error={errorPassword}
                helperText={
                  errorPassword ? "Este campo no puede estar vacío" : ""
                }
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
                onClick={handleLogin}
              >
                Iniciar Sesión
              </Button>
              <Grid container>
                <Grid item>
                  <Button variant="body2" onClick={() => navigate("/register")}>
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
