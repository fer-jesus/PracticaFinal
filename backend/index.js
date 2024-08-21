const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // Importa bcrypt para el hash de contraseñas
const db = require('./database'); // Importa la configuración de la base de datos
const fs = require('fs'); // Importa el módulo fs para el manejo del sistema de archivos
const path = require('path'); // Importa el módulo path para manejar rutas de archivos

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Ruta para registrar usuarios
app.post('/register', async (req, res) => {
  const { nombres, apellidos, telefono, email, fechaNacimiento, edad, direccion, rol, nombreUsuario, contrasena } = req.body;

  try {
    // Hash de la contraseña antes de guardarla en la base de datos
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    const query = `
      INSERT INTO USUARIO (Nombres, Apellidos, Telefono, Email, Fecha_Nacimiento, Edad, Direccion, Rol, NombreUsuario, Contraseña)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(query, [nombres, apellidos, telefono, email, fechaNacimiento, edad, direccion, rol, nombreUsuario, hashedPassword], (err, results) => {
      if (err) {
        console.error('Error al registrar usuario:', err);
        return res.status(500).json({ error: 'Error al registrar usuario' });
      }
      res.status(200).json({ message: 'Usuario registrado exitosamente' });
    });
  } catch (err) {
    console.error('Error al registrar usuario:', err);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// Ruta para iniciar sesión
app.post('/login', (req, res) => {
  const { nombreUsuario, contrasena } = req.body;

  const query = 'SELECT * FROM USUARIO WHERE NombreUsuario = ?';

  db.query(query, [nombreUsuario], async (err, results) => {
    if (err) {
      console.error('Error al buscar usuario:', err);
      return res.status(500).json({ error: 'Error al buscar usuario' });
    }

    if (results.length === 0) {
      return res.status(400).json({ error: 'Usuario no encontrado' });
    }

    const user = results[0];

    // Comparar la contraseña proporcionada con la contraseña hash almacenada
    const isMatch = await bcrypt.compare(contrasena, user.Contraseña);

    if (!isMatch) {
      return res.status(400).json({ error: 'Contraseña incorrecta' });
    }

    res.status(200).json({ message: 'Inicio de sesión exitoso' });
  });
});

// Ruta para crear una nueva carpeta en la ruta especificada
app.post('/create-folder', (req, res) => {
  const { folderName } = req.body;

  const folderPath = path.join('C:\\Users\\JFGL\\Desktop\\Expedientes\\Activos', folderName);

  // Verifica si la carpeta ya existe
  if (fs.existsSync(folderPath)) {
    return res.status(400).json({ error: 'La carpeta ya existe' });
  }
  
// Crea la carpeta
  fs.mkdir(folderPath, (err) => {
    if (err) {
      console.error('Error al crear la carpeta:', err);
      return res.status(500).json({ error: 'Error al crear la carpeta' });
    }

    res.status(200).json({ message: 'Carpeta creada exitosamente' });
  });
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

