DROP DATABASE practica_final;
CREATE DATABASE practica_final;
USE spractica_final;

CREATE TABLE USUARIO (
    Id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    Nombres VARCHAR(25) NOT NULL,
    Apellidos VARCHAR(25) NOT NULL,
    Telefono  CHAR(8) NOT NULL,
    Email VARCHAR(25) NOT NULL,
    Fecha_nacimiento DATE NOT NULL,
    Edad INT,
    Direccion VARCHAR(25) NOT NULL,
    Rol VARCHAR(25) NOT NULL, -- ROL 1: SECRETARIA  -- ROL 2: PRACTICANTE
    NombreUsuario VARCHAR(25) UNIQUE NOT NULL,
    Contraseña VARCHAR(25) NOT NULL
    );

CREATE TABLE CARPETA (
    Id_carpeta INT AUTO_INCREMENT PRIMARY KEY,
    Nombre_expediente VARCHAR(40) NOT NULL,
    Fecha_creación TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Descripción VARCHAR(40),
    Ruta_expediente VARCHAR(255) NOT NULL

      );
 
CREATE TABLE ESTADO (
    Id_estado INT AUTO_INCREMENT PRIMARY KEY,
    Nombre_estado VARCHAR(15) NOT NULL
      );
       
CREATE TABLE USUARIO_CARPETA (
    Id_tipoUsuario INT AUTO_INCREMENT PRIMARY KEY,
    Id_usuario INT,
    Id_carpeta INT,
    Fecha_modificacionCarpeta TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Id_usuario) REFERENCES USUARIO(Id_usuario),
    FOREIGN KEY (Id_carpeta) REFERENCES CARPETA(Id_carpeta)
      );

CREATE TABLE CARPETA_ESTADO (
    Id_carpetaEstado INT AUTO_INCREMENT PRIMARY KEY,
    Id_carpeta INT,
    Id_estado INT,
    Fecha_cambioEstado TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Id_carpeta) REFERENCES CARPETA(Id_carpeta),
    FOREIGN KEY (Id_estado) REFERENCES ESTADO(Id_estado)
      );

	