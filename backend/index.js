const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // Importa bcrypt para el hash de contraseñas
const db = require('./database'); // Importa la configuración de la base de datos
const fs = require('fs'); // Importa el módulo fs para el manejo del sistema de archivos
const path = require('path'); // Importa el módulo path para manejar rutas de archivos

const app = express();
const PORT = 3000;
var pathFrontend = "";

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

//Ruta para registrar una nueva carpeta en la base de datos
app.post('/register-folder', (req, res) => {
  const { expediente, fecha, descripcion, ruta } = req.body;

  const query = `
    INSERT INTO CARPETA (Nombre_expediente, Fecha_creación, Descripción, RutaExpediente)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [expediente, fecha, descripcion, ruta], (err, results) => {
    if (err) {
      console.error('Error al registrar la carpeta:', err);
      return res.status(500).json({ error: 'Error al registrar la carpeta:  ${err.message}' });
    }
    res.status(200).json({ message: 'Carpeta registrada exitosamente' });
  });
});

// Ruta para obtener todas las carpetas
app.get('/get-folders', (req, res) => {
  const query = 'SELECT * FROM CARPETA';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener las carpetas:', err);
      return res.status(500).json({ error: 'Error al obtener las carpetas' });
    }
    res.status(200).json(results);
  });
});


// Ruta para obtener los archivos de una carpeta específica
app.get('/files', (req, res) => {
  
  const expedienteNombre = req.query.expedienteNombre; // Obtiene el nombre del expediente desde el frontend

if (!expedienteNombre) {
  return res.status(400).json({ error: 'Nombre del expediente no proporcionado' });
}

// Consulta para obtener la ruta del expediente basado en su nombre
const query = 'SELECT RutaExpediente FROM CARPETA WHERE Nombre_expediente = ?';

db.query(query, [expedienteNombre], (err, results) => {
  if (err) {
    console.error('Error al obtener la ruta del expediente:', err);
    return res.status(500).json({ error: 'Error al obtener la ruta del expediente' });
  }

  if (results.length === 0) {
    return res.status(404).json({ error: 'Expediente no encontrado' });
  }

  const folderPath = results[0].RutaExpediente;


  // Verifica si la carpeta existe
  fs.readdir(folderPath, (err, files) => {
    if (err) {
      console.error('Error al leer la carpeta:', err);
      return res.status(500).json({ error: 'Error al leer la carpeta' });
    }

    // Filtra archivos solo para mostrar los PDFs
    const pdfFiles = files.filter(file => path.extname(file) === '.pdf');
    
    // Devuelve los nombres de los archivos
    res.json(pdfFiles);
  });
});
});

// Ruta para abrir archivos basados en path absoluto
app.post('/filesPath', (req, res) => {

  const { pathAbsoluto } = req.body;
  pathFrontend = pathAbsoluto;
  
  console.log(pathFrontend);

  res.status(200).json({ message: 'path completado' });

});

// Ruta para abrir archivos basados en el path relativo
//app.use('/filesOpen', express.static(pathFrontend));

// Ruta para abrir archivos basados en el path relativo
app.get('/filesOpen/:fileName', (req, res) => {
  // Obtiene el nombre del archivo de los parámetros
  const fileName = req.params.fileName;

  // Verifica que pathFrontend esté configurado
  if (!pathFrontend) {
    return res.status(400).json({ error: 'Path no configurado' });
  }

  // Construye la ruta completa del archivo
  const filePath = path.join(pathFrontend, fileName);

  // Verifica si el archivo existe
  if (fs.existsSync(filePath)) {
    // Envia el archivo al cliente
    res.sendFile(filePath, (err) => {
      if (err) {
        console.error('Error al abrir el archivo:', err);
        return res.status(500).json({ error: 'Error al abrir el archivo' });
      }
    });
  } else {
    return res.status(404).json({ error: 'Archivo no encontrado' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});




