// FILE: src/api/axiosInstance.js
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:3000', // Pointing to your Express backend
    withCredentials: true, // CRITICAL: This allows HttpOnly cookies to be sent
});

export default api;