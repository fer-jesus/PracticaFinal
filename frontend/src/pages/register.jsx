// import  { useState } from 'react';
// import  '../styles/register.css';

// import {
//   Container,
//   TextField,
//   Button,
//   Box,
//   Typography,
//   Grid,
//   Paper,
//   Avatar
// } from '@mui/material';
// import LockOutlinedIcon from '@mui/icons-material/LockOutlined';



// const RegisterPage = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');

//   const handleRegister = () => {
//     // Validación simple
//     if (password !== confirmPassword) {
//       console.log('Las contraseñas no coinciden');
//       return;
//     }

//     console.log('Usuario registrado:', { email, password });
//     // Aquí puedes redirigir al usuario a la página de login o mostrar un mensaje de éxito
//   };

//   return (
//     <div className="register-container">
//     <Container component="main" maxWidth="xs">
//       <Paper elevation={3} sx={{ padding: 4, marginTop: 8 }}>
//         <Box
//           sx={{
//             display: 'flex',
//             flexDirection: 'column',
//             alignItems: 'center',
//           }}
//         >
//           <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
//             <LockOutlinedIcon />
//           </Avatar>
//           <Typography component="h1" variant="h5">
//             Registrarse
//           </Typography>
//           <Box component="form" sx={{ mt: 1 }}>
//             <TextField
//               variant="outlined"
//               margin="normal"
//               required
//               fullWidth
//               id="email"
//               label="Correo Electrónico"
//               name="email"
//               autoComplete="email"
//               autoFocus
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//             <TextField
//               variant="outlined"
//               margin="normal"
//               required
//               fullWidth
//               name="password"
//               label="Contraseña"
//               type="password"
//               id="password"
//               autoComplete="new-password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//             <TextField
//               variant="outlined"
//               margin="normal"
//               required
//               fullWidth
//               name="confirmPassword"
//               label="Confirmar Contraseña"
//               type="password"
//               id="confirmPassword"
//               autoComplete="new-password"
//               value={confirmPassword}
//               onChange={(e) => setConfirmPassword(e.target.value)}
//             />
//             <Button
//               type="button"
//               fullWidth
//               variant="contained"
//               color="primary"
//               sx={{ mt: 3, mb: 2 }}
//               onClick={handleRegister}
//             >
//               Registrarse
//             </Button>
//             <Grid container>
//               <Grid item>
//                 <Button
//                   variant="body2"
//                   onClick={() => console.log('Redirigir a la página de login')}
//                 >
//                   {"¿Ya tienes una cuenta? Inicia sesión"}
//                 </Button>
//               </Grid>
//             </Grid>
//           </Box>
//         </Box>
//       </Paper>
//     </Container>
//     </div>
//   );
// };

// export default RegisterPage;

import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, TextField, Button, Box, Typography, Paper, Grid, Avatar, InputAdornment, IconButton } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import "../styles/register.css";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    nombres: '',
    apellidos: '',
    email: '',
    fechaNacimiento: '',
    direccion: '',
    nombreUsuario: '',
    contrasena: '',
    confirmarContrasena: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = useRef(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

  const handleRegister = () => {
    console.log(formData);
    // Aquí puedes agregar la lógica para enviar los datos a tu backend
    navigate('/login');
  };

  return (
    <div className="register-container">
      <Container component="main" maxWidth="xs">
        <Paper elevation={3} sx={{ padding: 4 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Registro
            </Typography>
            <Box component="form" sx={{ mt: 1 }}>
              <TextField
                variant="outlined"
                margin="normal"
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
                margin="normal"
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
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                type="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="fechaNacimiento"
                label="Fecha de nacimiento"
                name="fechaNacimiento"
                type="date"
                InputLabelProps={{ shrink: true }}
                autoComplete="fechaNacimiento"
                value={formData.fechaNacimiento}
                onChange={handleChange}
              />
              <TextField
                variant="outlined"
                margin="normal"
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
                margin="normal"
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
                margin="normal"
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
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="confirmarContrasena"
                label="Confirmar contraseña"
                type={showPassword ? "text" : "password"}
                id="confirmarContrasena"
                autoComplete="current-password"
                value={formData.confirmarContrasena}
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
                onClick={handleRegister}
              >
                Registrar
              </Button>
              <Grid container>
                <Grid item>
                  <Button
                    variant="body2"
                    onClick={() => navigate('/login')}
                  >
                    {"¿Ya tienes una cuenta? Inicia sesión"}
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

export default RegisterPage;
