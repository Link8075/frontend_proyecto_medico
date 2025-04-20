import React, { useEffect, useState } from 'react';
import api from '../../utils/api';
import {
  Typography,
  Box,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Modal,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Divider,
  Button
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Navbar from './Navbar';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface Doctor {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  registro?: string;
  acepto_terminos?: boolean;
  // Agrega otros campos según necesites
}

interface Medico {
  id: number;
  cedula_profesional?: string;
  especialidad?: string;
  dias_laborables?: string;
  horario?: string;
  direccion_consultorio?: string;
  coordenadas_consultorio?: {
    x: number;
    y: number;
  };
  cedula_validada?: boolean;
}

const Home: React.FC = () => {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [medicoInfo, setMedicoInfo] = useState<Medico | null>(null);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get('users/rol', {
          params: { rol: 'medico' }
        });
        // console.log(response.data);
        const doctorsData = Array.isArray(response.data) ? response.data : [response.data];
        setDoctors(doctorsData);
      } catch (err: any) {
        if (err.response) {
          setError(`Error del servidor: ${err.response.data.message || err.response.status}`);
        } else if (err.request) {
          setError('No se recibió respuesta del servidor');
        } else {
          setError(`Error al configurar la solicitud: ${err.message}`);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  const handleDoctorClick = async (doctor: Doctor) => {
    // http://localhost:3010/api/v1/users/medico?id=33
    try {
      // const response = api.get(`users/medico?id=${doctor.id}`);
      const response = await api.get('users/medico', {
        params: { id: doctor.id }
      });
      setMedicoInfo(response.data);
      console.log(medicoInfo);
    }
    catch (err: any) {
      if (err.response) {
        setError(`Error del servidor: ${err.response.data.message || err.response.status}`);
      } else if (err.request) {
        setError('No se recibió respuesta del servidor');
      } else {
        setError(`Error al configurar la solicitud: ${err.message}`);
      }
    }
    // console.log(doctor.id);
    setSelectedDoctor(doctor);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedDoctor(null);
    setMedicoInfo(null);
    window.location.href = '/administrar/doctores';
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <Box component="main" sx={{ flexGrow: 1, width: '100vw', p: 0, m: 0 }}>
        <Box sx={{ width: '100%', bgcolor: 'background.paper', p: 3, boxSizing: 'border-box' }}>
          <Typography variant="h4" gutterBottom>
            Administrar doctores
          </Typography>

          {loading ? (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          ) : error ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          ) : (
            <>
              <Typography paragraph>
                Lista de doctores registrados
              </Typography>

              <Button variant="contained" color="primary" href="/administrar/registerDoctor">
                Agregar doctor
              </Button>

              {doctors.length > 0 ? (
                <List>
                  {doctors.map((doctor) => (
                    <ListItem
                      key={doctor.id}
                      button // Hace que el ListItem sea clickeable
                      onClick={() => handleDoctorClick(doctor)}
                    >
                      <ListItemText
                        primary={`${doctor.nombre} ${doctor.apellidos}`}
                        secondary={`Email: ${doctor.email} | Teléfono: ${doctor.telefono}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography paragraph>
                  No se encontraron doctores
                </Typography>
              )}
            </>
          )}
        </Box>
      </Box>

      {/* Modal para mostrar información detallada */}
      <Modal
        open={openModal}
        onClose={handleCloseModal}
        aria-labelledby="doctor-details-modal"
        aria-describedby="doctor-details-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: '80%', md: '600px' },
          bgcolor: 'background.paper',
          boxShadow: 24,
          borderRadius: 2,
          outline: 'none',
          maxHeight: '80vh',
          overflowY: 'auto'
        }}>
          <Card>
            <CardHeader
              action={
                <IconButton aria-label="close" onClick={handleCloseModal}>
                  <CloseIcon />
                </IconButton>
              }
              title={`Dr. ${selectedDoctor?.nombre} ${selectedDoctor?.apellidos}`}
              subheader={`ID: ${selectedDoctor?.id}`}
            />
            <Divider />
            <CardContent>
              {selectedDoctor && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {/* Información básica del doctor */}
                  <Typography variant="h6" gutterBottom>
                    Información Básica
                  </Typography>
                  <Typography variant="body1">
                    <strong>Email:</strong> {selectedDoctor.email}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Teléfono:</strong> {selectedDoctor.telefono}
                  </Typography>
                  {selectedDoctor.registro && (
                    <Typography variant="body1">
                      <strong>Fecha de registro:</strong> {selectedDoctor.registro}
                    </Typography>
                  )}
                  <Typography variant="body1">
                    <strong>Aceptó términos y condiciones:</strong> {selectedDoctor.acepto_terminos ? 'Sí' : 'No'}
                  </Typography>

                  {/* Información adicional del médico */}
                  {medicoInfo && (
                    <>
                      <Divider sx={{ my: 2 }} />
                      <Typography variant="h6" gutterBottom>
                        Información Profesional
                      </Typography>
                      {medicoInfo.cedula_profesional && (
                        <Typography variant="body1">
                          <strong>Cédula profesional:</strong> {medicoInfo.cedula_profesional} ({medicoInfo.cedula_validada ? 'Verificada' : 'Sin verificar'})
                        </Typography>
                      )}
                      {medicoInfo.especialidad && (
                        <Typography variant="body1">
                          <strong>Especialidad:</strong> {medicoInfo.especialidad}
                        </Typography>
                      )}
                      {medicoInfo.dias_laborables && (
                        <Typography variant="body1">
                          <strong>Días laborables:</strong> {medicoInfo.dias_laborables}
                        </Typography>
                      )}
                      {medicoInfo.horario && (
                        <Typography variant="body1">
                          <strong>Horario:</strong> {medicoInfo.horario}
                        </Typography>
                      )}
                      {medicoInfo.direccion_consultorio && (
                        <Typography variant="body1">
                          <strong>Dirección del consultorio:</strong> {medicoInfo.direccion_consultorio}
                        </Typography>
                      )}
                      {medicoInfo?.coordenadas_consultorio && (
                        <>
                          <Typography variant="body1">
                            <strong>Coordenadas:</strong> Lat: {medicoInfo.coordenadas_consultorio.x}, Long: {medicoInfo.coordenadas_consultorio.y}
                          </Typography>

                          {/* Mostrar mapa con marcador */}
                          <Typography variant="body1" sx={{ mt: 2 }}>
                            <strong>Ubicación del Consultorio</strong>
                          </Typography>

                          {/* Agregar key única para forzar remontaje */}
                          <LoadScript
                            googleMapsApiKey="AIzaSyA7ZIR6z4DjcadOSEEX8Z0pemUVDEY7ThY"
                            key={`${medicoInfo.id}-${medicoInfo.coordenadas_consultorio.x}-${medicoInfo.coordenadas_consultorio.y}`}
                          >
                            <GoogleMap
                              mapContainerStyle={{ width: '100%', height: '200px' }}
                              center={{
                                lat: medicoInfo.coordenadas_consultorio.x,
                                lng: medicoInfo.coordenadas_consultorio.y
                              }}
                              zoom={15}
                            >
                              <Marker
                                position={{
                                  lat: medicoInfo.coordenadas_consultorio.x,
                                  lng: medicoInfo.coordenadas_consultorio.y
                                }}
                              />
                            </GoogleMap>
                          </LoadScript>
                        </>
                      )}
                      {/* <Typography variant="body1">
                        <strong>Cédula validada:</strong> {medicoInfo.cedula_validada ? 'Sí' : 'No'}
                      </Typography> */}
                    </>
                  )}
                  {!medicoInfo && (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      No se encontró información profesional adicional para este médico.
                    </Typography>
                  )}
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Modal>

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