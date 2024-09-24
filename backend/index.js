const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt'); // Importa bcrypt para el hash de contraseñas
const db = require('./database'); // Importa la configuración de la base de datos
const fs = require('fs'); // Importa el módulo fs para el manejo del sistema de archivos
const path = require('path'); // Importa el módulo path para manejar rutas de archivos
///const multer = require('multer');//Importa el modulo multer para subir archivos
const fileUpload = require('express-fileupload');

const app = express();
const PORT = 3000;
var pathFrontend = "";

app.use(cors());
app.use(bodyParser.json());
app.use(express.json()); // Para parsear el cuerpo de las solicitudes en formato JSON
app.use(fileUpload()); // Middleware para manejar archivos

const rutasEstados = {
  'Activos': 'C:\\Users\\JFGL\\Desktop\\Expedientes\\Activos',
  'Pendientes': 'C:\\Users\\JFGL\\Desktop\\Expedientes\\Pendientes',
  'Finalizados': 'C:\\Users\\JFGL\\Desktop\\Expedientes\\Finalizados',
  
};

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

// Ruta para registrar una nueva carpeta en la base de datos
app.post('/register-folder', (req, res) => {
  const { expediente, fecha, descripcion, ruta, id_estado } = req.body;

  const queryCarpeta = `
    INSERT INTO CARPETA (Nombre_expediente, Fecha_creación, Descripción, RutaExpediente)
    VALUES (?, ?, ?, ?)
  `;

  // Inserta en la tabla CARPETA
  db.query(queryCarpeta, [expediente, fecha, descripcion, ruta], (err, results) => {
    if (err) {
      console.error('Error al registrar la carpeta:', err);
      return res.status(500).json({ error: `Error al registrar la carpeta: ${err.message}` });
    }

    // Obtener el ID de la carpeta insertada
    const idCarpeta = results.insertId;

    // Asociar la carpeta con un estado en CARPETA_ESTADO
    const queryEstado = `
      INSERT INTO CARPETA_ESTADO (Id_carpeta, Id_estado)
      VALUES (?, ?)
    `;

    // Usar el id_estado que viene en el body (por ejemplo, "1" para Activos)
    db.query(queryEstado, [idCarpeta, id_estado], (err) => {
      if (err) {
        console.error('Error al asociar la carpeta con el estado:', err);
        return res.status(500).json({ error: `Error al asociar la carpeta con el estado: ${err.message}` });
      }

      res.status(200).json({ message: 'Carpeta registrada exitosamente con estado' });
    });
  });
});

// Ruta para obtener carpetas por estado
app.get('/get-folders/:estado', (req, res) => {
  const { estado } = req.params;
  console.log('Estado recibido:', estado);
  const query = `
    SELECT C.Id_carpeta, C.Nombre_expediente, C.Fecha_creación, C.Descripción, C.RutaExpediente
    FROM CARPETA C
    INNER JOIN CARPETA_ESTADO CE ON C.Id_carpeta = CE.Id_carpeta
    INNER JOIN ESTADO E ON CE.Id_estado = E.Id_estado
    WHERE LOWER(E.Nombre_estado) = ?
  `;

  db.query(query, [estado], (err, results) => {
    if (err) {
      console.error('Error al obtener las carpetas:', err);
      return res.status(500).json({ error: 'Error al obtener las carpetas.' });
    }
    if (results.length === 0) {
      return res.status(200).json([]);
    }

    res.status(200).json(results);
  });
}); 
//hacer una carga para cada boton, el boton tiene capturar el estado haciendo un select case por ejemplo 

// app.get('/get-folders/:estado', (req, res) => {
//   const query = 'SELECT * FROM CARPETA';

//   db.query(query, (err, results) => {
//     if (err) {
//       console.error('Error al obtener las carpetas:', err);
//       return res.status(500).json({ error: 'Error al obtener las carpetas' });
//     }
//     res.status(200).json(results);
//   });
// });

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

// Ruta para cambiar el estado de una carpeta version
app.put('/cambiarEstado', (req, res) => {
  const { idCarpeta, nuevoEstado } = req.body;

  // Se obtiene el Id_estado basado en el nuevo nombre de estado
  const obtenerEstadoQuery = `SELECT Id_estado FROM ESTADO WHERE Nombre_estado = ?`;

  db.query(obtenerEstadoQuery, [nuevoEstado], (err, estadoResults) => {
    if (err) {
      console.error('Error al obtener el estado:', err);
      return res.status(500).json({ error: 'Error al obtener el estado' });
    }

    if (estadoResults.length === 0) {
      return res.status(404).json({ error: 'Estado no encontrado' });
    }

    const idNuevoEstado = estadoResults[0].Id_estado;

    // Obtención de la carpeta actual desde la base de datos
    const obtenerCarpetaQuery = `SELECT RutaExpediente FROM CARPETA WHERE Id_carpeta = ?`;

    db.query(obtenerCarpetaQuery, [idCarpeta], (err, carpetaResults) => {
      if (err) {
        console.error('Error al obtener la carpeta:', err);
        return res.status(500).json({ error: 'Error al obtener la carpeta' });
      }

      if (carpetaResults.length === 0) {
        return res.status(404).json({ error: 'Carpeta no encontrada' });
      }

      const carpeta = carpetaResults[0];
      const rutaActual = carpeta.RutaExpediente;
      const nuevaRuta = path.join(rutasEstados[nuevoEstado], path.basename(rutaActual));

      // Mover la carpeta en el sistema de archivos
      fs.rename(rutaActual, nuevaRuta, (err) => {
        if (err) {
          console.error('Error al mover la carpeta:', err);
          return res.status(500).json({ error: 'Error al mover la carpeta' });
        }

        // Actualizar la ruta en la base de datos
        const actualizarRutaQuery = `UPDATE CARPETA SET RutaExpediente = ? WHERE Id_carpeta = ?`;

        db.query(actualizarRutaQuery, [nuevaRuta, idCarpeta], (err) => {
          if (err) {
            console.error('Error al actualizar la ruta:', err);
            return res.status(500).json({ error: 'Error al actualizar la ruta en la base de datos' });
          }

          // Actualizar la tabla CARPETA_ESTADO
          const actualizarCarpetaEstadoQuery = `UPDATE CARPETA_ESTADO SET Id_estado = ? WHERE Id_carpeta = ?`;

          db.query(actualizarCarpetaEstadoQuery, [idNuevoEstado, idCarpeta], (err) => {
            if (err) {
              console.error('Error al actualizar el estado de la carpeta:', err);
              return res.status(500).json({ error: 'Error al actualizar el estado en la base de datos' });
            }

            res.status(200).json({ message: 'Estado de la carpeta cambiado y carpeta movida exitosamente' });
          });
        });
      });
    });
  });
});

// // Ruta para escanear archivos
// app.post('/escanear', (req, res) => {
//   const file = req.files?.file;
//   const destinationPath = req.body.destinationPath;

//   if (!file) {
//     return res.status(400).json({ error: 'No se ha proporcionado ningún archivo' });
//   }

//   // Asegúrate de que la ruta de destino exista
//   if (!fs.existsSync(destinationPath)) {
//     return res.status(400).json({ error: 'La ruta especificada no existe.' });
//   }

//   // Guarda el archivo en la ruta de destino
//   const filePath = path.join(destinationPath, file.name);
//   file.mv(filePath, (err) => {
//     if (err) {
//       return res.status(500).json({ error: 'Error al guardar el archivo' });
//     }
//     res.status(200).json({ message: 'Archivo escaneado guardado exitosamente', filePath });
//   });
// });

// Ruta para subir archivos al expediente seleccionado
app.post('/upload-file', (req, res) => {
  try {
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
   
      res.status(200).json({ message: 'Archivos subidos exitosamente al expediente.' });
    });
  } catch (error) {
    console.error('Error al subir archivos:', error);
    res.status(500).json({ error: 'Error al subir archivos.' });
  }
});

//Ruta para eliminar una carpeta version
app.delete('/delete-folder', (req, res) => {
  const { Id_carpeta } = req.body;

  if (!Id_carpeta) {
    console.error('ID de la carpeta es requerido');
    return res.status(400).json({ error: 'ID de la carpeta es requerido' });
  }

  // Consulta para obtener la ruta del expediente usando el ID de la carpeta
  const getFolderQuery = 'SELECT RutaExpediente FROM CARPETA WHERE Id_carpeta = ?';
  db.query(getFolderQuery, [Id_carpeta], (err, results) => {
    if (err) {
      console.error('Error al obtener la ruta del expediente:', err);
      return res.status(500).json({ error: 'Error al obtener la ruta del expediente' });
    }

    if (results.length === 0) {
      console.error('Carpeta no encontrada');
      return res.status(404).json({ error: 'Carpeta no encontrada' });
    }

    const folderPath = results[0].RutaExpediente;
    console.log('Ruta del expediente:', folderPath);

    // Eliminar las entradas relacionadas en CARPETA_ESTADO
    const deleteRelatedQuery = 'DELETE FROM CARPETA_ESTADO WHERE Id_carpeta = ?';
    db.query(deleteRelatedQuery, [Id_carpeta], (err, relatedResults) => {
      if (err) {
        console.error('Error al eliminar las referencias en CARPETA_ESTADO:', err);
        return res.status(500).json({ error: 'Error al eliminar las referencias en CARPETA_ESTADO' });
      }

      // Si no hay errores, proceder a eliminar la carpeta de la base de datos
      const deleteQuery = 'DELETE FROM CARPETA WHERE Id_carpeta = ?';
      db.query(deleteQuery, [Id_carpeta], (err, dbResults) => {
        if (err) {
          console.error('Error al eliminar la carpeta de la base de datos:', err);
          return res.status(500).json({ error: 'Error al eliminar la carpeta de la base de datos' });
        }

        if (dbResults.affectedRows === 0) {
          console.error('Carpeta no encontrada en la base de datos');
          return res.status(404).json({ error: 'Carpeta no encontrada en la base de datos' });
        }

        // Si la carpeta se eliminó de la base de datos, eliminar del sistema de archivos
        fs.rmdir(folderPath, { recursive: true }, (err) => {
          if (err) {
            console.error('Error al eliminar la carpeta del sistema de archivos:', err);
            return res.status(500).json({ error: 'Error al eliminar la carpeta del sistema de archivos' });
          }

          res.status(200).json({ message: 'Carpeta eliminada exitosamente' });
        });
      });
    });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});





