const express = require('express');
const { exec } = require('child_process');

const app = express();
const PORT = 4000; // Puerto donde el servicio de NAPS2 estará escuchando

// Ruta para abrir NAPS2
app.get('/abrir-naps2', (req, res) => {
  const command = "/app/NAPS2/NAPS2.exe"; // Ruta de NAPS2 en el host

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error al abrir NAPS2: ${error.message}`);
      return res.status(500).json({ error: 'No se pudo abrir NAPS2' });
    }

    if (stderr) {
      console.error(`Error al abrir NAPS2: ${stderr}`);
      return res.status(500).json({ error: 'Hubo un problema al abrir NAPS2' });
    }

    return res.status(200).json({ message: 'NAPS2 abierto con éxito' });
  });
});

app.listen(PORT, () => {
  console.log(`Servicio de NAPS2 escuchando en el puerto ${PORT}`);
});
