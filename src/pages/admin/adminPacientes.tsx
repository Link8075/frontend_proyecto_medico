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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import WarningIcon from '@mui/icons-material/Warning';
import CloseIcon from '@mui/icons-material/Close';
import Navbar from './Navbar';
// import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

interface Paciente {
  id: number;
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  registro?: string;
  acepto_terminos?: boolean;
  // Agrega otros campos según necesites
}

interface Cita {
  id: number;
  nombreMedico: string;
  fecha_hora: string;
  duracion_min: string;
  estado: string;
  calificacion?: string;
  notas_paciente?: string;
  frecuencia?: string;
}

const Home: React.FC = () => {
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const [pacienteToDelete, setPacienteToDelete] = useState<number | null>(null);
  const [successMessage, setSuccessMessage] = useState('');

  const [patients, setPatients] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(null);
  const [citasInfo, setCitasInfo] = useState<Cita[]>([]);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await api.get('users/rol', {
          params: { rol: 'paciente' }
        });
        console.log(response.data);
        const patientsData = Array.isArray(response.data) ? response.data : [response.data];
        setPatients(patientsData);
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

    fetchPatients();
  }, []);

  const handlePacienteClick = async (paciente: Paciente) => {
    // http://localhost:3010/api/v1/users/medico?id=33
    try {
      // const response = await api.get('users/cita', {
      //   params: { id: paciente.id }
      // });
      // setCitasInfo(response.data);
      // console.log(citasInfo);
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
    setSelectedPaciente(paciente);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedPaciente(null);
    setCitasInfo([]);
    window.location.href = '/administrar/pacientes';
  };

  const handleEliminarClick = (usuario_id: number) => {
    setPacienteToDelete(usuario_id);
    setOpenConfirmDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!pacienteToDelete) return;

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('Token no encontrado');
      setOpenConfirmDialog(false);
      return;
    }

    try {
      await api.delete(`users/delete/${pacienteToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      // Actualiza la lista de pacientes
      const updatedPatients = patients.filter(p => p.id !== pacienteToDelete);
      setPatients(updatedPatients);

      setSuccessMessage('¡Paciente eliminado!');
      setTimeout(() => {
        setOpenConfirmDialog(false);
        setOpenModal(false);
        setSelectedPaciente(null);
        setSuccessMessage('');
      }, 3000);

      // Cierra los modales
      // setOpenConfirmDialog(false);
      // setOpenModal(false);
      // setSelectedPaciente(null);

    } catch (error) {
      console.error('Error al eliminar el paciente:', error);
      setSuccessMessage('Error al eliminar el paciente');
      setTimeout(() => {
        setOpenConfirmDialog(false);
        setSuccessMessage('');
      }, 3000);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />

      <Box component="main" sx={{ flexGrow: 1, width: '100vw', p: 0, m: 0 }}>
        <Box sx={{ width: '100%', bgcolor: 'background.paper', p: 3, boxSizing: 'border-box' }}>
          <Typography variant="h4" gutterBottom>
            Administrar pacientes
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
                Lista de pacientes registrados
              </Typography>

              <Button variant="contained" color="primary" href="/administrar/registerPaciente">
                Agregar paciente
              </Button>

              {patients.length > 0 ? (
                <List>
                  {patients.map((paciente) => (
                    <ListItem
                      key={paciente.id}
                      button // Hace que el ListItem sea clickeable
                      onClick={() => handlePacienteClick(paciente)}
                    >
                      <ListItemText
                        primary={`${paciente.nombre} ${paciente.apellidos}`}
                        secondary={`Email: ${paciente.email} | Teléfono: ${paciente.telefono}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography paragraph>
                  No se encontraron pacientes
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
        aria-labelledby="paciente-details-modal"
        aria-describedby="paciente-details-description"
      >
        <Box sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: { xs: '90%', sm: '80%', md: '700px' },
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
              title={`Paciente: ${selectedPaciente?.nombre} ${selectedPaciente?.apellidos}`}
              subheader={`ID: ${selectedPaciente?.id}`}
            />
            <Divider />
            <CardContent>
              {selectedPaciente && (
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {/* Información básica del paciente */}
                  <Typography variant="h6" gutterBottom>
                    Información Básica
                  </Typography>
                  <Typography variant="body1">
                    <strong>Email:</strong> {selectedPaciente.email}
                  </Typography>
                  <Typography variant="body1">
                    <strong>Teléfono:</strong> {selectedPaciente.telefono}
                  </Typography>
                  {selectedPaciente.registro && (
                    <Typography variant="body1">
                      <strong>Fecha de registro:</strong> {selectedPaciente.registro}
                    </Typography>
                  )}
                  <Typography variant="body1">
                    <strong>Aceptó términos y condiciones:</strong> {selectedPaciente.acepto_terminos ? 'Sí' : 'No'}
                  </Typography>

                  {/* Sección de citas */}
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Citas del Paciente
                  </Typography>

                  {citasInfo.length > 0 ? (
                    <Box>
                      {citasInfo.map((cita, index) => (
                        <Box key={cita.id} sx={{
                          mb: 3,
                          p: 2,
                          border: '1px solid',
                          borderColor: 'divider',
                          borderRadius: 1,
                          backgroundColor: index % 2 === 0 ? 'action.hover' : 'background.paper'
                        }}>
                          <Typography variant="subtitle1">
                            <strong>Cita #{index + 1}</strong>
                          </Typography>

                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
                            <Typography variant="body2">
                              <strong>Médico:</strong> {cita.nombreMedico}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Fecha y hora:</strong> {new Date(cita.fecha_hora).toLocaleString()}
                            </Typography>
                            <Typography variant="body2">
                              <strong>Duración:</strong> {cita.duracion_min} minutos
                            </Typography>
                          </Box>

                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 1 }}>
                            <Typography variant="body2">
                              <strong>Estado:</strong>
                              <Box
                                component="span"
                                sx={{
                                  ml: 1,
                                  color: cita.estado === 'completada' ? 'success.main' :
                                    cita.estado === 'cancelada' ? 'error.main' :
                                      'warning.main',
                                  fontWeight: 'bold'
                                }}
                              >
                                {cita.estado}
                              </Box>
                            </Typography>

                            {cita.calificacion && (
                              <Typography variant="body2">
                                <strong>Calificación:</strong> {cita.calificacion}/5
                              </Typography>
                            )}

                            {cita.frecuencia && (
                              <Typography variant="body2">
                                <strong>Frecuencia:</strong> {cita.frecuencia}
                              </Typography>
                            )}
                          </Box>

                          {cita.notas_paciente && (
                            <Box sx={{ mt: 1 }}>
                              <Typography variant="body2">
                                <strong>Notas del paciente:</strong>
                              </Typography>
                              <Typography variant="body2" sx={{
                                fontStyle: 'italic',
                                p: 1,
                                backgroundColor: 'background.default',
                                borderRadius: 1
                              }}>
                                {cita.notas_paciente}
                              </Typography>
                            </Box>
                          )}
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                      No se encontraron citas registradas para este paciente.
                    </Typography>
                  )}

                  {/* Botones de acción */}
                  <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => selectedPaciente && handleEliminarClick(selectedPaciente.id)}
                      sx={{
                        backgroundColor: 'red',
                        '&:hover': { backgroundColor: 'darkred' },
                        mr: 2 // margen a la derecha
                      }}
                    >
                      Eliminar paciente
                    </Button>
                    <Button
                      variant="contained"
                      sx={{ backgroundColor: 'blue', '&:hover': { backgroundColor: 'darkblue' } }}
                      onClick={() => {
                        console.log('Modificar paciente', selectedPaciente.id);
                      }}
                    >
                      Modificar paciente
                    </Button>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Box>
      </Modal>

      {/* Modal de Confirmación para Eliminar */}
      <Dialog
        open={openConfirmDialog}
        onClose={() => setOpenConfirmDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          <Box display="flex" alignItems="center">
            <WarningIcon color="error" sx={{ mr: 2 }} />
            Confirmar Eliminación
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mt: 2 }}>
            ¿Estás seguro que deseas eliminar permanentemente este paciente?
          </Typography>
          {selectedPaciente && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Paciente: <strong>{selectedPaciente.nombre} {selectedPaciente.apellidos}</strong>
            </Typography>
          )}
          <Alert severity="warning" sx={{ mt: 2 }}>
            Esta acción no se puede deshacer y eliminará todos los datos asociados al paciente.
          </Alert>
        </DialogContent>
        {successMessage && (
          <Typography
            color="failed.main"
            sx={{
              mt: 2,
              textAlign: 'center',
              fontWeight: 'bold'
            }}
          >
            {successMessage}
          </Typography>
        )}
        <DialogActions>
          <Button
            onClick={() => setOpenConfirmDialog(false)}
            variant="outlined"
            sx={{ mr: 1 }}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            startIcon={<DeleteIcon />}
            autoFocus
          >
            Confirmar Eliminación
          </Button>
        </DialogActions>
      </Dialog>

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