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
  CssBaseline,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Modal
} from '@mui/material';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nombre: '',
    apellidos: '',
    telefono: '',
    acepto_terminos: false
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nombre: '',
    apellidos: '',
    telefono: '',
    acepto_terminos: ''
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [openTermsModal, setOpenTermsModal] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleOpenTermsModal = () => {
    setOpenTermsModal(true);
  };

  const handleCloseTermsModal = () => {
    setOpenTermsModal(false);
  };

  const handleAcceptTerms = () => {
    setFormData({
      ...formData,
      acepto_terminos: true
    });
    setErrors({
      ...errors,
      acepto_terminos: ''
    });
    handleCloseTermsModal();
  };

  const validate = () => {
    let valid = true;
    const newErrors = {
      email: '',
      password: '',
      confirmPassword: '',
      nombre: '',
      apellidos: '',
      telefono: '',
      acepto_terminos: ''
    };

    if (!formData.email) {
      newErrors.email = 'El correo es obligatorio';
      valid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Correo electrónico inválido';
      valid = false;
    }

    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
      valid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = 'La contraseña debe tener al menos 8 caracteres';
      valid = false;
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Las contraseñas no coinciden';
      valid = false;
    }

    if (!formData.nombre) {
      newErrors.nombre = 'El nombre es obligatorio';
      valid = false;
    }

    if (!formData.apellidos) {
      newErrors.apellidos = 'Los apellidos son obligatorios';
      valid = false;
    }

    if (!formData.acepto_terminos) {
      newErrors.acepto_terminos = 'Debes aceptar los términos y condiciones';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      const userData = {
        email: formData.email,
        password: formData.password,
        rol: 'paciente',
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        telefono: formData.telefono,
        acepto_terminos: formData.acepto_terminos
      };

      const response = await api.post('users/', userData);
      // localStorage.setItem('token', response.data.token);
      setSuccessMessage('¡Usuario registrado con éxito!');
      setTimeout(() => {
        navigate('/');
      }, 3000);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error al registrarse';
      if (err.response?.status === 409) {
        setErrors({ ...errors, email: message });
      } else {
        console.error(err);
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
              Registrarse
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
                name="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
                autoComplete="email"
              />

              <TextField
                fullWidth
                label="Contraseña"
                type="password"
                margin="normal"
                name="password"
                value={formData.password}
                onChange={handleChange}
                error={!!errors.password}
                helperText={errors.password}
                autoComplete="new-password"
              />

              <TextField
                fullWidth
                label="Confirmar Contraseña"
                type="password"
                margin="normal"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword}
                autoComplete="new-password"
              />

              <TextField
                fullWidth
                label="Nombre"
                margin="normal"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                error={!!errors.nombre}
                helperText={errors.nombre}
              />

              <TextField
                fullWidth
                label="Apellidos"
                margin="normal"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                error={!!errors.apellidos}
                helperText={errors.apellidos}
              />

              <TextField
                fullWidth
                label="Teléfono"
                margin="normal"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                error={!!errors.telefono}
                helperText={errors.telefono}
              />

              <Box sx={{ mt: 2, width: '100%' }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      name="acepto_terminos"
                      checked={formData.acepto_terminos}
                      onChange={handleChange}
                      color="primary"
                    />
                  }
                  label={
                    <Typography>
                      Acepto los{' '}
                      <Link
                        component="button"
                        variant="body2"
                        onClick={handleOpenTermsModal}
                        sx={{
                          textDecoration: 'underline',
                          '&:hover': { cursor: 'pointer' }
                        }}
                      >
                        términos y condiciones
                      </Link>
                    </Typography>
                  }
                />
                {errors.acepto_terminos && (
                  <FormHelperText error sx={{ ml: 0 }}>
                    {errors.acepto_terminos}
                  </FormHelperText>
                )}
              </Box>

              {/* Modal de Términos y Condiciones */}
              <Modal
                open={openTermsModal}
                onClose={handleCloseTermsModal}
                aria-labelledby="terms-modal-title"
                aria-describedby="terms-modal-description"
              >
                <Paper sx={{
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  transform: 'translate(-50%, -50%)',
                  width: { xs: '90%', sm: '80%', md: '70%' },
                  maxWidth: 800,
                  maxHeight: '80vh',
                  p: 4,
                  overflowY: 'auto'
                }}>
                  <Typography variant="h5" id="terms-modal-title" gutterBottom>
                    Términos y Condiciones
                  </Typography>

                  <Box id="terms-modal-description" sx={{ mb: 3 }}>
                    <Typography paragraph>
                      <strong>1. Aceptación de los Términos</strong><br />
                      Al registrarte en nuestra plataforma, aceptas cumplir con estos términos y condiciones.
                    </Typography>
                    <Typography paragraph>
                      <strong>2. Uso del Servicio</strong><br />
                      El servicio está destinado únicamente para uso personal y no comercial.
                    </Typography>
                    <Typography paragraph>
                      <strong>3. Privacidad</strong><br />
                      Respetamos tu privacidad y protegemos tus datos personales según nuestra Política de Privacidad.
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button
                      variant="outlined"
                      onClick={handleCloseTermsModal}
                    >
                      Cerrar
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleAcceptTerms}
                    >
                      Aceptar Términos
                    </Button>
                  </Box>
                </Paper>
              </Modal>

              {successMessage && (
                <Typography
                  color="success.main"
                  sx={{
                    mt: 2,
                    textAlign: 'center',
                    fontWeight: 'bold'
                  }}
                >
                  {successMessage}
                </Typography>
              )}

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Registrarse
              </Button>

              <Box textAlign="center">
                <Link href="/" variant="body2">
                  ¿Ya tienes cuenta? Inicia Sesión
                </Link>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default Register;