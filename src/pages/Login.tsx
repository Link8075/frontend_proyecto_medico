import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { 
  Button, 
  TextField, 
  Container, 
  Typography, 
  Box, 
  Link // Importación añadida
} from '@mui/material';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await api.post('/login', { username, password });
      localStorage.setItem('token', response.data.token);
      navigate('/home');
    } catch (err) {
      setError('Credenciales incorrectas');
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography component="h1" variant="h5">
          Iniciar Sesión
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            margin="normal"
            fullWidth
            label="Usuario"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Contraseña"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <Typography color="error">{error}</Typography>}
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
            Ingresar
          </Button>
          <Box sx={{ mt: 2 }}>
            <Link href="/register" variant="body2"> {/* Enlace corregido */}
              ¿No tienes cuenta? Regístrate
            </Link>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default Login;