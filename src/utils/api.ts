import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3010/api/v1/', // Asegúrate que el puerto coincida con tu backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
// Originalmente estaba en el puerto 3000
// http://localhost:3010/api/v1/auth/login