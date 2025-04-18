import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import HomePaciente from './pages/paciente/Home';
import HomeMedico from './pages/medico/Home';
import HomeAdmin from './pages/admin/Home';
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
                    return <Navigate to="/unauthorized" replace />;
                }
              })()}
            </ProtectedRoute>
          }
        />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Rutas protegidas por rol (opcional) */}
        {/* <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <HomeAdmin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/medico/dashboard"
          element={
            <ProtectedRoute allowedRoles={['medico']}>
              <HomeMedico />
            </ProtectedRoute>
          }
        /> */}
      </Routes>
    </Router>
  );
}

export default App;