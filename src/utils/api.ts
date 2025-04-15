import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api', // Asegúrate que el puerto coincida con tu backend
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;