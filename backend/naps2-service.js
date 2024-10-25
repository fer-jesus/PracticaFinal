// const express = require('express');
// const { execFile } = require('child_process');
// const app = express();
// const PORT = 3001;

// app.get('/abrir-naps2', (req, res) => {
//   const command = "C:/Program Files/NAPS2/NAPS2.exe";
  
//   execFile(command, (error, stdout, stderr) => {
//     if (error) {
//       console.error(`Error al abrir NAPS2: ${error.message}`);
//       return res.status(500).json({ error: 'No se pudo abrir NAPS2' });
//     }

//     if (stderr) {
//       console.error(`Error en el proceso de apertura: ${stderr}`);
//       return res.status(500).json({ error: 'Hubo un problema al abrir NAPS2' });
//     }

//     res.status(200).json({ message: 'NAPS2 abierto con éxito' });
//   });
// });

// app.listen(PORT, () => {
//   console.log(`Servicio NAPS2 escuchando en el puerto ${PORT}`);
// });
