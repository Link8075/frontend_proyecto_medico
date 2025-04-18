import React from 'react';
import { Button, Typography, Container } from '@mui/material';

const Home: React.FC = () => {
  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Bienvenido, Admin
      </Typography>
      <Button 
        variant="contained" 
        color="secondary"
        onClick={() => {
          localStorage.removeItem('token');
          window.location.href = '/';
        }}
      >
        Cerrar Sesión
      </Button>
    </Container>
  );
};

export default Home;