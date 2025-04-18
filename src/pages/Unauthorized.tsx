import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  CssBaseline
} from '@mui/material';
import { ROLES } from '../constants/roles';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleGoBack = () => navigate(-1);

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          width: '100vw',
          position: 'fixed',
          top: 0,
          left: 0,
          p: 2,
          boxSizing: 'border-box'
        }}
      >
        <Paper
          elevation={3}
          sx={{
            p: 4,
            width: '100%',
            maxWidth: 500,
            textAlign: 'center',
            borderRadius: 2
          }}
        >
          <Typography variant="h4" color="error" gutterBottom>
            ⚠️ Acceso no autorizado
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            No tienes permisos para acceder a esta página.
          </Typography>

          {user.rol && (
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              (Tu rol actual: <strong>{user.rol}</strong>)
            </Typography>
          )}

          <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            gap: 2,
            flexWrap: 'wrap'
          }}>
            <Button
              variant="outlined"
              onClick={handleGoBack}
              sx={{ textTransform: 'none' }}
            >
              Volver atrás
            </Button>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default Unauthorized;