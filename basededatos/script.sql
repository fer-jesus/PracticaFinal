CREATE DATABASE IF NOT EXISTS expedientesBP;

CREATE TABLE IF NOT EXISTS  USUARIO (
    Id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    Nombres VARCHAR(25) NOT NULL,
    Apellidos VARCHAR(25) NOT NULL,
    Telefono  CHAR(8) NOT NULL,
    Email VARCHAR(25) NOT NULL,
    Fecha_nacimiento DATE NOT NULL,
    Edad INT,
    Direccion VARCHAR(25) NOT NULL,
    Rol VARCHAR(25) NOT NULL, 
    NombreUsuario VARCHAR(25) UNIQUE NOT NULL,
    Contraseña VARCHAR(255) NOT NULL
    );
    -- ROL 1: SECRETARIA  -- ROL 2: PRACTICANTE

CREATE TABLE IF NOT EXISTS CARPETA (
    Id_carpeta INT AUTO_INCREMENT PRIMARY KEY,
    Nombre_expediente VARCHAR(40) NOT NULL,
    Fecha_creación TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Descripción VARCHAR(40),
    RutaExpediente VARCHAR(255) UNIQUE NOT NULL
      );
 
CREATE TABLE IF NOT EXISTS ESTADO (
    Id_estado INT AUTO_INCREMENT PRIMARY KEY,
    Nombre_estado VARCHAR(15) NOT NULL
      );
       
CREATE TABLE IF NOT EXISTS USUARIO_CARPETA (
    Id_tipoUsuario INT AUTO_INCREMENT PRIMARY KEY,
    Id_usuario INT,
    Id_carpeta INT,
    Fecha_modificacionCarpeta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Id_usuario) REFERENCES USUARIO(Id_usuario) ON DELETE CASCADE,
    FOREIGN KEY (Id_carpeta) REFERENCES CARPETA(Id_carpeta) ON DELETE CASCADE
      );

CREATE TABLE IF NOT EXISTS CARPETA_ESTADO (
    Id_carpetaEstado INT AUTO_INCREMENT PRIMARY KEY,
    Id_carpeta INT,
    Id_estado INT,
    Fecha_cambioEstado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Id_carpeta) REFERENCES CARPETA(Id_carpeta) ON DELETE CASCADE,
    FOREIGN KEY (Id_estado) REFERENCES ESTADO(Id_estado)
      );

INSERT INTO ESTADO (Nombre_estado) VALUES ('Activos'), ('Pendientes'), ('Finalizados');

INSERT INTO CARPETA_ESTADO (Id_carpeta, Id_estado) VALUES (1, 1), -- Acivos
							                                            (2, 2), -- Pendientes
							                                            (3, 3); -- Finalizados