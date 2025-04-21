import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import HomePaciente from './pages/paciente/Home';
import HomeMedico from './pages/medico/Home';
import HomeAdmin from './pages/admin/Home';
import AdminDoctores from './pages/admin/adminDoctores';
import AdminPacientes from './pages/admin/adminPacientes';
import RegisterDoctor from './pages/admin/RegisterDoctor';
import RegisterPaciente from './pages/admin/RegisterPaciente';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Unauthorized from './pages/Unauthorized';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Redirige a la pagina principal al iniciar sesión según el rol */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              {(() => {
                const user = localStorage.getItem('user');
                const role = user ? JSON.parse(user).rol : null;

                switch (role) {
                  case 'paciente':
                    return <HomePaciente />;
                  case 'medico':
                    return <HomeMedico />;
                  case 'admin':
                    return <HomeAdmin />;
                  default:
                    return <Unauthorized />;
                }
              })()}
            </ProtectedRoute>
          }
        />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/administrar/doctores"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDoctores />
            </ProtectedRoute>
          }
        />
        <Route path="/administrar/registerDoctor"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <RegisterDoctor />
            </ProtectedRoute>
          }
        />
        <Route path="/administrar/pacientes"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPacientes />
            </ProtectedRoute>
          }
        />
        <Route path="/administrar/registerPaciente"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <RegisterPaciente />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;