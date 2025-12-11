import axios from 'axios';

// Assuming backend runs on localhost:3000 locally
// In production, we'll use environment variable
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;
