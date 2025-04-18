import React from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button
} from '@mui/material';
import Navbar from './Navbar';

const Home: React.FC = () => {

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100vw',
          p: 0,
          m: 0
        }}
      >
        <Box sx={{
          width: '100%',
          bgcolor: 'background.paper',
          p: 3,
          boxSizing: 'border-box'
        }}>
          <Typography variant="h4" gutterBottom>
            Bienvenido, paciente
          </Typography>
          <Typography paragraph>
            Contenido principal que ahora ocupa todo el ancho disponible...
          </Typography>
        </Box>
      </Box>

      <Box
        component="footer"
        sx={{
          width: '100vw',
          py: 3,
          bgcolor: 'primary.main',
          color: 'white',
          textAlign: 'center'
        }}
      >
        <Typography variant="body2">
          © {new Date().getFullYear()} Mi Aplicación
        </Typography>
      </Box>
    </Box>
  );
};

export default Home;