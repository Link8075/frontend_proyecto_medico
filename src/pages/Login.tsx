import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import {
  Button,
  TextField,
  Typography,
  Box,
  Link,
  Grid,
  Paper,
  CssBaseline
} from '@mui/material';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Resetear errores
    setEmailError('');
    setPasswordError('');

    // Validación simple
    let hasError = false;
    if (!email) {
      setEmailError('El correo es obligatorio');
      hasError = true;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError('Correo electrónico inválido');
      hasError = true;
    }

    if (!password) {
      setPasswordError('La contraseña es obligatoria');
      hasError = true;
    } else if (password.length < 8) {
      setPasswordError('La contraseña debe tener al menos 8 caracteres');
      hasError = true;
    }

    if (hasError) return;

    try {
      const response = await api.post('auth/login', { email, password });
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify({
        email: response.data.user.email,
        nombre: response.data.user.nombre,
        apellido: response.data.user.apellido,
        rol: response.data.user.rol,
      }));
      navigate('/home');
    } catch (err: any) {
      if (err.response?.status === 404) {
        // Error de correo no encontrado
        setEmailError(err.response.data.message);
      } else if (err.response?.status === 401) {
        // Error de contraseña incorrecta
        setPasswordError(err.response.data.message);
      } else {
        // Otros errores
        setPasswordError('Error al iniciar sesión');
      }
    }
  };

  return (
    <>
      <CssBaseline />
      <Grid
        container
        justifyContent="center"
        alignItems="center"
        sx={{
          minHeight: '100vh',
          width: '100vw',
          margin: 0,
          p: 2,
          bgcolor: 'background.default'
        }}
      >
        <Grid sx={{ maxWidth: 480 }}>
          <Paper
            elevation={3}
            sx={{
              p: 4,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%'
            }}
          >
            <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
              Iniciar Sesión
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ width: '100%' }}
            >
              <TextField
                fullWidth
                label="Correo electrónico"
                margin="normal"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                error={!!emailError}
                helperText={emailError}
                autoComplete="email"
              />

              <TextField
                fullWidth
                label="Contraseña"
                type="password"
                margin="normal"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!passwordError}
                helperText={passwordError}
                autoComplete="current-password"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                INGRESAR
              </Button>

              <Box textAlign="center">
                <Link href="/register" variant="body2">
                  ¿No tienes cuenta? Regístrate
                </Link>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default Login;