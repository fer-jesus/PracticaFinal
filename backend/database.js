const mysql = require('mysql2');
require('dotenv').config();

// Cambia a 'db' envés de localhost, que es el nombre del servicio en Docker Compose
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  database: process.env.DB_DATABASE,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  multipleStatements: true 
});

connection.connect((err) => {
  if (err) {
    console.error('Error conectando a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos');
});

module.exports = connection;
