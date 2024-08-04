import React from 'react';
import { Container, Box, Typography, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, ButtonGroup, Button } from '@mui/material';
import StateButtons from '../components/StateButtons';
import "../styles/estados.css";

const ActivosPage = () => {


  // Datos quemados
  const data = [
    { expediente: '001', fecha: '2024-07-31', descripcion: 'Descripción del expediente 001' },
    { expediente: '002', fecha: '2024-08-01', descripcion: 'Descripción del expediente 002' },
    { expediente: '003', fecha: '2024-08-02', descripcion: 'Descripción del expediente 003' },
    { expediente: '004', fecha: '2024-07-31', descripcion: 'Descripción del expediente 004' },
    { expediente: '005', fecha: '2024-08-01', descripcion: 'Descripción del expediente 005' },
    
  ];


  return (
    <div className="activo-container">
    <Container>
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh'
      }}
    >
      <Typography variant="h4" sx={{ marginBottom: 2 }}>Activos</Typography>
      <StateButtons />

      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Expediente</TableCell>
                  <TableCell>Fecha</TableCell>
                  <TableCell>Descripción</TableCell>
                  <TableCell>Acciones</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {data.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell>{row.expediente}</TableCell>
                    <TableCell>{row.fecha}</TableCell>
                    <TableCell>{row.descripcion}</TableCell>
                    <TableCell>
                      <ButtonGroup variant="contained" aria-label="outlined primary button group">
                        <Button>Acción 1</Button>
                        <Button>Acción 2</Button>
                        <Button>Acción 3</Button>
                      </ButtonGroup>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>




    </Box>
  </Container>
  </div>
);
};

export default ActivosPage;