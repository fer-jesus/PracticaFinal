const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');

const app = express();
const port = 3000;

// Configuración de CORS
app.use(cors());

// Configuración de body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Ruta para el registro de usuarios
app.post('/register', (req, res) => {
  const { nombres, apellidos, email, fechaNacimiento, edad, nombreUsuario, contrasena, telefono, direccion, rol } = req.body;

  const query = 'INSERT INTO USUARIO (Nombres, Apellidos, Telefono, Email, Fecha_nacimiento, Edad, Direccion, Rol, NombreUsuario, Contraseña) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
  
  db.query(query, [nombres, apellidos, email, fechaNacimiento, edad, nombreUsuario, contrasena, telefono, direccion, rol], (err, results) => {
    if (err) {
      console.error('Error al registrar usuario:', err);
      res.status(500).send('Error al registrar usuario');
      return;
    }
    res.status(200).send('Usuario registrado exitosamente');
  });
});

// Ruta para el inicio de sesión de usuarios
app.post('/login', (req, res) => {
  const { nombreUsuario, contrasena } = req.body;

  const query = 'SELECT * FROM USUARIO WHERE NombreUsuario = ? AND Contraseña = ?';
  
  db.query(query, [nombreUsuario, contrasena], (err, results) => {
    if (err) {
      console.error('Error al iniciar sesión:', err);
      res.status(500).send('Error al iniciar sesión');
      return;
    }
    
    if (results.length > 0) {
      res.status(200).send('Inicio de sesión exitoso');
    } else {
      res.status(401).send('Credenciales incorrectas');
    }
  });
});

app.listen(port, () => {
  console.log(`Servidor ejecutándose en http://localhost:${port}`);
});
