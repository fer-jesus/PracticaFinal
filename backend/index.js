const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // Importa bcrypt para el hash de contraseñas
const db = require('./database'); // Importa la configuración de la base de datos
const fs = require('fs'); // Importa el módulo fs para el manejo del sistema de archivos
const path = require('path'); // Importa el módulo path para manejar rutas de archivos
const multer = require('multer');//Importa el modulo multer para subir archivos
//const { PDFDocument } = require('pdf-lib');
const fileUpload = require('express-fileupload');

const app = express();
const PORT = 3000;
var pathFrontend = "";

app.use(cors());
app.use(bodyParser.json());
app.use(express.json()); // Para parsear el cuerpo de las solicitudes en formato JSON
app.use(fileUpload()); // Middleware para manejar archivos

// const estadosRutas = {
//   'Pendientes': 'C:\\Users\\JFGL\\Desktop\\Expedientes\\Pendientes',
//   'Finalizados': 'C:\\Users\\JFGL\\Desktop\\Expedientes\\Finalizados',
//   'Activos': 'C:\\Users\\JFGL\\Desktop\\Expedientes\\Activos'
// };

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

// Ruta para cambiar el estado de una carpeta
app.put('/cambiarEstado', (req, res) => {
  const { idCarpeta, nuevoEstado } = req.body;

  const query = `
    INSERT INTO CARPETA_ESTADO (Id_carpeta, Id_estado)
    VALUES (?, ?)
  `;

  db.query(query, [idCarpeta, nuevoEstado], (err, results) => {
    if (err) {
      console.error('Error al cambiar el estado de la carpeta:', err);
      return res.status(500).json({ error: 'Error al cambiar el estado' });
    }
    res.status(200).json({ message: 'Estado de la carpeta cambiado exitosamente' });
  });
});

// Ruta para listar carpetas por estado
app.get('/carpetas/:estado', (req, res) => {
  const estado = req.params.estado;

  const query = `
    SELECT C.Nombre_expediente, C.Fecha_creación, C.Descripción, C.RutaExpediente
    FROM CARPETA C
    JOIN CARPETA_ESTADO CE ON C.Id_carpeta = CE.Id_carpeta
    WHERE CE.Id_estado = ?
  `;

  db.query(query, [estado], (err, results) => {
    if (err) {
      console.error('Error al obtener carpetas:', err);
      return res.status(500).json({ error: 'Error al obtener carpetas' });
    }
    res.status(200).json(results);
  });
});

// Configuración de multer para manejar la carga de archivos
const upload = multer({
  storage: multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'temp/'); // Carpeta temporal
    },
    filename: function (req, file, cb) {
      cb(null, `${Date.now()}-${file.originalname}`); // Nombre del archivo
    }
  })
});

// Endpoint para manejar la carga de archivos
app.post('/scan-expediente', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No se ha cargado ningún archivo' });
    }

    const { expediente, destinationPath } = req.body;

    if (!destinationPath) {
      return res.status(400).json({ error: 'No se especificó una ruta de destino' });
    }

    // Asegúrate de que la carpeta de destino existe
    if (!fs.existsSync(destinationPath)) {
      fs.mkdirSync(destinationPath, { recursive: true });
    }

    // Ruta del archivo cargado
    const tempFilePath = path.join(__dirname, 'temp', req.file.filename);
    const destinationFilePath = path.join(destinationPath, req.file.filename);

    // Mueve el archivo de la carpeta temporal a la ruta especificada
    fs.renameSync(tempFilePath, destinationFilePath);

    res.status(200).json({ message: 'Archivo escaneado y guardado con éxito', file: destinationFilePath });

  } catch (error) {
    console.error('Error al escanear el documento:', error);
    res.status(500).json({ error: 'Error al escanear el documento' });
  }
});


// // Middleware para obtener la ruta del expediente
// const getDestination = async (req, res, next) => {
//   try {
//     const { carpetaId } = req.body; // ID de la carpeta enviado desde el frontend

//     // Consulta para obtener la ruta del expediente
//     const query = 'SELECT RutaExpediente FROM CARPETA WHERE Id = ?';
//     db.query(query, [carpetaId], (err, results) => {
//       if (err) {
//         return res.status(500).json({ error: 'Error al consultar la base de datos' });
//       }
//       if (results.length === 0) {
//         return res.status(404).json({ error: 'Carpeta no encontrada' });
//       }

//       // Establecer la ruta del expediente en `req`
//       req.uploadDestination = results[0].RutaExpediente;
//       console.log('Ruta del expediente obtenida:', req.uploadDestination);
//       next();
//     });
//   } catch (error) {
//     console.error('Error en el middleware de destino:', error);
//     res.status(500).json({ error: 'Error en el middleware de destino' });
//   }
// };

// // Configuración de multer para almacenar archivos en una carpeta específica
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, 'uploads'); // Carpeta donde se almacenarán los archivos
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}-${file.originalname}`);
//   },
// });

 //const upload2 = multer({ storage });

// app.use(cors());
// app.use(bodyParser.json());
 
// // Crear la carpeta 'uploads' si no existe

// const uploadDir = './uploads';
// if (!fs.existsSync(uploadDir)) {
//   fs.mkdirSync(uploadDir);
// }

// Ruta para subir archivos al expediente seleccionado
app.post('/upload-file', (req, res) => {
  try {
    // Verifica que los archivos existan
    // if (!req.files || Object.keys(req.files).length === 0) {
    //   return res.status(400).send('No se seleccionaron archivos.');
    // }
    if (!req.files || !req.files.files) {
      return res.status(400).send('No se seleccionaron archivos.');
    }

    const carpetaId = req.body.carpetaId;
    if (!carpetaId) {
      return res.status(400).json({ error: 'ID de carpeta no proporcionado.' });
    }

    // Consulta a la base de datos para obtener la ruta del expediente
    const query = 'SELECT RutaExpediente FROM CARPETA WHERE Id_carpeta = ?';
    db.query(query, [carpetaId], (err, results) => {
      if (err) {
        console.error('Error al consultar la ruta del expediente:', err);
        return res.status(500).json({ error: 'Error al consultar la ruta del expediente.' });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: 'Carpeta no encontrada.' });
      }

      const carpetaRuta = results[0].RutaExpediente;

      // Verifica si la carpeta existe
      if (!fs.existsSync(carpetaRuta)) {
        return res.status(400).json({ error: 'La carpeta no existe en la ruta especificada.' });
      }

      // Iterar sobre los archivos subidos y guardarlos en la carpeta
      // Si solo se subió un archivo, req.files.file será un objeto, de lo contrario será un arreglo
      //const files = Array.isArray(req.files.writeFileSync) ? req.files.files : [req.files.files];
      const files = Array.isArray(req.files.files) ? req.files.files : [req.files.files];

      files.forEach((file) => {
        const destino = path.join(carpetaRuta, file.name);
        fs.writeFileSync(destino, file.data); // Guardar el archivo en la carpeta 
      });
      // // Iterar sobre los archivos subidos y guardarlos en la carpeta
      // Object.values(req.files).forEach((file) => {
      //   const destino = path.join(carpetaRuta, file.name);
      //   fs.writeFileSync(destino, file.data); // Guardar el archivo en la carpeta
      // });

      res.status(200).json({ message: 'Archivos subidos exitosamente al expediente.' });
    });
  } catch (error) {
    console.error('Error al subir archivos:', error);
    res.status(500).json({ error: 'Error al subir archivos.' });
  }
});

// Ruta para eliminar una carpeta
app.delete('/delete-folder', (req, res) => {
  const { Nombre_expediente } = req.body;

  if (!Nombre_expediente) {
    return res.status(400).json({ error: 'Nombre del expediente es requerido' });
  }

  //const query = 'DELETE FROM CARPETA WHERE Nombre_expediente = ?';
    // Consulta para obtener la ruta del expediente desde la base de datos
  const getFolderQuery = 'SELECT RutaExpediente FROM CARPETA WHERE Nombre_expediente = ?';

  db.query(getFolderQuery, [Nombre_expediente], (err, results) => {
    if (err) {
      console.error('Error al obtener la ruta del expediente:', err);
      return res.status(500).json({ error: 'Error al obtener la ruta del expediente' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'Carpeta no encontrada' });
    }

    const folderPath = results[0].RutaExpediente;

    // Eliminar la carpeta del sistema de archivos
    fs.rmdir(folderPath, { recursive: true }, (err) => {
      if (err) {
        console.error('Error al eliminar la carpeta del sistema de archivos:', err);
        return res.status(500).json({ error: 'Error al eliminar la carpeta del sistema de archivos' });
      }

    // Eliminar la entrada de la base de datos
    const deleteQuery = 'DELETE FROM CARPETA WHERE Nombre_expediente = ?';
    db.query(deleteQuery, [Nombre_expediente], (err, results) => {
      if (err) {
        console.error('Error al eliminar la carpeta de la base de datos:', err);
        return res.status(500).json({ error: 'Error al eliminar la carpeta de la base de datos' });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({ error: 'Carpeta no encontrada' });
      }

      res.status(200).json({ message: 'Carpeta eliminada exitosamente' });
    });
  });
});
});


app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});





