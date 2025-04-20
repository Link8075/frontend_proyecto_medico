import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';
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
  Modal,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Chip
} from '@mui/material';

// Días de la semana para el selector
const DAYS_OF_WEEK = [
  { value: '0', label: 'Domingo' },
  { value: '1', label: 'Lunes' },
  { value: '2', label: 'Martes' },
  { value: '3', label: 'Miércoles' },
  { value: '4', label: 'Jueves' },
  { value: '5', label: 'Viernes' },
  { value: '6', label: 'Sábado' }
];

// Horarios laborales
const WORK_SCHEDULES = [
  { value: 'Matutino', label: 'Matutino (8:00 - 14:00)' },
  { value: 'Vespertino', label: 'Vespertino (14:00 - 20:00)' },
  { value: 'Tiempo completo', label: 'Tiempo completo (8:00 - 20:00)' }
];

// Opciones sobre la validación de la cédula
const VALIDACION_OPCIONES = [
  { value: 0, label: 'No validada' },
  { value: 1, label: 'Validada' }
];

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    // Datos básicos
    email: '',
    password: '',
    confirmPassword: '',
    nombre: '',
    apellidos: '',
    telefono: '',
    acepto_terminos: false,

    // Datos profesionales
    cedula_profesional: '',
    especialidad: '',
    dias_laborables: [] as string[],
    horario_laboral: '',
    direccion_consultorio: '',
    coordenadas_consultorio: { lat: 0, lng: 0 },
    cedula_validada: false
  });

  const [errors, setErrors] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    nombre: '',
    apellidos: '',
    telefono: '',
    acepto_terminos: '',
    cedula_profesional: '',
    especialidad: '',
    dias_laborables: '',
    horario_laboral: '',
    direccion_consultorio: '',
    coordenadas_lat: '',
    coordenadas_lng: ''
  });

  const [successMessage, setSuccessMessage] = useState('');
  const [openTermsModal, setOpenTermsModal] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, checked, type } = e.target;

    if (name === 'coordenadas_lat' || name === 'coordenadas_lng') {
      const numValue = parseFloat(value) || 0;
      setFormData({
        ...formData,
        coordenadas_consultorio: {
          ...formData.coordenadas_consultorio,
          [name === 'coordenadas_lat' ? 'lat' : 'lng']: numValue
        }
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value
      });
    }
  };

  const handleSelectChange = (e: any) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDaysChange = (e: any) => {
    const { value } = e.target;
    setFormData({
      ...formData,
      dias_laborables: typeof value === 'string' ? value.split(',') : value
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

  /* 
  // Código de geocodificación comentado para uso futuro
  const handleGeocode = async () => {
    if (!formData.direccion_consultorio) {
      setErrors({
        ...errors,
        direccion_consultorio: 'Ingresa una dirección para buscar coordenadas'
      });
      return;
    }

    setIsGeocoding(true);

    try {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode(
        { address: formData.direccion_consultorio },
        (results, status) => {
          setIsGeocoding(false);

          if (status === 'OK' && results?.[0]?.geometry?.location) {
            const location = results[0].geometry.location;
            setFormData({
              ...formData,
              coordenadas_consultorio: {
                lat: location.lat(),
                lng: location.lng()
              }
            });
          } else {
            setErrors({
              ...errors,
              direccion_consultorio: 'No se pudo encontrar la ubicación. Verifica la dirección.'
            });
          }
        }
      );
    } catch (error) {
      setIsGeocoding(false);
      setErrors({
        ...errors,
        direccion_consultorio: 'Error al conectar con el servicio de mapas'
      });
    }
  };
  */

  const validate = () => {
    let valid = true;
    const newErrors = {
      email: '',
      password: '',
      confirmPassword: '',
      nombre: '',
      apellidos: '',
      telefono: '',
      acepto_terminos: '',
      cedula_profesional: '',
      especialidad: '',
      dias_laborables: '',
      horario_laboral: '',
      direccion_consultorio: '',
      coordenadas_lat: '',
      coordenadas_lng: ''
    };

    // Validaciones básicas
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

    // Validaciones de datos profesionales
    if (!formData.cedula_profesional) {
      newErrors.cedula_profesional = 'La cédula profesional es obligatoria';
      valid = false;
    }

    if (!formData.especialidad) {
      newErrors.especialidad = 'La especialidad es obligatoria';
      valid = false;
    }

    if (formData.dias_laborables.length === 0) {
      newErrors.dias_laborables = 'Selecciona al menos un día laborable';
      valid = false;
    }

    if (!formData.horario_laboral) {
      newErrors.horario_laboral = 'Selecciona un horario laboral';
      valid = false;
    }

    if (!formData.direccion_consultorio) {
      newErrors.direccion_consultorio = 'La dirección del consultorio es obligatoria';
      valid = false;
    }

    // Validaciones para coordenadas
    if (formData.coordenadas_consultorio.lat === 0 && formData.coordenadas_consultorio.lng === 0) {
      newErrors.coordenadas_lat = 'Las coordenadas son obligatorias';
      newErrors.coordenadas_lng = 'Las coordenadas son obligatorias';
      valid = false;
    } else {
      if (Math.abs(formData.coordenadas_consultorio.lat) > 90) {
        newErrors.coordenadas_lat = 'Latitud debe estar entre -90 y 90';
        valid = false;
      }
      if (Math.abs(formData.coordenadas_consultorio.lng) > 180) {
        newErrors.coordenadas_lng = 'Longitud debe estar entre -180 y 180';
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      // Primero registrar el usuario básico
      const userData = {
        email: formData.email,
        password: formData.password,
        rol: 'medico',
        nombre: formData.nombre,
        apellidos: formData.apellidos,
        telefono: formData.telefono,
        acepto_terminos: formData.acepto_terminos
      };

      const userResponse = await api.post('users/', userData);
      // console.log(userResponse.data)

      // Luego registrar la información profesional
      const medicoData = {
        usuario_id: userResponse.data.usuario_id,
        cedula_profesional: formData.cedula_profesional,
        especialidad: formData.especialidad,
        dias_laborables: formData.dias_laborables.join(','),
        horario_laboral: formData.horario_laboral,
        direccion_consultorio: formData.direccion_consultorio,
        coordenadas_consultorio: `${formData.coordenadas_consultorio.lat},${formData.coordenadas_consultorio.lng}`,
        cedula_validada: formData.cedula_validada
      };

      // await api.post('users/medico', medicoData);

      setSuccessMessage('¡Médico registrado con éxito!');
      // setTimeout(() => {
      //   navigate('/administrar/doctores');
      // }, 3000);
    } catch (err: any) {
      const message = err.response?.data?.message || 'Error al registrar';
      if (err.response?.status === 409) {
        setErrors({ ...errors, email: message });
      } else {
        console.error(err);
        setErrors({
          ...errors,
          cedula_profesional: 'Error al registrar la información profesional'
        });
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
              Registrar Médico
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ width: '100%' }}
            >
              <Typography variant="h6" gutterBottom sx={{ mt: 2 }}>
                Información Básica
              </Typography>

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

              <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                Información Profesional
              </Typography>

              <TextField
                fullWidth
                label="Cédula Profesional"
                margin="normal"
                name="cedula_profesional"
                value={formData.cedula_profesional}
                onChange={handleChange}
                error={!!errors.cedula_profesional}
                helperText={errors.cedula_profesional}
              />

              <TextField
                fullWidth
                label="Especialidad"
                margin="normal"
                name="especialidad"
                value={formData.especialidad}
                onChange={handleChange}
                error={!!errors.especialidad}
                helperText={errors.especialidad}
              />

              <FormControl fullWidth margin="normal">
                <InputLabel>Estado de validación de cédula</InputLabel>
                <Select
                  name="cedula_validada"
                  value={formData.cedula_validada ? 1 : 0} // Convertimos boolean a 0/1
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      cedula_validada: e.target.value === 1 // Convertimos 0/1 a boolean
                    });
                  }}
                  label="Estado de validación de cédula"
                >
                  {VALIDACION_OPCIONES.map((opcion) => (
                    <MenuItem key={opcion.value} value={opcion.value}>
                      {opcion.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <FormControl fullWidth margin="normal" error={!!errors.dias_laborables}>
                <InputLabel>Días Laborables</InputLabel>
                <Select
                  multiple
                  name="dias_laborables"
                  value={formData.dias_laborables}
                  onChange={handleDaysChange}
                  renderValue={(selected) => (
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={DAYS_OF_WEEK.find(day => day.value === value)?.label || value}
                        />
                      ))}
                    </Box>
                  )}
                >
                  {DAYS_OF_WEEK.map((day) => (
                    <MenuItem key={day.value} value={day.value}>
                      {day.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.dias_laborables && (
                  <FormHelperText>{errors.dias_laborables}</FormHelperText>
                )}
              </FormControl>

              <FormControl fullWidth margin="normal" error={!!errors.horario_laboral}>
                <InputLabel>Horario Laboral</InputLabel>
                <Select
                  name="horario_laboral"
                  value={formData.horario_laboral}
                  onChange={handleSelectChange}
                  label="Horario Laboral"
                >
                  {WORK_SCHEDULES.map((schedule) => (
                    <MenuItem key={schedule.value} value={schedule.value}>
                      {schedule.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.horario_laboral && (
                  <FormHelperText>{errors.horario_laboral}</FormHelperText>
                )}
              </FormControl>

              <TextField
                fullWidth
                label="Dirección del Consultorio"
                margin="normal"
                name="direccion_consultorio"
                value={formData.direccion_consultorio}
                onChange={handleChange}
                error={!!errors.direccion_consultorio}
                helperText={errors.direccion_consultorio}
                multiline
                rows={3}
              />

              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Latitud"
                    type="number"
                    margin="normal"
                    name="coordenadas_lat"
                    value={formData.coordenadas_consultorio.lat}
                    onChange={handleChange}
                    error={!!errors.coordenadas_lat}
                    helperText={errors.coordenadas_lat || "Ej: 19.4326"}
                    inputProps={{
                      step: "0.000001",
                      min: "-90",
                      max: "90"
                    }}
                  />
                </Grid>
                <Grid item xs={6}>
                  <TextField
                    fullWidth
                    label="Longitud"
                    type="number"
                    margin="normal"
                    name="coordenadas_lng"
                    value={formData.coordenadas_consultorio.lng}
                    onChange={handleChange}
                    error={!!errors.coordenadas_lng}
                    helperText={errors.coordenadas_lng || "Ej: -99.1332"}
                    inputProps={{
                      step: "0.000001",
                      min: "-180",
                      max: "180"
                    }}
                  />
                </Grid>
              </Grid>

              {/* <Box sx={{ mt: 2, mb: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handleGeocode}
                  disabled={isGeocoding || !formData.direccion_consultorio}
                  startIcon={isGeocoding ? <CircularProgress size={20} /> : null}
                >
                  {isGeocoding ? 'Buscando ubicación...' : 'Obtener coordenadas'}
                </Button>
              </Box>

              {formData.coordenadas_consultorio.lat !== 0 && formData.coordenadas_consultorio.lng !== 0 && (
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Typography variant="body2">
                    Coordenadas obtenidas: Lat: {formData.coordenadas_consultorio.lat.toFixed(6)},
                    Lng: {formData.coordenadas_consultorio.lng.toFixed(6)}
                  </Typography>

                  {mapLoaded && (
                    <LoadScript googleMapsApiKey="AIzaSyA7ZIR6z4DjcadOSEEX8Z0pemUVDEY7ThY">
                      <GoogleMap
                        mapContainerStyle={{ width: '100%', height: '300px', marginTop: '16px' }}
                        center={formData.coordenadas_consultorio}
                        zoom={15}
                      >
                        <Marker position={formData.coordenadas_consultorio} />
                      </GoogleMap>
                    </LoadScript>
                  )}
                </Box>
              )} */}

              {formData.coordenadas_consultorio.lat !== 0 && formData.coordenadas_consultorio.lng !== 0 && (
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Typography variant="body2">
                    Coordenadas ingresadas: Lat: {formData.coordenadas_consultorio.lat.toFixed(6)},
                    Lng: {formData.coordenadas_consultorio.lng.toFixed(6)}
                  </Typography>
                </Box>
              )}

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
                      Al registrar un usuario en nuestra plataforma, usted verifica la veracidad de los datos proporcionados.
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
                    mb: 3,
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
                Registrar
              </Button>
              <Box textAlign="center">
                <Link href="/administrar/doctores" variant="body2">
                  Volver
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