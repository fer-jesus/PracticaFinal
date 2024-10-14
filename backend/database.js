const mysql = require('mysql2');

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'practica_final',  
  charset: 'utf8mb4'
});

// Conexión a la base de datos
db.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conexión a la base de datos exitosa');
});

module.exports = db;
