import React from 'react';
import { Navigate } from 'react-router-dom';
import { ROLES, RoleValues } from '../constants/roles';

interface ProtectedRouteProps {
  children: React.ReactElement;
  allowedRoles?: RoleValues[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const token = localStorage.getItem('token');
  const userData = localStorage.getItem('user');
  const user = userData ? JSON.parse(userData) : null;

  // Si no hay token, redirige al login
  if (!token || !user) {
    return <Navigate to="/unauthorized" replace />;
  }
  // Si se especificaron roles y el usuario no tiene uno permitido, redirige
  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    return <Navigate to="/unauthorized" replace />;
  }
  //Las condiciones anteriores se manejan por separado en caso de llegar a requerir manejarlas de manera disntinta

  return children;
};

export default ProtectedRoute;